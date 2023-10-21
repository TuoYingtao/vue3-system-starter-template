import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

declare global {

  /** 请求参数类型 */
  type Params = number | string | boolean | Record<string, any> | Recordable
      | number[] | string[] | boolean[] | Record<string, any>[] | Recordable[];

  /** FormData 类型 */
  type FormDataParams = Record<any, any> | Recordable;

  /** 分页 */
  interface PageInfo {
    /** 总页数 */
    total: number;
    /** 当前页数 */
    currentPage: number;
    /** 上一页 */
    prePage: number;
    /** 下一页 */
    lastPage: number;
  }

  /** 基本实体类型 */
  interface BaseEntity {
    createTime?: number;
    updateTime?: number;
    [key: string]: any;
  }

  /** 基本分页列表实体类型 */
  interface BaseEntityList<T extends BaseEntity> extends PageInfo {
    list: T[];
  }

  /** 实体顶类型 */
  type Entity = BaseEntity | BaseEntityList<BaseEntity>;

  /** 响应实体 */
  interface Result<T extends typeof Entity = Entity> {
    code: number;
    result: T;
    msg: string;
  }

}

/** 创建Axios选项 */
export interface AxiosOptionsConfig extends AxiosRequestConfig {
  /**
   * 令牌前缀 例如: authenticationScheme: 'Bearer'
   * https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
   * */
  authenticationScheme?: string;
  /** 超时时间 */
  timeout: number;
  /** 是否允许携带Cookie */
  withCredentials: boolean;
  /** 请求头 */
  headers: Record<string, string>;
  /** 数据处理 */
  transform?: AxiosTransform;
  /** 中央控制器配置选项 */
  requestOptions: RequestOptions;
}

/** Axios 中央控制器 */
export interface AxiosTransform {
  /** 请求前处理配置 Hook */
  beforeRequestHook?: (config: RequestConfigWithOptional, options: RequestOptions) => RequestConfigWithOptional;

  /** 请求前的拦截器 */
  requestInterceptors?: (config: RequestConfigWithOptional, options: AxiosOptionsConfig) => RequestConfigWithOptional;

  /** 请求响应拦截器处理 */
  responseInterceptors?: (res: AxiosResponse) => Promise<AxiosResponse>;

  /** 转换前 Hook；处理请求数据。如果数据不是预期格式，可直接抛出错误 */
  transformResponseHook?: (res: AxiosResponseResult, options: RequestOptions) => BaseResponseResult;

  /** 请求响应的拦截器错误处理 */
  responseInterceptorsCatch?: (error: AxiosError) => Promise<AxiosResponseError>;

  /** 请求失败处理 */
  requestCatchHook?: (e: AxiosResponseError, options: RequestOptions) => AxiosResponseError;

  /** 请求前的拦截器错误处理 */
  requestInterceptorsCatch?: (error: AxiosError) => Promise<AxiosError>;
}

export interface RequestOptions {
  /** 接口地址 */
  apiUrl?: string;
  /** 是否自动添加接口前缀 */
  isJoinPrefix?: boolean;
  /** 接口前缀 */
  urlPrefix?: string;
  /** post请求的时候添加参数到url */
  joinParamsToUrl?: boolean;
  /** 格式化提交参数时间 */
  formatDate?: boolean;
  /** 需要对返回数据进行处理 */
  isTransformResponse?: boolean;
  /** 当code为200时，需要对返回数据进行处理 */
  isTransformCodeResponse?: boolean;
  /** 是否返回原生响应头 比如：需要获取响应头时使用该属性 */
  isReturnNativeResponse?: boolean;
  /** 忽略重复请求 */
  ignoreRepeatRequest?: boolean;
  /** 是否加入时间戳 */
  joinTime?: boolean;
  /** 是否携带token */
  withToken?: boolean;
  /** 令牌在Header头部的字段。 若未设置 fieldToken 则默认：Authorization */
  fieldToken?: string;
  /** 是否需要防止数据重复提交 */
  isRepeatSubmit: boolean;
  /** 重试 */
  retry?: {
    /** 重试次数 */
    count: number;
    /** 重试间隔时间 */
    delay: number;
  };
}

export type AxiosResponseResult = AxiosResponse<Result<Entity>, RequestConfigWithOptional>;

export type BaseResponseResult = AxiosResponse<Result<Entity>, RequestConfigWithOptional> | Result<Entity>;

/** 请求配置信息 */
export interface RequestConfigWithOptional<D = FormDataParams> extends AxiosRequestConfig<D> {
  /** 重试次数 */
  retryCount?: number;
  /** 请求选项 */
  requestOptions?: RequestOptions;
}

/** Axios 请求异常响应信息 */
export class AxiosResponseError<T = Result<Entity>, D = FormDataParams> extends AxiosError<T, D> {
  /** 请求配置信息 */
  config?: RequestConfigWithOptional<D>;
  response?: AxiosResponseResult;
}
