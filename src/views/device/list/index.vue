<template>
  <CnPage v-bind="props">
    <template #proDevCode="{ row }">
      <span class="blurtext" @click="viewDetail(row)"> {{ row.proDevCode }}</span>
    </template>
  </CnPage>
  <CnDialog ref="dialogRef" v-bind="dialogProps">
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="基本信息" name="1">
        <BasicInfo ref="basicInfoRef" :model="basicInfoData"></BasicInfo>
      </el-tab-pane>
      <el-tab-pane label="硬件信息" name="2">
        <HardwareModule ref="hardwareModuleRef" :model="hardwareModuleData"></HardwareModule>
      </el-tab-pane>
      <el-tab-pane label="部署场所" name="3">
        <DeploymentSite ref="deploymentSiteRef" :model="deploymentSiteData"></DeploymentSite>
      </el-tab-pane>
      <el-tab-pane label="配置信息" name="4">
        <ConfigInfo ref="configInfoRef" :model="configInfoData"></ConfigInfo>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </template>
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
      <div v-if="propsTable.data.length > 0">
        <CnTable v-bind="propsTable" v-loading="loading" />
      </div>
      <div v-else>
        <el-empty description="请筛选需要批量修改信息的设备" />
      </div>
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
      <CnForm ref="stpeThreeBulkEditFromRef" v-bind="stpeThreeBulkEditFrom">
        <template #deviceInfo>
          <h3>设备信息</h3>
        </template>
        <template #venueInfo>
          <h3>设备场所信息</h3>
        </template>
        <template #networkInfo>
          <h3>网络信息</h3>
        </template>
        <template #businessHoursSlot>
          <h3>设备营业时间</h3>
        </template>
        <template #timeSlot>
          <el-form :model="bulkForm" label-width="120px">
            <div v-for="(item, index) in timeSlotList" class="time-slotlit">
              <el-row :gutter="20">
                <el-col :span="21">
                  <el-form-item :label="'时间段' + (index + 1)">
                    <!-- <el-select
                      clearable
                      filterable
                      placeholder="请选择"
                      v-model="item.time1"
                      style="width: 30%"
                    >
                      <el-option
                        v-for="option in timeList"
                        :key="option.value"
                        :label="option.lable"
                        :value="option.value"
                      />
                    </el-select> -->
                    <!-- <span style="margin: 0px 10px 0px 10px">至</span>
                    <el-select
                      clearable
                      filterable
                      placeholder="请选择"
                      v-model="item.time2"
                      style="width: 30%"
                    >
                      <el-option
                        v-for="option in timeList2"
                        :key="option.value"
                        :label="option.lable"
                        :value="option.value"
                      />
                    </el-select> -->
                    <el-checkbox
                      v-model="item.checked"
                      :label="timeList[index].lable"
                      size="large"
                    />
                    <span> &nbsp;&nbsp;&nbsp; </span>
                    <el-time-select
                      v-model="item.startTime"
                      :max-time="item.endTime"
                      class="mr-4"
                      placeholder="开始时间"
                      start="00:00"
                      step="00:15"
                      end="23:45"
                      style="width: 40%"
                    />
                    <el-time-select
                      v-model="item.endTime"
                      :min-time="item.startTime"
                      placeholder="结束时间"
                      start="00:00"
                      step="00:15"
                      end="23:45"
                      style="width: 40%"
                    />
                    <!-- <div class="demo-time-range"></div> -->
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <div class="time-det">
                    <el-button
                      type="danger"
                      :icon="Delete"
                      circle
                      @click="deleteTime(index)"
                    />
                  </div>
                </el-col>
              </el-row>
            </div>
            <el-form-item>
              <el-button type="primary" :icon="Plus" @click="addTime">时间段</el-button>
            </el-form-item>
          </el-form>
        </template>
        <template #configInfo>
          <h3>配置信息</h3>
        </template>
      </CnForm>
    </div>
    <div v-if="step1 === 4">
      <div style="text-align: center">
        此次修改将影响{{ propsTable.data.length }}台设备，是否确认修改？
      </div>
    </div>
    <template #footer>
      <el-button type="primary" @click="BackStep" v-if="step1 !== 1">上一步</el-button>
      <el-button
        type="primary"
        @click="nextStep"
        :disabled="propsTable.data.length === 0"
        v-if="step1 !== 4 && step1 !== 3"
        >下一步</el-button
      >
      <el-button type="primary" @click="submitTo" v-if="step1 === 3">提交</el-button>
      <el-button type="primary" @click="determine" v-if="step1 === 4">确定</el-button>
    </template>
  </CnDialog>
  <CnDialog ref="exportRef" v-bind="exportProps">
    <template #footer>
      <el-button type="primary" @click="importFun">确定</el-button>
    </template>
  </CnDialog>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import CnPage from "@/components/cn-page/CnPage.vue";
