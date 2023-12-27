<template>
  <CnForm ref="basisRef" v-bind="basisForm" :value="basisForm.model">
    <template #divider>
      <h3>部署场所</h3>
    </template>
    <template #coordinate>
      <!-- <el-form :model="basisForm.model" label-width="120px">
        <el-form-item label="经度">
          <el-input v-model="basisForm.model.pointLat" />
          <el-input v-model="basisForm.model.pointLng" />
        </el-form-item>
      </el-form> -->
      <span>经度：{{ basisForm.model?.pointLat }}</span
      >，
      <span>纬度：{{ basisForm.model?.pointLng }}</span>
    </template>
    <template #divider2>
      <h3>管理单位、技术支持单位</h3>
    </template>
    <template #businessHours>
      <el-form :model="basisForm.model">
        <div v-for="(item, index) in timeSlotList" class="time-slotlit">
          <el-form-item>
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
              style="width: 43%"
            />
            <el-time-select
              v-model="item.endTime"
              :min-time="item.startTime"
              placeholder="结束时间"
              start="00:00"
              step="00:15"
              end="23:45"
              style="width: 43%"
            />
          </el-form-item>
        </div>
      </el-form>
    </template>
  </CnForm>
</template>
<script lang="ts" setup>
import { reactive, ref, watchEffect } from "vue";
import CnForm from "@/components/cn-page/CnForm.vue";
import { devGroupListUtils } from "../../utils/index";

const timeSlotList = reactive([
  { checked: true, startTime: "09:00", endTime: "17:00" },
  { checked: true, startTime: "09:00", endTime: "17:00" },
  { checked: true, startTime: "09:00", endTime: "17:00" },
  { checked: true, startTime: "09:00", endTime: "17:00" },
  { checked: true, startTime: "09:00", endTime: "17:00" },
  { checked: "", startTime: "", endTime: "" },
  { checked: "", startTime: "", endTime: "" }
]);
const timeList = reactive([
  { lable: "周一", value: 0 },
  { lable: "周二", value: 1 },
  { lable: "周三", value: 2 },
  { lable: "周四", value: 3 },
  { lable: "周五", value: 4 },
  { lable: "周六", value: 5 },
  { lable: "周日", value: 6 },
]);

const props = defineProps({
  model: {
    type: Object,
    default: () => ({}),
  },
});

const basisRef = ref();
const groupList: any = ref([])
const basisForm: any = reactive({
  labelWidth: 120,
  colSpan: 12,
  model: {},
  disabled: props.model.type === "view" ? true : false,
  rules: {
    regionDetail: [{ required: true, message: "请选择行政区域" }],
    detailAddress: [{ required: true, message: "请输入详细地址" }],
    coordinate: [{ required: true, message: "请输入地理坐标" }],
    siteName: [{ required: true, message: "请输入部署场所名称" }],
    siteType: [{ required: true, message: "请选择部署场所类型" }],
    networkPolicy: [{ required: true, message: "请选择网络策略" }],
    mac: [{ required: true, message: "请输入mac地址" }],
    ip: [{ required: true, message: "请输入IP地址" }],
    businessHours: [{ required: true, message: "请选择营业时间" }],
    timerOnOff: [{ required: true, message: "请选择是否定时开关机" }],
    devManageUnit: [{ required: true, message: "请选择设备管理单位" }],
    managePersonName: [{ required: true, message: "请输入自助终端管理员" }],
    managePersonContact: [{ required: true, message: "请输入自助终端管理员" }],
    manufacturer: [{ required: true, message: "请输入生产厂商" }],
    supportingUnit: [{ required: true, message: "请输入设备技术支撑单位" }],
    operationPersonName: [{ required: true, message: "请输入运维人员" }],
    operationPersonContact: [{ required: true, message: "请输入运维人员联系方式" }],
  },
  items: [
    {
      component: "slot",
      prop: "divider",
      span: 24,
    },
    {
      label: "行政区划",
      prop: "regionDetail",
      component: "input",
    },
    {
      label: "详细地址",
      prop: "detailAddress",
      component: "input",
    },
    {
      label: "地理坐标",
      prop: "coordinate",
      component: "slot",
      span: 24,
      visible: () => props.model.type === "view",
    },
    {
      label: "地理坐标",
      prop: "coordinate",
      component: "input",
      visible: () => props.model.type !== "view",
    },
    {
      label: "部署场所名称",
      prop: "siteName",
      component: "input",
    },
    {
      label: "部署场所类型",
      prop: "siteType",
      component: "select",
      dict: "DEV_SITE_TYPE",
    },
    {
      label: "网络策略",
      prop: "networkPolicy",
      component: "select",
      props: { multiple: true },
      dict: "NETWORD_POLICY",
    },
    {
      label: "mac地址",
      prop: "mac",
      component: "input",
    },
    {
      label: "IP地址",
      prop: "ip",
      component: "input",
    },
    {
      label: "设备营业时间",
      prop: "businessHours",
      component: "select",
      props: {
        options: [
          { lable: "7 * 24 小时", value: "7 * 24 小时" },
          { lable: "自定义", value: "自定义" },
        ],
      },
    },
    {
      label: "定时开关机",
      prop: "timerOnOff",
      component: "select",
      dict: "YES_NO",
    },
    {
      label: "设备营业时间",
      prop: "businessHours",
      component: "slot",
      span: 24,
      visible: () => basisForm.model?.businessHours === "自定义",
    },

    {
      component: "slot",
      prop: "divider2",
      span: 24,
    },
    {
      label: "设备管理单位",
      prop: "devManageUnit",
      component: "select",
      props: { options: groupList },
    },
    {
      label: "自助终端管理员",
      prop: "managePersonName",
      component: "input",
    },
    {
      label: "自助终端管理员联系方式",
      prop: "managePersonContact",
      component: "input",
    },
    {
      label: "生产厂商",
      prop: "manufacturer",
      component: "input",
    },
    {
      label: "设备技术支撑单位",
      prop: "supportingUnit",
      component: "input",
    },
    {
      label: "运维人员",
      prop: "operationPersonName",
      component: "input",
    },
    {
      label: "运维人员联系方式",
      prop: "operationPersonContact",
      component: "input",
    },
  ],
});

const validateForm = () => {
  // let flag = null;
  // basisRef.value.formRef.validate((valid: boolean) => {
  //   if (valid) {
  //     flag = true;
  //   } else {
  //     flag = false;
  //   }
  // });
  // return flag;
  return basisRef.value.formRef.validate((valid: boolean) => {
    if (valid) {
      return true
    } else {
      return false
    }
  });
};
const getFormData = () => {
  return basisForm.model
}
defineExpose({ validateForm, getFormData });

watchEffect(async () => {
  if (props.model) {
    basisForm.model = props.model;
    groupList.value = await devGroupListUtils().then(res => { return res})
    console.log("设备", groupList);
  }
});
</script>
<style lang="scss" scoped>
.time-slotlit {
  width: 100%;
}
.refuse-bottom {
  border-bottom: 1px solid #cdd0d6;
  div,
  span {
    color: var(--gray9);
  }
}
</style>
