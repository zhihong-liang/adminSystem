<template>
  <!-- v-bind="bulkEditProps" -->
  <CnDialog ref="bulkEditRef" v-bind="dialogProps">
    <div v-if="step1 === 1">
      <CnForm ref="bulkEditFromRef" v-bind="bulkEditFrom">
        <template #footer>
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
      <!-- <el-form :model="stpeThreeFrom" label-width="120px">
            <span v-for="(item, index) in formModel" :key="index">
                <span v-if="item.length > 0">
                    <el-form-item v-for="(i, key) in item" :key="key">
                        <span  v-if="i.index === key">
                            <CnFormItem v-model="i.prop" :component="i.component"></CnFormItem>
                        </span>
                    </el-form-item>
                </span>
            </span>
        </el-form> -->
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
          <BusinessHours v-model="businessHoursWeek" />
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
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted, watch } from "vue";
import CnTable from "@/components/cn-page/CnTable.vue";
import CnDialog from "@/components/cn-page/CnDialog.vue";
import CnForm from "@/components/cn-page/CnForm.vue";
import { Plus, Delete } from "@element-plus/icons-vue";
import { mattersProgrammeListPageUtils } from "../../utils/index";
import BusinessHours from "./BusinessHours.vue";

const bulkEditRef = ref<InstanceType<typeof CnDialog>>();
import {
  devBaseInfoList,
  devGroupList,
  devBaseInfoEditList,
} from "@/api/device";
import { ElMessage } from "element-plus";
const step1 = ref(1);
const loading = ref(false);
const bulkForm: any = reactive({
  timeSlotList: [{ checked: "", startTime: "09:00", endTime: "17:00" }],
});
const bulkEditFromRef = ref();
const stpeThreeBulkEditFromRef = ref();
const matList: any = ref([]);
const venueInfoOptions: any = ref([]);
const dialoTitle = ref("批量编辑");
const emits = defineEmits(["onSubmit"]);
const propsTableLength = ref(0);

const businessHoursWeek = ref<Record<string, string>>({})

onMounted(async () => {
  matList.value = await mattersProgrammeListPageUtils().then(res => { return res})
});
const dialogProps = reactive<CnPage.DialogProps>({
  title: dialoTitle.value, // "设备详情",
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
  footerSpan: 8,
  model: {},
  items: [
    { label: "请批量筛选设备", component: "divider", span: 24 },
    { label: "设备接入单位", prop: "devUnit", component: "select", dict: 'UNIT_LIST' },
    { label: "设备管理单位", prop: "devManageUnit", component: "select", dict: 'UNIT_LIST' },
    { label: "设备技术支撑单位", prop: "supportingUnit", component: "select", dict: 'UNIT_LIST' },
    { label: "设备型号", prop: "devModelNo", component: "input" },
    { label: "设备类型", prop: "devType", component: "select", dict: "DEV_TYPE" },
    { label: "行政区划", prop: "regionDetail", component: "ad", props: { props: { checkStrictly: true } } },
    { label: "部署场所", prop: "siteName", component: "input" },
    {
      label: "部署场所类型",
      prop: "siteTypeList",
      component: "select",
      dict: "DEV_SITE_TYPE",
      props: { multiple: true },
    },
    { label: "硬件模块", prop: "hardwareList", component: "select", dict: "HARDWARE_MODULE", props: { multiple: true } },
    {
      label: "网络策略",
      prop: "networkPolicyList",
      component: "select",
      dict: "NETWORD_POLICY",
      props: { multiple: true },
    },
    { label: "自助终端管理员", prop: "managePersonName", component: "input" },
    {
      label: "政务程序版本号",
      prop: "procedureVersionList",
      component: "select",
      dict: 'DEV_VERSION',
      props: { multiple: true }
    },
    {
      label: "设备分组",
      prop: "groupId",
      component: "cascader",
      props: {
        props: {
          emitPath: false,
          label: 'groupName',
          value: 'id',
          checkStrictly: true,
          lazy: true,
          lazyLoad: (node, resolve) => {
            devGroupList({ parentId: node.data?.id || 0 }).then(res => {
              resolve(res.data.map((v: any) => ({ ...v, leaf: !v.open })))
            })
          }
        }
      }
    },
  ],
});
const stpeTowBulkEditFrom: any = reactive({
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
          { label: "设备管理单位", value: "devManageUnit" },
          { label: "设备技术支撑单位", value: "supportingUnit" },
          { label: "设备型号", value: "devModelNo" },
          { label: "硬件模块", value: "hardware" },
        ],
      },
    },
    { prop: "venueInfo", component: "slot", span: 24 },
    {
      prop: "venueInfo",
      component: "checkbox",
      span: 24,
      props: {
        options: venueInfoOptions,
      },
    },
    { prop: "networkInfo", component: "slot", span: 24 },
    {
      prop: "networkPolicy",
      component: "checkbox",
      props: {
        options: [{ label: "网络策略", value: 0 }],
      },
      //   dict: "NETWORD_POLICY",
      span: 24,
    },
    { prop: "configInfo", component: "slot", span: 24 },
    {
      prop: "configInfo",
      component: "checkbox",
      span: 24,
      props: {
        options: [
          { label: "设备分组", value: "groupId" },
          { label: "方案", value: "programmeId" },
        ],
      },
    },
  ],
});