import CnDialog from "@/components/cn-page/CnDialog.vue";
import CnTable from "@/components/cn-page/CnTable.vue";
import CnForm from "@/components/cn-page/CnForm.vue";
import BasicInfo from "./child/basicInfo.vue";
import HardwareModule from "./child/hardwareModule.vue";
import DeploymentSite from "./child/deploymentSite.vue";
import ConfigInfo from "./child/configInfo.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus, Delete } from "@element-plus/icons-vue";
// import { getTollBarActionDialogConfig, getTableActionConfig } from './config/dialog-config';
import {
  devBaseInfoListPage,
  devBaseInfoList,
  devBaseInfoStart,
  devBaseInfoStop,
  devBaseInfoLogoff,
  getUnitList,
  devGroupList,
  mattersProgrammeListPage,
  devBaseInfoEditList,
  getDevBaseInfo,
  devBaseInfoExport,
  devBaseInfo,
} from "@/api/device";
const activeName = ref("1");
const loading = ref(false);
const step1 = ref(1);
const bulkForm: any = reactive({});
const selectionIds = ref([]);
const bulkEditFromRef = ref();
const exportRef = ref();
const supList: any = [];
const gupList: any = [];
const matList: any = [];
const dialogRef = ref<InstanceType<typeof CnDialog>>();
const bulkEditRef = ref<InstanceType<typeof CnDialog>>();
const basicInfoData = ref();
const hardwareModuleData = ref();
const deploymentSiteData = ref();
const configInfoData = ref();
const basicInfoRef = ref();
const hardwareModuleRef = ref();
const deploymentSiteRef = ref();
const configInfoRef = ref();
const dialoTitle = ref("设备详情");
const timeSlotList = reactive([{ checked: "", startTime: "", endTime: "" }]);
const timeList = reactive([
  { lable: "周一", value: 0 },
  { lable: "周二", value: 1 },
  { lable: "周三", value: 2 },
  { lable: "周四", value: 3 },
  { lable: "周五", value: 4 },
  { lable: "周六", value: 5 },
  { lable: "周日", value: 6 },
]);
// 获取单位列表
const getUnitListFun = async () => {
  const params = {
    obj: {},
    page: 1,
    size: 10,
  };
  await getUnitList(params).then((res) => {
    if (res.code === "200") {
      res.rows.map((item) => {
        item.label = item.fullName;
        item.value = item.id;
        supList.push(item);
      });
    }
  });
};
const devGroupListFun = () => {
  const params = {
    obj: {},
    page: 1,
    size: 10,
  };
  devGroupList(params).then((res: any) => {
    if (res.code === "200") {
      res.data.map((item: any) => {
        item.label = item.groupName;
        item.value = item.id;
        gupList.push(item);
      });
    }
  });
};
const mattersProgrammeListPageFun = () => {
  const params = {
    obj: {},
    page: 1,
    size: 10,
  };
  mattersProgrammeListPage(params).then((res) => {
    if (res.code === "200") {
      res.rows.map((item) => {
        item.label = item.programmeName;
        item.value = item.id;
        matList.push(item);
      });
    }
  });
};
onMounted(async () => {
  getUnitListFun();
  devGroupListFun();
  mattersProgrammeListPageFun();
});

const dialogProps = reactive<CnPage.DialogProps>({
  title: dialoTitle.value, // "设备详情",
});

const bulkEditProps = reactive<CnPage.DialogProps>({
  title: step1.value === 4 ? "确认修改" : "批量编辑",
});

