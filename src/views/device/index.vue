<template>
  <CnPage v-bind="props" />
  <CnDialog ref="dialogRef" v-bind="dialogProps">
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="基本信息" name="1">
        <BasicInfo></BasicInfo>
      </el-tab-pane>
      <el-tab-pane label="部署场所" name="2">
        <DeploymentSite></DeploymentSite>
      </el-tab-pane>
      <el-tab-pane label="配置信息" name="3">
        <ConfigInfo></ConfigInfo>
      </el-tab-pane>
    </el-tabs>
  </CnDialog>
  <CnDialog ref="bulkEditRef" v-bind="bulkEditProps">
    <div v-if="step1 === 1">
      <CnForm ref="bulkEditFromRef" v-bind="bulkEditFrom"></CnForm>
      <CnTable v-bind="propsTable" v-loading="loading" />
    </div>
    <div v-if="step1 === 2">
      <CnForm ref="stpeTowBulkEditFromRef" v-bind="stpeTowBulkEditFrom">
        <template #addd>
          <h3>设备信息</h3>
        </template>
      </CnForm>
    </div>
    <div v-if="step1 === 3">
      3333
    </div>
    <div v-if="step1 === 4">
      44444
    </div>
    <template #footer>
      <el-button type="primary" @click="BackStep" v-if="step1 !== 1">上一步</el-button>
      <el-button type="primary" @click="nextStep" v-if="step1 !== 4 && step1 !== 3">下一步</el-button>
      <el-button type="primary" @click="submitTo" v-if="step1 === 3">提交</el-button>
      <el-button type="primary" @click="determine" v-if="step1 === 4">确定</el-button>
    </template>
  </CnDialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import CnPage from "@/components/cn-page/CnPage.vue";
import CnDialog from "@/components/cn-page/CnDialog.vue";
import CnTable from '@/components/cn-page/CnTable.vue'
import CnForm from '@/components/cn-page/CnForm.vue'
import BasicInfo from "./child/basicInfo.vue";
import DeploymentSite from "./child/deploymentSite.vue";
import ConfigInfo from "./child/configInfo.vue";
// import { getTollBarActionDialogConfig, getTableActionConfig } from './config/dialog-config';
// import { getDivisionList } from "@/api/admin";
const activeName = ref("1");
const loading = ref(false)
const step1 = ref(1)

const dialogRef = ref<InstanceType<typeof CnDialog>>();
const bulkEditRef = ref<InstanceType<typeof CnDialog>>();

const dialogProps = reactive<CnPage.DialogProps>({
  title: "设备详情",
});

const bulkEditProps = reactive<CnPage.DialogProps>({
  title: "批量编辑",
});

const bulkEditFrom = reactive({
  labelWidth: 120,
  colSpan: 8,
  items: [
    { label: "请批量筛选设备", component: "divider", span: 24 },
    { label: "设备编号", prop: "areaName", component: "select" },
    { label: "设备管理单位", prop: "areaName", component: "select" },
    { label: "设备技术支撑单位", prop: "areaName", component: "select" },
    { label: "设备型号", prop: "areaName", component: "input" },
    { label: "设备类型", prop: "areaName", component: "select" },
    { label: "行政区划", prop: "areaName", component: "ad" },
    { label: "部署场所", prop: "areaName", component: "input" },
    { label: "部署场所类型", prop: "areaName", component: "select" },
    { label: "硬件模块", prop: "areaName", component: "select" },
    { label: "网络策略", prop: "areaName", component: "select" },
    { label: "自助终端管理员", prop: "areaName", component: "input" },
    { label: "政务程序版本号", prop: "areaName", component: "select" },
    { label: "设备分组", prop: "areaName", component: "select" },
    // { label: "333", prop: 'sex', slot: "propsTable", span: 24 },
  ]
})
const stpeTowBulkEditFrom = reactive({
  labelWidth: 120,
  colSpan: 8,
  items: [
    { label: "请勾选需要批量修改的字段", component: "divider", span: 24 },
    { label: "请勾", slot: "addd", component: 'slot', span: 24 },
    { label: "设备编号", prop: "areaName", component: "select" },
    { label: "设备管理单位", prop: "areaName", component: "select" },
    { label: "设备技术支撑单位", prop: "areaName", component: "select" },
    { label: "设备型号", prop: "areaName", component: "input" },
    { label: "设备类型", prop: "areaName", component: "select" },
    { label: "行政区划", prop: "areaName", component: "ad" },
    { label: "部署场所", prop: "areaName", component: "input" },
    { label: "部署场所类型", prop: "areaName", component: "select" },
    { label: "硬件模块", prop: "areaName", component: "select" },
    { label: "网络策略", prop: "areaName", component: "select" },
    { label: "自助终端管理员", prop: "areaName", component: "input" },
    { label: "政务程序版本号", prop: "areaName", component: "select" },
    { label: "设备分组", prop: "areaName", component: "select" },
    // { label: "333", prop: 'sex', slot: "propsTable", span: 24 },
  ]
})