const stpeThreeBulkEditFrom: any = reactive({
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
    timerOnOff: [{ required: true, message: "请选择是否定时开关机" }],
    programmeId: [{ required: true, message: "请选择方案" }],
  },
  items: [
    {
      prop: "deviceInfo",
      component: "slot",
      span: 24,
      visible: () => stpeTowBulkEditFrom.model?.deviceInfo.length > 0,
    },
    {
      label: "设备管理单位",
      prop: "devManageUnit",
      component: "select",
      span: 24,
      dict: 'UNIT_LIST',
      visible: () => false, //stpeTowBulkEditFrom.model?.deviceInfo.length > 0,
    },
    {
      label: "设备技术支撑单位",
      prop: "supportingUnit",
      component: "select",
      span: 24,
      dict: 'UNIT_LIST',
      visible: () => false, //stpeTowBulkEditFrom.model?.deviceInfo.length > 0,
    },
    {
      label: "设备型号",
      prop: "devModelNo",
      component: "input",
      span: 24,
      visible: () => false, //stpeTowBulkEditFrom.model?.deviceInfo.length > 0,
    },
    {
      label: "硬件模块",
      prop: "hardware",
      component: "select",
      span: 24,
      props: { multiple: true },
      dict: "HARDWARE_MODULE",
      visible: () => false, //stpeTowBulkEditFrom.model?.deviceInfo.length > 0,
    },
    {
      label: "运维人员",
      prop: "operationPersonName",
      component: "input",
      span: 24,
      visible: () => stpeTowBulkEditFrom.model?.deviceInfo.length > 0,
    },
    {
      label: "运维人员联系方式",
      prop: "operationPersonContact",
      component: "input",
      span: 24,
      visible: () => stpeTowBulkEditFrom.model?.deviceInfo.length > 0,
    },
    // {
    //   label: "设备分组",
    //   prop: "groupId",
    //   component: "select",
    //   span: 24,
    //   props: { options: gupList },
    //   visible: () => stpeTowBulkEditFrom.model?.deviceInfo.length > 0,
    // },
    {
      prop: "venueInfo",
      component: "slot",
      span: 24,
      visible: () => stpeTowBulkEditFrom.model?.venueInfo.length > 0,
    },
    {
      label: "行政区划",
      prop: "provinceCode",
      component: "ad",
      span: 24,
      visible: () => false, // stpeTowBulkEditFrom.model?.venueInfo.length > 0,
    },
    {
      label: "详细地址",
      prop: "detailAddress",
      component: "input",
      span: 24,
      visible: () => false, // stpeTowBulkEditFrom.model?.venueInfo.length > 0,
    },
    {
      label: "地理坐标",
      prop: "pointLatLng",
      component: "input",
      span: 24,
      visible: () => false, // stpeTowBulkEditFrom.model?.venueInfo.length > 0,
    },
    {
      label: "部署场所名称",
      prop: "siteName",
      component: "input",
      span: 24,
      visible: () => false, // stpeTowBulkEditFrom.model?.venueInfo.length > 0,
    },
    {
      label: "部署场所类型",
      prop: "siteType",
      component: "select",
      span: 24,
      dict: "DEV_SITE_TYPE",
      visible: () => false, // stpeTowBulkEditFrom.model?.venueInfo.length > 0,
    },
    {
      label: "设备用途",
      prop: "devUsage",
      component: "select",
      span: 24,
      dict: "DEV_USAGE",
      visible: () => false, // stpeTowBulkEditFrom.model?.venueInfo.length > 0,
    },
    {
      label: "自助终端管理员",
      prop: "managePersonName",
      component: "input",
      span: 24,
      visible: () => false, // stpeTowBulkEditFrom.model?.venueInfo.length > 0,
    },
    {
      prop: "businessHoursSlot",
      component: "slot",
      span: 24,
      visible: () => false, // stpeTowBulkEditFrom.model?.venueInfo.length > 0,
    },
    {
      label: "设备营业时间",
      prop: "businessHours",
      component: "select",
      dict: "DEV_BUSINESS_HOURS",
      span: 24,
      visible: () => false, // stpeTowBulkEditFrom.model?.venueInfo.length > 0,
    },
    {
      prop: "timeSlot",
      component: "slot",
      span: 24,
      visible: () => stpeThreeBulkEditFrom.model?.businessHours === "3",
    },
    {
      label: "定时开关机",
      prop: "timerOnOff",
      component: "select",
      span: 24,
      dict: "YES_NO",
      visible: () => false, // stpeTowBulkEditFrom.model?.venueInfo.length > 0,
    },
    {
      prop: "networkInfo",
      component: "slot",
      span: 24,
      visible: () => stpeTowBulkEditFrom.model?.networkPolicy.length > 0,
    },
    {
      label: "网络策略",
      prop: "networkPolicy",
      component: "checkbox",
      dict: "NETWORD_POLICY",
      span: 24,
      visible: () => stpeTowBulkEditFrom.model?.networkPolicy.length > 0,
    },
    {
      prop: "configInfo",
      component: "slot",
      span: 24,
      visible: () => stpeTowBulkEditFrom.model?.configInfo.length > 0,
    },
    {
      label: "设备分组",
      prop: "groupId",
      span: 24,
      component: "cascader",
      props: {
        props: {
          emitPath: false,
          label: 'groupName',
          value: 'id',
          lazy: true,
          lazyLoad: (node, resolve) => {
            devGroupList({ parentId: node.data?.id || 0 }).then(res => {
              resolve(res.data.map((v: any) => ({ ...v, leaf: !v.open })))
            })
          }
        }
      },
      visible: () => false,
    },
    {
      label: "方案",
      prop: "programmeId",
      component: "select",
      span: 24,
      props: { options: matList },
      visible: () => false,
    },
  ],
});