const exportProps = reactive<CnPage.DialogProps>({
  title: "导出",
  formProps: {
    model: {
      export: [
        "proDevCode",
        "unitDevCode",
        "devUnitText",
        "devManageUnitText",
        "supportingUnitText",
        "devModelNo",
        "siteName",
        "provinceCodeText,cityCodeText,countyCodeText,townCodeText,villageCodeText",
        "detailAddress",
        "statusText",
        "managePersonName",
        "managePersonContact",
        "procedureVersion"
      ],
    },
    items: [
      { label: "请选择所需导出的字段", component: "subtitle", span: 24 },
      { prop: "export", component: "checkbox", span: 24, dict: "DEV_EXPORT_COLUMN" },
    ],
  },
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
          { label: "行政区划", value: 0, disabled: propsTable.data.length <= 10 }, // propsTable.data.length >= 1
          { label: "详细地址", value: 1, disabled: propsTable.data.length >= 1 },
          { label: "地理坐标", value: 2, disabled: propsTable.data.length >= 1 },
          { label: "部署场所名称", value: 3, disabled: propsTable.data.length >= 1 },
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
      label: "网络策略",
      prop: "networdPolicy",
      component: "checkbox",
      dict: "NETWORD_POLICY",
      span: 24,
      // props: {
      //   options: [
      //     { label: "网络策略", value: 0 },
      //   ],
      // },
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
  rules: {
    supportingUnit: [{ required: true, message: "请选择设备管理单位" }],
    devModelNo: [{ required: true, message: "请输入设备型号" }],
    hardware: [{ required: true, message: "请选择硬件模块" }],
    operationPersonName: [{ required: true, message: "请输入运维人员名称" }],
    operationPersonContact: [{ required: true, message: "请输入运维人员联系方式" }],
    groupId: [{ required: true, message: "请选择设备分组" }],
    provinceCode: [{ required: true, message: "请选择行政区划" }],
    detailAddress: [{ required: true, message: "请输入详细地址" }],
    pointLatLng: [{ required: true, message: "请输入地理坐标" }],
    siteName: [{ required: true, message: "请选择部署场所名称" }],
    devUsage: [{ required: true, message: "请选择设备用途" }],
  },
  items: [
    { prop: "deviceInfo", component: "slot", span: 24 },
    {
      label: "设备管理单位",
      prop: "supportingUnit",
      component: "select",
      span: 24,
      props: { options: supList },
    },
    { label: "设备型号", prop: "devModelNo", component: "input", span: 24 },
    {
      label: "硬件模块",
      prop: "hardware",
      component: "select",
      span: 24,
      props: { multiple: true },
      dict: "HARDWARE_MODULE",
    },
    { label: "运维人员", prop: "operationPersonName", component: "input", span: 24 },
    {
      label: "运维人员联系方式",
      prop: "operationPersonContact",
      component: "input",
      span: 24,
    },
    {
      label: "设备分组",
      prop: "groupId",
      component: "select",
      span: 24,
      props: { options: gupList },
    },
    { prop: "venueInfo", component: "slot", span: 24 },
    { label: "行政区划", prop: "provinceCode", component: "ad", span: 24 },
    { label: "详细地址", prop: "detailAddress", component: "input", span: 24 },
    { label: "地理坐标", prop: "pointLatLng", component: "input", span: 24 },
    { label: "部署场所名称", prop: "siteName", component: "input", span: 24 },
    {
      label: "部署场所类型",
      prop: "siteType",
      component: "select",
      span: 24,
      dict: "DEV_SITE_TYPE",
    },
    {
      label: "设备用途",
      prop: "devUsage",
      component: "select",
      span: 24,
      dict: "DEV_USAGE",
    },
    { prop: "networkInfo", component: "slot", span: 24 },
    {
      label: "网络策略",
      prop: "networdPolicy",
      component: "checkbox",
      dict: "NETWORD_POLICY",
      span: 24,
    },
    { prop: "businessHoursSlot", component: "slot", span: 24 },
    {
      label: "设备营业时间",
      prop: "businessHours",
      component: "select",
      span: 24,
      props: {
        options: [
          { lable: "7 * 24 小时", value: "7 * 24 小时" },
          { lable: "自定义", value: "自定义" },
        ],
      },
    },
    {
      prop: "timeSlot",
      component: "slot",
      span: 24,
      visible: () => stpeThreeBulkEditFrom.model?.businessHours === "自定义",
    },
    {
      label: "定时开关机",
      prop: "timerOnOff",
      component: "select",
      span: 24,
      dict: "YES_NO",
    },
    { prop: "configInfo", component: "slot", span: 24 },
    {
      label: "设备分组",
      prop: "groupId",
      component: "select",
      span: 24,
      props: { options: gupList },
    },
    {
      label: "方案",
      prop: "programmeId",
      component: "select",
      span: 24,
      props: { options: matList },
    },
  ],
});

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
              devBaseInfoStart(params.join(",")).then((res: any) => {
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
              devBaseInfoStop(params.join(",")).then((res: any) => {
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
              message: "请选择要注销的设备",
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
              devBaseInfoLogoff(params.join(",")).then((res: any) => {
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
          exportRef.value?.open();
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

// 查看详情
function viewDetail(row: any) {
  getDevBaseInfo(row.id).then((res: any) => {
    if (res.code === "200") {
      res.data.baseInfo.type = "edit";
      res.data.devDeploymentSite.type = "edit";
      res.data.devConf.type = "edit";
      basicInfoData.value = res.data.baseInfo;
      hardwareModuleData.value = res.data.baseInfo;
      deploymentSiteData.value = res.data.devDeploymentSite;
      configInfoData.value = res.data.devConf;
      dialoTitle.value = "设备详情"
      dialogRef.value?.open();
    }
  });
}

// 导出
function importFun() {
  const params = {
    columns: exportProps.formProps!.model.export,
    ...props.params,
  };
  devBaseInfoExport(params).then((res: any) => {
    let blob = new Blob([res.data], {
      type: res.headers['content-type'] || 'application/vnd.ms-excel'
    })
    let href = window.URL.createObjectURL(blob)
    let downloadElement = document.createElement('a')
    downloadElement.href = href
    downloadElement.download = '设备列表.xlsx'
    document.body.appendChild(downloadElement)
    downloadElement.click() //点击下载
    document.body.removeChild(downloadElement) //下载完成移除元素
    exportRef.value?.close()
  });
}

// 编辑
function handleEdit({ row }: any) {
  basicInfoData.value = {};
  hardwareModuleData.value = {};
  deploymentSiteData.value = {};
  configInfoData.value = {};
  dialoTitle.value = "编辑设备信息"
  dialogRef.value?.open();
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
// 取消
const handleCancel = () => {
  dialogRef.value?.close()
}
// 提交编辑 
const handleSubmit = () => {
  const flagArr = [basicInfoRef.value.validateForm(), hardwareModuleRef.value.validateForm(), deploymentSiteRef.value.validateForm(), configInfoRef.value.validateForm()]
  // console.log("3", flagArr);
  // console.log("4", basicInfoRef.value.validateForm());
  // const aaaa = hardwareModuleRef.value.validateForm().then((res: any) => { return res})
  // console.log("4", aaaa);
  let isValidate = false
  const params = {
    baseInfo: basicInfoRef.value.getFormData(),
    devConf: configInfoRef.value.getFormData(),
    devDeploymentSite: deploymentSiteRef.value.getFormData(),
    devUnitInFo: hardwareModuleRef.value.getFormData(),
  }
  Promise.all(flagArr).then((res: any) => {
    for (let index = 0; index < res.length; index++) {
      const element = res[index];
      if (element) {
        isValidate = true
      } else {
        activeName.value = String(index + 1)
        break;
      }
    }
    console.log(isValidate);
    
    if (isValidate) {
      devBaseInfo(params).then(res => {
        console.log(res);
      })
    }
  })
  
  // console.log("basicInfoRef", basicInfoRef.value.validateForm())
  // console.log("bbb", basicInfoRef.value.getFormData())
  // console.log("hardwareModuleRef", hardwareModuleRef.value.getFormData())
  // console.log("deploymentSiteRef", deploymentSiteRef.value.getFormData())
  // console.log("configInfoRef", configInfoRef)
}
// 确定
const determine = () => {
  const params = {
    ...stpeThreeBulkEditFrom.model,
  };
  console.log(params);

  devBaseInfoEditList(params).then((res) => {
    if (res.code === "200") {
      bulkEditRef.value?.close();
    }
  });
};
// 添加时间段
const addTime = () => {
  console.log("添加时间段");
  // const timeSlotList = reactive([{ checked: "", startTime: "", endTime: "" }]);
  if (timeSlotList.length < 7) {
    timeSlotList.push({ checked: "", startTime: "", endTime: "" });
  } else {
    return;
  }
};
// 删除时间段
const deleteTime = (index: number) => {
  timeSlotList.splice(index, 1);
};
</script>
<style>
.blurtext {
  color: #409eff;
  text-decoration: underline;
  cursor: pointer;
}
.time-slotlit {
  margin-bottom: 20px;
}
.time-det {
  position: relative;
  top: 20px;
}
</style>
