<template>
  <CnPage v-bind="props">
    <template #proDevCode="slotProps">
      <span class="blurtext" @click="viewDetail"> {{ slotProps.row.proDevCode }}</span>
    </template>
  </CnPage>
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
      <CnForm ref="bulkEditFromRef" v-bind="bulkEditFrom">
        <template #propsBtn>
          <div>
            <el-button type="primary" @click="handleScreen">筛选</el-button>
            <el-button @click="handleReset">重置</el-button>
          </div>
        </template>
      </CnForm>
      <CnTable v-bind="propsTable" v-loading="loading" />
    </div>
    <div v-if="step1 === 2">
      <CnForm ref="stpeTowBulkEditFromRef" v-bind="stpeTowBulkEditFrom">
        <template #deviceInfo>
          <h3>设备信息</h3>
        </template>
        <template #venueInfo>
          <h3>设备场所信息</h3>
        </template>
        <template #networkInfo>
          <h3>网络信息</h3>
        </template>
        <template #configInfo>
          <h3>配置信息</h3>
        </template>
      </CnForm>
    </div>
    <div v-if="step1 === 3">
      <CnForm ref="stpeThreeBulkEditFromRef"  v-bind="stpeThreeBulkEditFrom">
        <template #deviceInfo>
          <h3>设备信息</h3>
        </template>
        <template #venueInfo>
          <h3>设备场所信息</h3>
        </template>
        <template #networkInfo>
          <h3>网络信息</h3>
        </template>
        <template #configInfo>
          <h3>配置信息</h3>
        </template>
      </CnForm>
    </div>
    <div v-if="step1 === 4">44444</div>
    <template #footer>
      <el-button type="primary" @click="BackStep" v-if="step1 !== 1">上一步</el-button>
      <el-button type="primary" @click="nextStep" v-if="step1 !== 4 && step1 !== 3"
        >下一步</el-button
      >
      <el-button type="primary" @click="submitTo" v-if="step1 === 3">提交</el-button>
      <el-button type="primary" @click="determine" v-if="step1 === 4">确定</el-button>
    </template>
  </CnDialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import CnPage from "@/components/cn-page/CnPage.vue";
import CnDialog from "@/components/cn-page/CnDialog.vue";
import CnTable from "@/components/cn-page/CnTable.vue";
import CnForm from "@/components/cn-page/CnForm.vue";
import BasicInfo from "./child/basicInfo.vue";
import DeploymentSite from "./child/deploymentSite.vue";
import ConfigInfo from "./child/configInfo.vue";
import { ElMessage, ElMessageBox } from "element-plus";
// import { getTollBarActionDialogConfig, getTableActionConfig } from './config/dialog-config';
import {
  devBaseInfoListPage,
  devBaseInfoList,
  devBaseInfoStart,
  devBaseInfoStop,
  devBaseInfoLogoff,
} from "@/api/device";
const activeName = ref("1");
const loading = ref(false);
const step1 = ref(1);
const selectionIds = ref([]);
const bulkEditFromRef = ref();

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
  model: {},
  items: [
    { label: "请批量筛选设备", component: "divider", span: 24 },
    { label: "设备接入单位", prop: "devUnit", component: "select" },
    { label: "设备管理单位", prop: "devManageUnit", component: "select" },
    { label: "设备技术支撑单位", prop: "supportingUnit", component: "select" },
    { label: "设备型号", prop: "devModelNo", component: "input" },
    { label: "设备类型", prop: "devType", component: "select", dict: "DEV_TYPE" },
    { label: "行政区划", prop: "regionDetail", component: "ad" },
    { label: "部署场所", prop: "siteName", component: "input" },
    {
      label: "部署场所类型",
      prop: "siteType",
      component: "select",
      dict: "DEV_SITE_TYPE",
    },
    { label: "硬件模块", prop: "hardware", component: "select", dict: "HARDWARE_MODULE" },
    {
      label: "网络策略",
      prop: "networkPolicy",
      component: "select",
      dict: "NETWORD_POLICY",
    },
    { label: "自助终端管理员", prop: "managePersonName", component: "input" },
    { label: "政务程序版本号", prop: "procedureVersion", component: "select" },
    { label: "设备分组", prop: "groupId", component: "select" },
    { prop: "propsBtn", component: "slot", span: 16 },
  ],
});
const stpeTowBulkEditFrom = reactive({
  labelWidth: 120,
  colSpan: 8,
  model: {},
  items: [
    { label: "请勾选需要批量修改的字段", component: "divider", span: 24 },
    { prop: "deviceInfo", component: "slot", span: 24 },
    {
      prop: "deviceInfo",
      component: "checkbox",
      span: 24,
      props: {
        options: [
          { label: "设备管理单位", value: 0 },
          { label: "设备技术支撑单位", value: 1 },
          { label: "设备型号", value: 2 },
          { label: "硬件模块", value: 3 },
        ],
      },
    },
    { prop: "venueInfo", component: "slot", span: 24 },
    {
      prop: "venueInfo",
      component: "checkbox",
      span: 24,
      props: {
        options: [
          { label: "行政区划", value: 0 },
          { label: "详细地址", value: 1 },
          { label: "地理坐标", value: 2 },
          { label: "部署场所名称", value: 3 },
          { label: "部署场所类型", value: 4 },
          { label: "设备用途", value: 5 },
          { label: "自助终端管理员", value: 6 },
          { label: "设备营业时间", value: 7 },
          { label: "定时开关机", value: 8 },
        ],
      },
    },
    { prop: "networkInfo", component: "slot", span: 24 },
    {
      prop: "networkInfo",
      component: "checkbox",
      span: 24,
      props: {
        options: [
          { label: "网络策略", value: 0 },
        ],
      },
    },
    { prop: "configInfo", component: "slot", span: 24 },
    {
      prop: "configInfo",
      component: "checkbox",
      span: 24,
      props: {
        options: [
          { label: "设备分组", value: 0 },
          { label: "方案", value: 1 },
        ],
      },
    },
  ],
});

