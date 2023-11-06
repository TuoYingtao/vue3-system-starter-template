<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="QueryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="基类编码" prop="code">
        <el-input
            v-model="queryParams.code"
            placeholder="请输入基类编码"
            clearable
            style="width: 240px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" style="width: 308px;">
        <el-date-picker
            v-model="dateRange"
            value-format="YYYY-MM-DD"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!--  表格操作  -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['*:*:*']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['*:*:*']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['*:*:*']"
        >删除
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getDataList"/>
    </el-row>
    <!--  表格数据  -->
    <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="基类编码" align="center" prop="code"/>
      <el-table-column label="字段" align="center" prop="fields" :show-overflow-tooltip="true"/>
      <el-table-column label="包名" align="center" prop="packageName" :show-overflow-tooltip="true"/>
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['*:*:*']">修改
          </el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['*:*:*']">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  分页  -->
    <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getDataList"
    />
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="FormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="基类编码" prop="code">
          <el-tooltip class="box-item" effect="dark" content="基类编码" placement="top">
            <el-input v-model="form.code" placeholder="请输入基类编码" />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="字段" prop="fields">
          <el-tooltip class="box-item" effect="dark" content="基类的成员属性,属性与属性之间用英文逗号分隔（,）" placement="top">
            <el-input v-model="form.fields" placeholder="请输入字段" />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="包名" prop="packageName">
          <el-tooltip class="box-item" effect="dark" content="基类所在的包名路径" placement="top">
            <el-input v-model="form.packageName" placeholder="请输入包名" />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-tooltip class="box-item" effect="dark" content="备注" placement="top">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
          </el-tooltip>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="BaseClass">
import * as CurrentConstants from "@/views/generator/baseClass/constants";
import { parseTime } from "@/utils";
import { BaseClassEntity } from "@/api/generator/models/BaseClassEntity";
import { getCurrentInstance } from "vue";
import { BaseClassApiService } from "@/api/generator/BaseClassApiService";
import { ServiceDecorator } from "@/api/abstract/ServiceDecorator";

// @ts-ignore
const { proxy } = getCurrentInstance();
// data 数据
const currentData = reactive(CurrentConstants.DATA);
const { queryParams, form, rules } = toRefs(currentData);
// 日期参数
const dateRange = ref([]);
// 搜索框显示
const showSearch = ref(true);
// 表格加载动画
const loading = ref(true);
// 表格数据
const dataList = ref<BaseClassEntity[]>([]);
// 总条数
const total = ref(0);
// 全局修改按钮状态
const single = ref(true);
// 全局批量按钮选中
const multiple = ref(true);
// 批量选中ID
const ids = ref<number[]>([]);
// 打开弹窗状态
const open = ref(false);
// 弹窗标题
const title = ref("");

const serviceApi = new ServiceDecorator(new BaseClassApiService());

onMounted(() => {
  getDataList();
})

/** 查询参数列表 */
async function getDataList() {
  loading.value = true;
  try {
    const { data } = await serviceApi.page(proxy.addDateRange(queryParams.value, dateRange.value));
    dataList.value = data.list;
    total.value = data.totalCount;
  } catch (e: any) {
    proxy.$modal.msgError(e.message);
  } finally {
    loading.value = false;
  }
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加基类";
}

/** 修改按钮操作 */
async function handleUpdate(row: BaseClassEntity) {
  reset();
  const params = row.id || ids.value;
  try {
    const { data } = await serviceApi.detail(params);
    form.value = data;
    open.value = true;
    title.value = "修改基类";
  } catch (e: any) {
    proxy.$modal.msgError(e.message);
  }
}

/** 删除按钮操作 */
function handleDelete(row: BaseClassEntity) {
  const params = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除编号为"' + params + '"的数据项？').then(function () {
    return serviceApi.delete(params);
  }).then(() => {
    getDataList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 提交按钮 */
function submitForm() {
  let callBack = (message: string) => {
    proxy.$modal.msgSuccess(message);
    open.value = false;
    getDataList();
  };
  proxy.$refs["FormRef"].validate(async (valid: boolean) => {
    try {
      if (valid) {
        if (form.value.id != undefined) {
          const { data } = await serviceApi.update(form.value);
          callBack("修改成功");
        } else {
          await serviceApi.save(form.value);
          callBack("新增成功");
        }
      }
    } catch (e: any) {
      proxy.$modal.msgError(e.message);
    } finally {
      callBack = () => {};
    }
  });
}

/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getDataList();
}

/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = [];
  proxy.resetForm("QueryRef");
  handleQuery();
}

/** 多选框选中数据 */
function handleSelectionChange(selection: BaseClassEntity[]) {
  ids.value = selection.map((item: BaseClassEntity) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 表单重置 */
function reset() {
  form.value = CurrentConstants.DEFAULT_FORM;
  proxy.resetForm("FormRef");
}
</script>

<style scoped lang="scss">

</style>
