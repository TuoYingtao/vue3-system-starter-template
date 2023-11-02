/**
 * Request 请求基类 一般不做修改
 *
 * @Author: TuoYingtao
 * @Date: 2023-11-02 14:45:33
 * @Version: v1.0.0
*/
export abstract class IServiceApi<T extends BaseEntity, L extends BaseEntityList<T>> {

  /**
   * 列表
   * @param param
   */
  abstract list(param: Params): Promise<Result<T[]>>;

  /**
   * 分页
   * @param param
   */
  abstract page(param: Params): Promise<Result<L>>;

  /**
   * 详情
   * @param id
   */
  abstract detail(id: Params): Promise<Result<T>>;

  /**
   * 保存
   * @param entity
   */
  abstract save(entity: T): Promise<Result<T>>;

  /**
   * 修改
   * @param entity
   */
  abstract put(entity: T): Promise<Result<T>>;

  /**
   * 删除
   * @param id
   */
  abstract delete(id: Params): Promise<Result>;

  /**
   * 排序
   * @param id
   * @param param
   */
  abstract sort(id: Params, param: Params): Promise<Result>;
}
