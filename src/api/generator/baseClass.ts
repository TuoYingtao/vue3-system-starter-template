import request from '@/utils/request/index';
import { BaseClassEntity, BaseClassEntityList } from "@/api/generator/models/BaseClassEntity";

export function baseClassPageApi(param: Params) {
  return request.get<Result<BaseClassEntityList>>({
    url: '/baseclass/page',
    params: param,
  });
}

export function baseClassDetailApi(id: Params) {
  return request.get<Result<BaseClassEntity>>({
    url: `/baseclass/${id}`,
  });
}

export function baseClassSaveApi(entity: BaseClassEntity) {
  return request.post<Result>({
    url: '/baseclass',
    params: entity,
  });
}

export function baseClassPutApi(entity: BaseClassEntity) {
  return request.put<Result<BaseClassEntity>>({
    url: '/baseclass',
    params: entity,
  });
}

export function baseClassDeleteApi(id: Params) {
  return request.delete<Result<BaseClassEntity>>({
    url: '/baseclass',
    params: id,
  });
}
