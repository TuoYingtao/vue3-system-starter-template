import { IServiceApi } from "@/api/abstract/IServiceApi";
import { BaseClassEntity, BaseClassEntityList } from "@/api/generator/models/BaseClassEntity";
import request from "@/utils/request/index";

export class BaseClassApiService extends IServiceApi<BaseClassEntity, BaseClassEntityList> {

  delete(id: Params): Promise<Result> {
    return request.delete<Result<BaseClassEntity>>({
      url: '/baseclass',
      params: id,
    });
  }

  detail(id: Params): Promise<Result<BaseClassEntity>> {
    return request.get<Result<BaseClassEntity>>({
      url: `/baseclass/${id}`,
    });
  }

  page(param: Params): Promise<Result<BaseClassEntityList>> {
    return request.get<Result<BaseClassEntityList>>({
      url: '/baseclass/page',
      params: param,
    });
  }

  update(entity: BaseClassEntity): Promise<Result<BaseClassEntity>> {
    return request.put<Result<BaseClassEntity>>({
      url: '/baseclass',
      params: entity,
    });
  }

  save(entity: BaseClassEntity): Promise<Result<BaseClassEntity>> {
    return request.post<Result<BaseClassEntity>>({
      url: '/baseclass',
      params: entity,
    });
  }

}