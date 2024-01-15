<template>
  <CnPage v-bind="props">
    <template #proDevCode="{ row }">
      <span class="blurtext" @click="viewDetail(row)"> {{ row.proDevCode }}</span>
    </template>
  </CnPage>
  <CnDialog ref="dialogRef" title="设备详情">
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="基本信息" name="1">
        <BasicInfo ref="basicInfoRef" :model="basicInfoData"></BasicInfo>
      </el-tab-pane>
      <el-tab-pane label="硬件信息" name="2">
        <HardwareModule
          ref="hardwareModuleRef"
          :model="hardwareModuleData"
        ></HardwareModule>
      </el-tab-pane>
      <el-tab-pane label="部署场所" name="3">
        <DeploymentSite
          ref="deploymentSiteRef"
          :model="deploymentSiteData"
        ></DeploymentSite>
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
  <CnDialog ref="exportRef" v-bind="exportProps">
    <template #footer>
      <el-button type="primary" @click="importFun">确定</el-button>
    </template>
  </CnDialog>
  <BulkEdit ref="bulkEditRef" @onSubmit="() => { props.refresh = new Date().getTime() }"></BulkEdit>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import CnPage from "@/components/cn-page/CnPage.vue";
import CnDialog from "@/components/cn-page/CnDialog.vue";
import BasicInfo from "./child/basicInfo.vue";
import HardwareModule from "./child/hardwareModule.vue";
import DeploymentSite from "./child/deploymentSite.vue";
import BulkEdit from "./child/bulkEdit.vue";
import ConfigInfo from "./child/configInfo.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getUnitListUtils } from "../utils/index";
// import { getTollBarActionDialogConfig, getTableActionConfig } from './config/dialog-config';
import {
  devBaseInfoListPage,
  devBaseInfoStart,
  devBaseInfoStop,
  devBaseInfoLogoff,
  getDevBaseInfo,
  devBaseInfoExport,
  devBaseInfo,
} from "@/api/device";
const activeName = ref("1");
const selectionIds = ref([]);
const exportRef = ref();

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
const supList: any = ref([]);

onMounted( async() => {
  supList.value = await getUnitListUtils().then((res: any) => { return res})
})

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
        "procedureVersion",
      ],
    },
    items: [
      { label: "请选择所需导出的字段", component: "subtitle", span: 24 },
      { prop: "export", component: "checkbox", span: 24, dict: "DEV_EXPORT_COLUMN" },
    ],
  },
});

const props = reactive<CnPage.Props>({
  params: {},
  action: devBaseInfoListPage, // () => Promise.reject(),
  search: {
    items: [
      { label: "设备基本信息", component: "subtitle", span: 24 },
      { label: "设备编号", prop: "proDevCode", component: "input" },
      { label: "设备接入单位设备编号", prop: "unitDevCode", component: "input" },
      { label: "设备类型", prop: "devTypeList", component: "select", dict: "DEV_TYPE", props: { multiple: true } },
      { label: "设备型号", prop: "status", component: "input" },
      {
        label: "硬件模块",
        prop: "hardwareList",
        component: "select",
        dict: "HARDWARE_MODULE",
        props: { multiple: true }
      },
      { label: "操作系统", prop: "operSystem", component: "select", dict: 'DEV_OPER_SYSTEM' },
      {
        label: "设备接入方式",
        prop: "accesType",
        component: "select",
        dict: "DEV_ACCES_TYPE",
      },
      { label: "政务程序版本号", prop: "procedureVersionList", component: "select", dict: 'DEV_VERSION', props: { multiple: true } },
      { label: "安装激活时间", prop: "installActivateTime", component: "datepicker", props: { type: 'datetimerange' } },
      { label: "设备分组", prop: "group", component: "select" },
      { label: "状态", prop: "status", component: "select", dict: "DEV_STATUS" },
      { label: "部署场所", component: "subtitle", span: 24 },
      { label: "行政区划", prop: "ad", component: "ad", props: { props: { checkStrictly: true } } },
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
        prop: "networkPolicyList",
        component: "select",
        dict: "NETWORD_POLICY",
        props: { multiple: true }
      },
      { label: "相关方", component: "subtitle", span: 24 },
      { label: "设备接入单位", prop: "devUnit", component: "select", props: { options: supList } },
      { label: "设备管理单位", prop: "devManageUnit", component: "select", props: { options: supList } },
      { label: "设备技术支撑单位", prop: "supportingUnit", component: "select", props: { options: supList } },
    ],
  },
  transformRequest(params, page, size) {
    const [installActivateStartTime, installActivateEndTime] = params?.installActivateTime || []
    return {
      page,
      size,
      obj: {
        ...params,
        installActivateStartTime,
        installActivateEndTime
      }
    }
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
        buttons: [
          {
            label: "编辑",
            type: "primary",
            text: true,
            onClick: ({ row }) => {
              getDevBaseInfo(row.id).then((res: any) => {
                if (res.code === "200") {
                  res.data.baseInfo.type = "edit";
                  res.data.devDeploymentSite.type = "edit";
                  res.data.devConf.type = "edit";
                  basicInfoData.value = res.data.baseInfo;
                  hardwareModuleData.value = res.data.baseInfo;
                  deploymentSiteData.value = { ...res.data.devUnitInFo, ...res.data.devDeploymentSite};
                  // deploymentSiteData.value = res.data.devDeploymentSite;
                  configInfoData.value = res.data.devConf;
                  deploymentSiteData.value.ip = res.data.baseInfo.ip
                  deploymentSiteData.value.mac = res.data.baseInfo.mac
                  dialoTitle.value = "编辑设备信息";
                  dialogRef.value?.open();
                }
              });
            },
          },
        ],
      },
    ],
    onSelect: (selection: any) => {
      selectionIds.value = selection;
    },
  },
  pagination: true,
});

