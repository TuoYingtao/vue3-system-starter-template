import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig, AxiosInterceptorManager } from 'axios';
import { stringify } from 'qs';
import isFunction from 'lodash/isFunction';
import cloneDeep from 'lodash/cloneDeep';
import { AxiosCanceler } from './AxiosCancel';
import {
  AxiosOptionsConfig, AxiosResponseError,
  AxiosResponseResult,
  BaseResponseResult,
  RequestConfigWithOptional,
  RequestOptions
} from '@/type/axios';
import { ContentTypeEnum, HttpMethodsEnum } from "@/utils/request/AxiosConstants";

/** Axios模块 */
export class VAxios {

  /** axios句柄 */
  private instance: AxiosInstance;

  /** axios选项 */
  private readonly options: AxiosOptionsConfig;

  /** 请求拦截器 */
  private REQUEST_INTERCEPTORS: number | undefined;

  /** 响应拦截器 */
  private RESPONSE_INTERCEPTORS: number | undefined;

  constructor(options: AxiosOptionsConfig) {
    this.options = options;
    this.instance = axios.create(options);
    const useInterceptors = this.setupInterceptors();
    if (useInterceptors) {
      const { useRequestInterceptor, useResponseInterceptor} = useInterceptors;
      this.REQUEST_INTERCEPTORS = useRequestInterceptor;
      this.RESPONSE_INTERCEPTORS = useResponseInterceptor;
    }
  }

  /** 创建axios实例 */
  private createAxios(options: AxiosOptionsConfig): VAxios {
    this.instance = axios.create(options);
    return this;
  }

  /** 获取axios中央控制器 */
  private getTransform() {
    const { transform } = this.options;
    return transform;
  }

  /** 获取axios实例 */
  getAxios(): AxiosInstance {
    return this.instance;
  }

  /** 配置axios */
  configAxios(options: AxiosOptionsConfig): VAxios {
    return this.createAxios(options);
  }

  /** 设置通用头信息 */
  setHeader(headers: Record<string, string>): VAxios {
    Object.assign(this.instance.defaults.headers, headers);
    return this;
  }

  /** 删除请求拦截器 */
  removeRequestInterceptors(): VAxios {
    if (this.REQUEST_INTERCEPTORS) {
      this.removeInterceptors(this.instance.interceptors.request, this.REQUEST_INTERCEPTORS);
    }
    return this;
  }

  /** 删除响应拦截器 */
  removeResponseInterceptors(): VAxios {
    if (this.RESPONSE_INTERCEPTORS) {
      this.removeInterceptors(this.instance.interceptors.response, this.RESPONSE_INTERCEPTORS);
    }
    return this;
  }

  /** 删除拦截器 */
  private removeInterceptors(axiosInterceptors: AxiosInterceptorManager<RequestConfigWithOptional>, interceptors: number) {
    axiosInterceptors.eject(interceptors);
  }

  /** 设置拦截器 */
  private setupInterceptors() {
    const transform = this.getTransform();
    if (!transform) return;
    const { requestInterceptors, requestInterceptorsCatch, responseInterceptors, responseInterceptorsCatch } =
      transform;
    const axiosCanceler = new AxiosCanceler();
    // 请求前处理
    const beforeRequestHandler = (config: RequestConfigWithOptional) => {
      // @ts-ignore
      const { headers: { ignoreRepeatRequest } } = config;
      const ignoreRepeat = ignoreRepeatRequest ?? this.options.requestOptions?.ignoreRepeatRequest;
      if (!ignoreRepeat) axiosCanceler.addPending(config);
      if (requestInterceptors && isFunction(requestInterceptors)) {
        config = requestInterceptors(config, this.options);
      }
      return config;
    };
    // 请求前错误处理
    const beforeRequestCatchHandler = (error: AxiosError) =>
        requestInterceptorsCatch && isFunction(requestInterceptorsCatch) ? requestInterceptorsCatch(error) : undefined;
    // 设置请求前拦截器
    const useRequestInterceptor = this.instance.interceptors.request.use(beforeRequestHandler, beforeRequestCatchHandler);
    // 响应结果处理
    const responseHandler = (res: AxiosResponse) => {
      if (res) axiosCanceler.removePending(res.config);
      if (responseInterceptors && isFunction(responseInterceptors)) {
        return responseInterceptors(res);
      }
      return res;
    };
    // 响应错误处理
    const responseCatchHandler = (error: AxiosError) =>
        responseInterceptorsCatch && isFunction(responseInterceptorsCatch) ? responseInterceptorsCatch(error) : undefined;
    // 响应结果处理
    const useResponseInterceptor = this.instance.interceptors.response.use(responseHandler, responseCatchHandler);
    return { useRequestInterceptor, useResponseInterceptor };
  }