// 筛选
function handleScreen() {
  //   console.log("筛选", bulkEditFrom.model);
  const params = {
    ...bulkEditFrom.model,
  };
  devBaseInfoList(params).then((res: any) => {
    if (res.code === "200") {
      propsTable.data = res.data;
      propsTableLength.value = res.data.length;
      venueInfoOptions.value = [
        {
          label: "行政区划",
          value: "provinceCode",
          disabled: propsTableLength.value >= 10,
        }, // propsTable.data.length >= 1
        {
          label: "详细地址",
          value: "detailAddress",
          disabled: propsTableLength.value >= 10,
        },
        {
          label: "地理坐标",
          value: "pointLatLng",
          disabled: propsTableLength.value >= 10,
        },
        {
          label: "部署场所名称",
          value: "siteName",
          disabled: propsTableLength.value >= 10,
        },
        { label: "部署场所类型", value: "siteType" },
        { label: "设备用途", value: "devUsage" },
        { label: "自助终端管理员", value: "managePersonName" },
        { label: "设备营业时间", value: "businessHours" },
        { label: "定时开关机", value: "timerOnOff" }
      ]
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
  const towData: any = stpeTowBulkEditFrom.model;
  if (step1.value === 2) {
    if (
      towData.deviceInfo.length < 1 &&
      towData.venueInfo.length < 1 &&
      towData.networkPolicy.length < 1 &&
      towData.configInfo.length < 1
    ) {
      ElMessage({
        type: "error",
        message: "请勾选要编辑的项目",
      });
    } else {
      stpeThreeBulkEditFrom.items.map((item: any) => {
        for (const name in stpeTowBulkEditFrom.model) {
          if (stpeTowBulkEditFrom.model[name].length > 0) {
            stpeTowBulkEditFrom.model[name].map((i: any) => {
              if (i === item.prop) {
                item.visible = () => true;
              }
            });
          }
        }
      });
      step1.value = step1.value + 1;
    }
  } else {
    step1.value = step1.value + 1;
  }
};
// 上一步
const BackStep = () => {
  step1.value = step1.value - 1;
};
// 提交
const submitTo = () => {
  stpeThreeBulkEditFromRef.value.formRef.validate((valid: boolean) => {
    if (valid) {
      step1.value = 4;
    }
  });
};
// 确定
const determine = () => {
  const ids: any = [];
  propsTable.data.map((item) => {
    ids.push(item.id);
  });
  const params = {
    ids: ids,
    ...stpeThreeBulkEditFrom.model,
  };
  if (params.hardware) {
    console.log(params.hardware.join(","));
    params.hardware = params.hardware.join(",");
  }
  if (params.networkPolicy) {
    console.log(params.networkPolicy.join(","));
    params.networkPolicy = params.networkPolicy.join(",");
  }
  if (params.businessHours === "3") {
    for (let key in businessHoursWeek.value) {
      params[key] = businessHoursWeek.value[key]
    }
  }
  devBaseInfoEditList(params).then((res) => {
    if (res.code === "200") {
      bulkEditRef.value?.close();
      ElMessage({
        type: "success",
        message: "提交成功！",
      });
      emits("onSubmit");
    }
  });
};
// 添加时间段
const addTime = () => {
  // const timeSlotList = reactive([{ checked: "", startTime: "", endTime: "" }]);
  if (bulkForm.timeSlotList.length < 7) {
    bulkForm.timeSlotList.push({ checked: "", startTime: "09:00", endTime: "17:00" });
  } else {
    return;
  }
};
// 删除时间段
const deleteTime = (index: number) => {
  bulkForm.timeSlotList.splice(index, 1);
};
const open = async () => {
  bulkEditRef.value?.open();
  step1.value = 1;
  propsTable.data = [];
};
defineExpose({ open });
</script>
<style lang="scss" scoped></style>
