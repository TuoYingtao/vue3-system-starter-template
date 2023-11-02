import { BaseClassEntity } from "@/api/generator/models/BaseClassEntity";

interface IData {
  form: BaseClassEntity;
  queryParams: Record<string, any>;
  rules: Record<string, Record<string, any>[]>;
}
export const DATA: IData = {
  form: {
    id: 0,
    packageName: '',
    code: '',
    fields: '',
    remark: '',
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
  },
  rules: {
    configName: [{ required: true, message: "参数名称不能为空", trigger: "blur" }],
    configKey: [{ required: true, message: "参数键名不能为空", trigger: "blur" }],
    configValue: [{ required: true, message: "参数键值不能为空", trigger: "blur" }]
  }
}