const stpeThreeBulkEditFrom = reactive({
  labelWidth: 120,
  colSpan: 8,
  model: {},
  items: [
    { prop: "deviceInfo", component: "slot", span: 24 },
    { label: "设备管理单位", prop: "managePersonName", component: "select", span: 24 },
    { label: "设备技术支撑单位", prop: "managePersonName", component: "select", span: 24 },
    { label: "设备型号", prop: "managePersonName", component: "input", span: 24 },
    { label: "硬件模块", prop: "managePersonName", component: "select", span: 24 },
    { label: "运维人员", prop: "managePersonName", component: "input", span: 24 },
    { label: "运维人员联系方式", prop: "managePersonName", component: "input", span: 24 },
    { label: "设备分组", prop: "managePersonName", component: "select", span: 24 },
    { prop: "venueInfo", component: "slot", span: 24 },
    { label: "行政区划", prop: "managePersonName", component: "ad", span: 24 },
    { label: "详细地址", prop: "managePersonName", component: "input", span: 24 },
    { label: "地理坐标", prop: "managePersonName", component: "input", span: 24 },
    { label: "部署场所名称", prop: "managePersonName", component: "input", span: 24 },
    { label: "部署场所类型", prop: "managePersonName", component: "select", span: 24 },
    { label: "设备用途", prop: "managePersonName", component: "select", span: 24 },
    { prop: "networkInfo", component: "slot", span: 24 },
    {
      label: "网络策略",
      prop: "venueInfo",
      component: "checkbox",
      span: 24,
      props: {
        options: [
          { label: "政务外网", value: 0 },
          { label: "政务内网", value: 1 },
          { label: "公安网", value: 2 },
          { label: "金融城域网", value: 3 },
          { label: "银行内网", value: 4 },
          { label: "互联网", value: 5 },
          { label: "无线专网", value: 6 },
        ],
      },
    },
    { prop: "configInfo", component: "slot", span: 24 },
    { label: "设备分组", prop: "managePersonName", component: "select", span: 24 },
    { label: "方案", prop: "managePersonName", component: "select", span: 24 },
  ],
})