const props = reactive<CnPage.Props>({
  params: {},
  action: () => Promise.reject(),
  search: {
    items: [
      { label: "设备基本信息", component: "divider", span: 24 },
      { label: "设备编号", prop: "areaName", component: "input" },
      { label: "设备接入单位设备编号", prop: "areaCode", component: "input" },
      { label: "设备类型", prop: "status", component: "select" },
      { label: "设备型号", prop: "status", component: "input" },
      { label: "硬件模块", prop: "status", component: "select" },
      { label: "操作系统", prop: "status", component: "select" },
      { label: "设备接入方式", prop: "status", component: "select" },
      { label: "政务程序版本号", prop: "status", component: "select" },
      { label: "安装激活时间", prop: "status", component: "select" },
      { label: "设备分组", prop: "status", component: "select" },
      { label: "状态", prop: "status", component: "select" },
      { label: "部署场所", component: "divider", span: 24 },
      { label: "行政区划", prop: "status", component: "select" },
      { label: "部署场所", prop: "status", component: "input" },
      { label: "部署场所类型", prop: "status", component: "select" },
      { label: "自助终端管理员", prop: "status", component: "select" },
      { label: "网络策略", prop: "status", component: "select" },
      { label: "相关方", component: "divider", span: 24 },
      { label: "设备接入单位", prop: "status", component: "select" },
      { label: "设备管理单位", prop: "status", component: "select" },
      { label: "设备技术支撑单位", prop: "status", component: "select" },
    ],
  },
  toolbar: {
    items: [
      {
        label: "批量编辑",
        type: "primary",
        onClick: () => {
          bulkEditRef.value?.open();
          // dialogProps.action = () => handleSubmit('view')
        },
      },
      {
        label: "启用",
        type: "primary",
        onClick: () => {
          dialogRef.value?.open();
          // dialogProps.action = () => handleSubmit("add");
        },
      },
      {
        label: "停用",
        type: "primary",
        onClick: () => {
          dialogRef.value?.open();
          // dialogProps.action = () => handleSubmit("add");
        },
      },
      {
        label: "注销",
        type: "primary",
        onClick: () => {
          dialogRef.value?.open();
          // dialogProps.action = () => handleSubmit("add");
        },
      },
      {
        label: "导出",
        type: "primary",
        onClick: () => {
          dialogRef.value?.open();
          // dialogProps.action = () => handleSubmit("add");
        },
      },
    ],
  },
  table: {
    rowKey: "id",
    columns: [
      { type: "selection" },
      { label: "设备编号", prop: "areaName"},
      { label: "设备接入单位设备编号", prop: "areaCode" },
      { label: "设备型号", prop: "status", dict: "STATUS" },
      { label: "行政区划", prop: "remark" },
      { label: "详细地址", prop: "remark" },
      { label: "自助终端管理员联系方式", prop: "remark" },
      { label: "安装激活时间", prop: "remark" },
      { label: "政务程序版本号", prop: "remark" },
      { label: "状态", prop: "remark" },
      {
        prop: "action",
        label: "操作",
        minWidth: 120,
        buttons: [{ label: "编辑", type: "primary", text: true, onClick: handleEdit }],
      },
    ],
  },
  pagination: false,
});

const propsTable = reactive<CnPage.TableProps>({
  columns: [
    { label: '省统一设备编号', prop: 'realname', sortable: true },
    { label: '设备接入单位设备编号', prop: 'sex', dict: 'SEX', sortable: true },
    { label: '设备型号', prop: 'birthday' },
    { label: '部署场所', prop: 'birthday' },
    { label: '行政区域', prop: 'birthday' },
    { label: '自助终端管理员', prop: 'birthday' },
    { label: '自助终端管理员联系方式', prop: 'birthday' },
    { label: '安装激活时间', prop: 'birthday', sortable: true },
    { label: '政务程序版本号', prop: 'birthday' },
  ],
  data: []
})

// 编辑
function handleEdit({ row }: any) {
  console.log("编辑");
}
// 批量编辑
function handleSubmit({ row }: any) {
  console.log(row);
}
// 下一步
const nextStep = () => {
  step1.value = step1.value + 1
}
// 上一步
const BackStep = () => {
  step1.value = step1.value - 1
}
// 提交
const submitTo = () => {
  step1.value = 4
}
// 确定
const determine = () => {
  console.log(3333)
}
</script>
