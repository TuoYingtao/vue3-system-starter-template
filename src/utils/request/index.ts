import merge from 'lodash/merge';
import { VAxios } from './Axios';
import { AxiosOptionsConfig} from "@/type/axios";
import { AxiosTransformAbstract } from "@/utils/request/AxiosTransform";
import * as AxiosConstants from "@/utils/request/AxiosConstants";

const VITE = import.meta.env;
// 如果是mock模式 或 没启用直连代理 就不配置host 会走本地Mock拦截 或 Vite 代理
const host = VITE.VITE_REQUEST_PROXY !== 'true' ? '' : VITE.VITE_APP_BASE_API;

const defaultConfig: AxiosOptionsConfig = {
  authenticationScheme: 'Bearer',
  timeout: 10 * 1000,
  withCredentials: false,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
  transform: new AxiosTransformAbstract(),
  requestOptions: {
    apiUrl: host,
    isJoinPrefix: false,
    urlPrefix: AxiosConstants.AxiosUrlPrefixEnum.SYSTEM,
    isReturnNativeResponse: false,
    isTransformResponse: true,
    isTransformCodeResponse: true,
    joinParamsToUrl: false,
    formatDate: true,
    joinTime: true,
    ignoreRepeatRequest: true,
    withToken: true,
    fieldToken: AxiosConstants.AxiosFieldToken,
    isRepeatSubmit: true,
    retry: {
      count: 3,
      delay: 1000,
    },
  },
}

function createAxios(opt?: Partial<AxiosOptionsConfig>) {
  return new VAxios(merge(<AxiosOptionsConfig> defaultConfig, opt || {}));
}
export const request = createAxios();
