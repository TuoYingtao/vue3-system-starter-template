import { getInfo, logout } from "@/api/login";

const getInfoFun = (callBack?: Function, failBack?: Function) => {
  return new Promise((resolve, reject) => {
    getInfo().then((res: Record<string, any>) => callBack && resolve(callBack(res)))
        .catch((error: Error) => failBack && reject(failBack(error)));
  });
};

const logOutFun = (params: string, callBack?: Function, failBack?: Function) => {
  return new Promise((resolve, reject) => {
    logout(params).then((res: Record<string, any>) => callBack && resolve(callBack(res)))
        .catch((error: Error) => failBack && reject(failBack(error)));
  });
};

const useRequest = {
  getInfoFun,
  logOutFun
}
export default function () {
  return useRequest;
};