// 查看详情
function viewDetail(row: any) {
  getDevBaseInfo(row.id).then((res: any) => {
    if (res.code === "200") {
      res.data.baseInfo.type = "view";
      res.data.devDeploymentSite.type = "view";
      res.data.devConf.type = "view";
      basicInfoData.value = res.data.baseInfo;
      hardwareModuleData.value = res.data.baseInfo;
      deploymentSiteData.value = res.data.devDeploymentSite;
      configInfoData.value = res.data.devConf;
      dialoTitle.value = "设备详情";
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
      type: res.headers["content-type"] || "application/vnd.ms-excel",
    });
    let href = window.URL.createObjectURL(blob);
    let downloadElement = document.createElement("a");
    downloadElement.href = href;
    downloadElement.download = "设备列表.xlsx";
    document.body.appendChild(downloadElement);
    downloadElement.click(); //点击下载
    document.body.removeChild(downloadElement); //下载完成移除元素
    exportRef.value?.close();
  });
}

// 编辑
function handleEdit({ row }: any) {
  basicInfoData.value = {};
  hardwareModuleData.value = {};
  deploymentSiteData.value = {};
  configInfoData.value = {};
  dialoTitle.value = "编辑设备信息";
  dialogRef.value?.open();
}
// 取消
const handleCancel = () => {
  dialogRef.value?.close();
};
// 提交编辑
const handleSubmit = () => {
  const flagArr = [
    basicInfoRef.value.validateForm(),
    hardwareModuleRef.value.validateForm(),
    deploymentSiteRef.value.validateForm(),
    configInfoRef.value.validateForm(),
  ];
  let isValidate = false;
  const hardwareForm = {
    hardware: ""
  }
  const deployForm = {
    networkPolicy: ""
  }
  if (hardwareModuleRef.value.getFormData()) {
    hardwareForm.hardware =  hardwareModuleRef.value.getFormData().hardware.join(",")
  }

  deployForm.networkPolicy = deploymentSiteRef.value.getFormData().networkPolicy.join(",")
  const params = {
    baseInfo: { ...basicInfoRef.value.getFormData(), ...hardwareForm }, //  hardwareModuleRef.value.getFormData()
    devConf: configInfoRef.value.getFormData(),
    devDeploymentSite: {...deploymentSiteRef.value.getFormData(), ...deployForm },
    devUnitInFo: {...deploymentSiteRef.value.getFormData(), ...deployForm },
  };
  Promise.all(flagArr).then((res: any) => {
    for (let index = 0; index < res.length; index++) {
      const element = res[index];
      if (element) {
        isValidate = true;
      } else {
        activeName.value = String(index + 1);
        isValidate = false;
        break;
      }
    }
    console.log(params);
    if (isValidate) {
      devBaseInfo(params).then((res) => {
        if (res.code === "200") {
          dialogRef.value?.close();
          ElMessage({
            type: "success",
            message: "提交成功！",
          });
          props.refresh = new Date().getTime()
        }
      });
    }
  });
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
