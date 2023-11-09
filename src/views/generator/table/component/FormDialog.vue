<template>
  <el-drawer :title="title" v-model="open" :size="1200" :with-header="false">
    <el-tabs v-model="activeName" @tab-click="handleTabsClick">
      <el-tab-pane label="属性设置" name="field">
        <el-form ref="FormRef" :model="formData" :rules="rules" label-width="80px">
          <el-form-item label="字段类型" prop="columnType">
            <el-tooltip class="box-item" effect="dark" content="字段类型如：int2" placement="top">
              <el-input v-model="formData.columnType" placeholder="请输入字段类型" />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="属性类型" prop="attrType">
            <el-tooltip class="box-item" effect="dark" content="属性类型如：Integer" placement="top">
              <el-input v-model="formData.attrType" placeholder="请输入属性类型" />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="属性包名" prop="packageName">
            <el-tooltip class="box-item" effect="dark" content="基类所在的包名路径" placement="top">
              <el-input v-model="formData.packageName" placeholder="请输入属性包名" />
            </el-tooltip>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="表单配置" name="form"></el-tab-pane>
      <el-tab-pane label="列表配置" name="grid"></el-tab-pane>
      <el-tab-pane label="查询配置" name="query"></el-tab-pane>
    </el-tabs>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="FormDialog">
import { TabsPaneContext } from "element-plus";
import { DATA, Props } from "@/views/generator/table/constants";

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
});

const activeName = ref<string>('field');

watch(() => activeName.value, (newVal) => {
  console.log(newVal);
});

/**
 * tabs 切换事件
 */
const handleTabsClick = (tab: TabsPaneContext) => {
  console.log(tab)
};

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
