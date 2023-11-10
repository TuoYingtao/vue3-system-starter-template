<template>
  <el-dialog :title="title" v-model="open" width="800px" draggable append-to-body @close="onClose">
    <el-form ref="FormRef" :model="formData" :rules="rules" label-width="90px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="表名" prop="tableName">
            <el-tooltip class="box-item" effect="dark" content="表名" :show-after="700" placement="top">
              <el-input v-model="formData.tableName" disabled placeholder="请输入表名" />
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="说明" prop="tableComment">
            <el-tooltip class="box-item" effect="dark" content="说明" :show-after="700" placement="top">
              <el-input v-model="formData.tableComment" placeholder="请输入说明" />
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="类名" prop="className">
            <el-tooltip class="box-item" effect="dark" content="类名如：UserEntity" :show-after="700" placement="top">
              <el-input v-model="formData.className" placeholder="请输入类名" />
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="继承" prop="baseclassId">
            <el-tooltip class="box-item" effect="dark" content="继承" :show-after="700" placement="top">
              <el-select style="width: 100%;" v-model="formData.baseclassId" placeholder="选择继承">
                <el-option v-for="item in baseClassList" :key="item.id" :label="item.code" :value="item.id"/>
              </el-select>
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="模块名" prop="moduleName">
            <el-tooltip class="box-item" effect="dark" content="模块名如：Glume" :show-after="700" placement="top">
              <el-input v-model="formData.moduleName" placeholder="请输入模块名" />
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="功能名" prop="functionName">
            <el-tooltip class="box-item" effect="dark" content="功能名如：member" :show-after="700" placement="top">
              <el-input v-model="formData.functionName" placeholder="请输入功能名" />
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目包名" prop="packageName">
            <el-tooltip class="box-item" effect="dark" content="项目包名如：com.project.net" :show-after="700" placement="top">
              <el-input v-model="formData.packageName" placeholder="请输入项目包名" />
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="版本号" prop="version">
            <el-tooltip class="box-item" effect="dark" content="版本号如：1.0.0" :show-after="700" placement="top">
              <el-input v-model="formData.version" placeholder="请输入版本号" />
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="默认作者" prop="author">
            <el-tooltip class="box-item" effect="dark" content="默认作者如：TuoYingtao" :show-after="700" placement="top">
              <el-input v-model="formData.author" placeholder="请输入默认作者" />
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="作者邮箱" prop="email">
            <el-tooltip class="box-item" effect="dark" content="作者邮箱" :show-after="700" placement="top">
              <el-input v-model="formData.email" placeholder="请输入作者邮箱" />
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生成方式" prop="generatorType">
            <el-tooltip class="box-item" effect="dark" content="生成方式" :show-after="700" placement="top">
              <el-radio-group v-model="formData.generatorType">
                <el-radio :label="GeneratorTypeEnum.ZIP">zip压缩包</el-radio>
                <el-radio :label="GeneratorTypeEnum.CUSTOM_PATH">自定义路径</el-radio>
              </el-radio-group>
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="表单布局" prop="formLayout">
            <el-tooltip class="box-item" effect="dark" content="表单布局" :show-after="700" placement="top">
              <el-radio-group v-model="formData.formLayout">
                <el-radio :label="FormLayoutEnum.ONE_ROW">一列</el-radio>
                <el-radio :label="FormLayoutEnum.TWO_ROW">两列</el-radio>
              </el-radio-group>
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-show="formData.generatorType === GeneratorTypeEnum.CUSTOM_PATH">
          <el-form-item label="后端生成路径" prop="backendPath">
            <el-tooltip class="box-item" effect="dark" content="后端生成路径" :show-after="700" placement="top">
              <el-input v-model="formData.backendPath" placeholder="请输入后端生成路径" />
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-show="formData.generatorType === GeneratorTypeEnum.CUSTOM_PATH">
          <el-form-item label="前端生成路径" prop="frontendPath">
            <el-tooltip class="box-item" effect="dark" content="前端生成路径" :show-after="700" placement="top">
              <el-input v-model="formData.frontendPath" placeholder="请输入前端生成路径" />
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="success" @click="onGeneratorCode">生成代码</el-button>
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="FormDialog">
import { DATA, Props } from "@/views/generator/table/constants";
import { FormLayoutEnum, GeneratorTypeEnum } from "@/enum";

const emit = defineEmits([]);
// 表单Ref
const FormRef = ref();
// 常量
const { form, rules } = DATA;
// 打开弹窗状态
const open = ref(false);
const props: Props = withDefaults(defineProps<Props>(), {
  title: '',
  formData: () => DATA.form,
  baseClassList: () => []
});

/**
 * 提交
 */
const submitForm = () => {
  FormRef.value.validate((valid: boolean) => {
    if (valid) {
      const key = props.formData.id !== -1 ? 'onAmendSubmitForm' : 'onSaveSubmitForm';
      if (props.formData.hasOwnProperty('id') && props.formData.id === -1) {
        props.formData.id = undefined;
        props.formData = JSON.parse(JSON.stringify(props.formData));
      }
      emit(key as never, props.formData);
    }
  })
};

/**
 * 生成代码
 */
const onGeneratorCode = () => {
  FormRef.value.validate((valid: boolean) => {
    if (valid) {
      emit('onGeneratorCode' as never, props.formData);
    }
  });
}

/**
 * 关闭
 */
const cancel = () => {
  onClose();
};

/**
 * 打开弹窗
 */
const onOpen = () => open.value = true;

/**
 * 关闭弹窗
 */
const onClose = () => {
  open.value = false;
  resetForm();
};

/**
 * 重置表单
 */
const resetForm = () => {
  FormRef.value.resetFields();
  props.formData.id = -1;
};
defineExpose({ onOpen, onClose, resetForm })
</script>

<style scoped lang="scss">

</style>