  /** 支持Form Data */
  supportFormData(config: RequestConfigWithOptional) {
    const headers = config.headers || this.options.headers;
    const contentType = headers?.['Content-Type'] || headers?.['content-type'];
    if (contentType !== ContentTypeEnum.FORM_DATA
        || !Reflect.has(config, 'data')
        || config.method?.toUpperCase() === HttpMethodsEnum.GET) {
      return config;
    }
    return {
      ...config,
      data: stringify(config.data, { arrayFormat: 'brackets' }),
    };
  }

  get<R = BaseResponseResult>(config: RequestConfigWithOptional, options?: RequestOptions): Promise<R> {
    return this.request<R>({ ...config, method: HttpMethodsEnum.GET }, options);
  }

  post<R = BaseResponseResult>(config: RequestConfigWithOptional, options?: RequestOptions): Promise<R> {
    return this.request<R>({ ...config, method: HttpMethodsEnum.POST }, options);
  }

  put<R = BaseResponseResult>(config: RequestConfigWithOptional, options?: RequestOptions): Promise<R> {
    return this.request<R>({ ...config, method: HttpMethodsEnum.PUT }, options);
  }

  delete<R = BaseResponseResult>(config: RequestConfigWithOptional, options?: RequestOptions): Promise<R> {
    return this.request<R>({ ...config, method: HttpMethodsEnum.DELETE }, options);
  }

  patch<R = BaseResponseResult>(config: RequestConfigWithOptional, options?: RequestOptions): Promise<R> {
    return this.request<R>({ ...config, method: HttpMethodsEnum.PATCH }, options);
  }

  /** 请求 */
  async request<R = BaseResponseResult>(config: RequestConfigWithOptional, options?: RequestOptions): Promise<R> {
    let conf = cloneDeep(config);
    const transform = this.getTransform();
    const { requestOptions } = this.options;
    const opt: RequestOptions = { ...requestOptions, ...options };
    const { beforeRequestHook, requestCatchHook, transformResponseHook } = transform || {};
    if (beforeRequestHook && isFunction(beforeRequestHook)) {
      conf = beforeRequestHook(conf, opt);
    }
    conf.requestOptions = opt;
    conf = this.supportFormData(conf) as RequestConfigWithOptional;
    return new Promise((resolve, reject) => {
      this.instance
        .request<Result, AxiosResponse<Result>, RequestConfigWithOptional>((!config.retryCount ? conf : config) as AxiosRequestConfig)
        .then((res: AxiosResponseResult) => {
          if (transformResponseHook && isFunction(transformResponseHook)) {
            try {
              resolve(transformResponseHook(res, opt) as unknown as Promise<R>);
            } catch (err) {
              reject(err || new Error('请求错误!'));
            }
          }
          resolve(res as unknown as Promise<R>);
        })
        .catch((e: AxiosResponseError) => {
          if (axios.isAxiosError(e)) {
            // 在这里重写Axios的错误信息
          }
          if (requestCatchHook && isFunction(requestCatchHook)) {
            reject(requestCatchHook(e, opt));
          }
          reject(e);
        });
    });
  }
}
