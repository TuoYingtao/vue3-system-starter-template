import { FormRules } from "element-plus";
import { TableEntity } from "@/api/generator/models/TableEntity";
import { DatasourceEntity } from "@/api/generator/models/DatasourceEntity";

interface IData {
  form: TableEntity;
  queryParams: Record<string, any>;
  rules: FormRules;
  fill: Record<string, string>[];
  query: Record<string, string>[];
  formType: Record<string, string>[];
}

export const DEFAULT_FORM: TableEntity = {
  id: -1,
  author: '',
  backendPath: '',
  className: '',
  datasourceId: -1,
  email: '',
  formLayout: 0,
  frontendPath: '',
  functionName: '',
  generatorType: 0,
  moduleName: '',
  packageName: '',
  tableComment: '',
  tableName: '',
  version: '',
  baseclassId: 0,
  fieldList: [],
}

export const DATA: IData = {
  form: DEFAULT_FORM,
  queryParams: {
    pageNum: 1,
    limit: 10,
  },
  rules: {
    columnType: [{ required: true, message: "字段类型不能为空", trigger: "blur" }],
    attrType: [{ required: true, message: "属性类型不能为空", trigger: "blur" }],
  },
  fill: [
    { label: 'DEFAULT', value: 'DEFAULT' },
    { label: 'INSERT', value: 'INSERT' },
    { label: 'UPDATE', value: 'UPDATE' },
    { label: 'INSERT_UPDATE', value: 'INSERT_UPDATE' }
  ],
  query: [
    { label: '=', value: '=' },
    { label: '!=', value: '!=' },
    { label: '>', value: '>' },
    { label: '>=', value: '>=' },
    { label: '<', value: '<' },
    { label: '<=', value: '<=' },
    { label: 'like', value: 'like' },
    { label: 'left like', value: 'left like' },
    { label: 'right like', value: 'right like' }
  ],
  formType: [
    { label: '单行文本', value: 'text' },
    { label: '多行文本', value: 'textarea' },
    { label: '富文本编辑器', value: 'editor' },
    { label: '下拉框', value: 'select' },
    { label: '单选按钮', value: 'radio' },
    { label: '复选框', value: 'checkbox' },
    { label: '日期', value: 'date' },
    { label: '日期时间', value: 'datetime' }
  ],
}

export interface Props {
  title: string;
  formData: TableEntity;
}

export interface ImportProps {
  title: string;
  datasourceList: DatasourceEntity[];
}
