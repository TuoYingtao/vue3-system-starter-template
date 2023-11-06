import { IServiceApi } from "@/api/abstract/IServiceApi";

export class ServiceDecorator<T extends BaseEntity, L extends BaseEntityList<T>> implements IServiceApi<T, L> {

  private service: IServiceApi<T, L>;


  constructor(service: IServiceApi<T, L>) {
    this.service = service;
  }

  delete(id: Params): Promise<Result> {
    return this.decoratorHandler(() => this.service.delete(id));
  }

  detail(id: Params): Promise<Result<T>> {
    return this.decoratorHandler(() => this.service.detail(id));
  }

  list(param: Params): Promise<Result<T[]>> {
    return this.decoratorHandler(() => this.service.list(param));
  }

  page(param: Params): Promise<Result<L>> {
    return this.decoratorHandler(() => this.service.page(param));
  }

  update(entity: T): Promise<Result<T>> {
    return this.decoratorHandler(() => this.service.update(entity));
  }

  save(entity: T): Promise<Result<T>> {
    return this.decoratorHandler(() => this.service.save(entity));
  }

  sort(id: Params, param: Params): Promise<Result> {
    return this.decoratorHandler(() => this.service.sort(id, param));
  }

  private decoratorHandler(fun: any) {
    return fun();
  }

}