const props = reactive<CnPage.Props>({
  params: {},
  action: devBaseInfoListPage, // () => Promise.reject(),
  search: {
    items: [
      { label: "设备基本信息", component: "subtitle", span: 24 },
      { label: "设备编号", prop: "proDevCode", component: "input" },
      { label: "设备接入单位设备编号", prop: "unitDevCode", component: "input" },
      { label: "设备类型", prop: "devType", component: "select", dict: "DEV_TYPE" },
      { label: "设备型号", prop: "status", component: "input" },
      {
        label: "硬件模块",
        prop: "hardware",
        component: "select",
        dict: "HARDWARE_MODULE",
      },
      { label: "操作系统", prop: "operSystem", component: "select" },
      {
        label: "设备接入方式",
        prop: "accesType",
        component: "select",
        dict: "DEV_ACCES_TYPE",
      },
      { label: "政务程序版本号", prop: "procedureVersion", component: "select" },
      { label: "安装激活时间", prop: "installActivateTime", component: "select" },
      { label: "设备分组", prop: "group", component: "select" },
      { label: "状态", prop: "status", component: "select", dict: "DEV_STATUS" },
      { label: "部署场所", component: "subtitle", span: 24 },
      { label: "行政区划", prop: "townCode", component: "ad" },
      { label: "部署场所", prop: "siteName", component: "input" },
      {
        label: "部署场所类型",
        prop: "siteType",
        component: "select",
        dict: "DEV_SITE_TYPE",
      },
      { label: "自助终端管理员", prop: "managePersonName", component: "select" },
      {
        label: "网络策略",
        prop: "networkPolicy",
        component: "select",
        dict: "NETWORD_POLICY",
      },
      { label: "相关方", component: "subtitle", span: 24 },
      { label: "设备接入单位", prop: "devUnit", component: "select" },
      { label: "设备管理单位", prop: "devManageUnit", component: "select" },
      { label: "设备技术支撑单位", prop: "supportingUnit", component: "select" },
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
          if (selectionIds.value.length < 1) {
            ElMessage({
              type: "error",
              message: "请选择要启用的设备",
            });
          } else {
            const ids: any = [];
            const params = selectionIds.value.map((item: { id: any }) => {
              return ids.push(item.id);
            });
            ElMessageBox.confirm("确定要启用改设备吗？", "提示", {
              type: "warning",
              closeOnClickModal: false,
              confirmButtonText: "确定",
            }).then(() => {
              devBaseInfoStart(params.join(",")).then((res) => {
                if (res.code === "200") {
                  ElMessage({
                    type: "info",
                    message: res.message,
                  });
                }
              });
            });
          }
        },
      },
      {
        label: "停用",
        type: "primary",
        onClick: () => {
          if (selectionIds.value.length < 1) {
            ElMessage({
              type: "error",
              message: "请选择要停用的设备",
            });
          } else {
            const ids: any = [];
            const params = selectionIds.value.map((item: { id: any }) => {
              return ids.push(item.id);
            });
            ElMessageBox.confirm("确定要停用改设备吗？", "提示", {
              confirmButtonText: "确定",
              type: "warning",
              closeOnClickModal: false,
            }).then(() => {
              devBaseInfoStop(params.join(",")).then((res) => {
                console.log(res);
                if (res.code === "200") {
                  ElMessage({
                    type: "info",
                    message: res.message,
                  });
                }
              });
            });
          }
        },
      },
      {
        label: "注销",
        type: "primary",
        onClick: () => {
          if (selectionIds.value.length < 1) {
            ElMessage({
              type: "error",
              message: "请选择要停用的设备",
            });
          } else {
            const ids: any = [];
            const params = selectionIds.value.map((item: { id: any }) => {
              return ids.push(item.id);
            });
            ElMessageBox.confirm("确定要注销改设备吗？", "提示", {
              type: "warning",
              closeOnClickModal: false,
            }).then(() => {
              devBaseInfoLogoff(params.join(",")).then((res) => {
                console.log(res);
                if (res.code === "200") {
                  ElMessage({
                    type: "success",
                    message: res.message,
                  });
                }
              });
            });
          }
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
      { label: "设备编号", slot: "proDevCode" },
      { label: "设备接入单位设备编号", prop: "unitDevCode" },
      { label: "设备型号", prop: "status", dict: "devModelNo" },
      { label: "行政区划", prop: "regionDetail" },
      { label: "详细地址", prop: "detailAddress" },
      { label: "自助终端管理员联系方式", prop: "terminalManagePhone" },
      { label: "安装激活时间", prop: "installActivateTime" },
      { label: "政务程序版本号", prop: "procedureVersion" },
      { label: "状态", prop: "status", dict: "DEV_STATUS" },
      {
        prop: "action",
        label: "操作",
        minWidth: 120,
        buttons: [{ label: "编辑", type: "primary", text: true, onClick: handleEdit }],
      },
    ],
    onSelect: (selection: any) => {
      selectionIds.value = selection;
    },
  },
  pagination: false,
});

const propsTable = reactive<CnPage.TableProps>({
  columns: [
    { label: "省统一设备编号", prop: "proDevCode", sortable: true },
    { label: "设备接入单位设备编号", prop: "unitDevCode", sortable: true },
    { label: "设备型号", prop: "devModelNo" },
    { label: "部署场所", prop: "siteName" },
    { label: "行政区域", prop: "regionDetail" },
    { label: "自助终端管理员", prop: "managePersonName" },
    { label: "自助终端管理员联系方式", prop: "managePersonContact" },
    { label: "安装激活时间", prop: "installActivateTime", sortable: true },
    { label: "政务程序版本号", prop: "procedureVersion" },
  ],
  data: [],
});

// 查看详情
function viewDetail() {
  dialogRef.value?.open();
}

// 编辑
function handleEdit({ row }: any) {
  console.log("编辑");
}
// 筛选
function handleScreen() {
  console.log("筛选", bulkEditFrom.model);
  const params = {
    ...bulkEditFrom.model,
  };
  devBaseInfoList(params).then((res: any) => {
    if (res.code === "200") {
      propsTable.data = res.data;
    }
  });
}
// 重置
function handleReset() {
  bulkEditFrom.model = {};
  propsTable.data = [];
}
// 批量编辑
function handleSubmit({ row }: any) {
  console.log(row);
}
// 下一步
const nextStep = () => {
  step1.value = step1.value + 1;
};
// 上一步
const BackStep = () => {
  step1.value = step1.value - 1;
};
// 提交
const submitTo = () => {
  step1.value = 4;
};
// 确定
const determine = () => {
  console.log(3333);
};
</script>
<style>
.blurtext {
  color: #409eff;
  text-decoration: underline;
  cursor: pointer;
}
</style>
