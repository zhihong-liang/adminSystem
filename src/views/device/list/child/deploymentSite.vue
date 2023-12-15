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
      <span>经度：{{basisForm.model?.pointLat}}</span>，
      <span>纬度：{{basisForm.model?.pointLng}}</span>
    </template>
    <template #divider2>
      <h3>管理单位、技术支持单位</h3>
    </template>
  </CnForm>
</template>
<script lang="ts" setup>
import { reactive, ref, watchEffect } from "vue";
import CnForm from "@/components/cn-page/CnForm.vue";

const props = defineProps({
  model: {
    type: Object,
    default: () => ({}),
  },
});

const basisForm = reactive({
  labelWidth: 120,
  colSpan: 12,
  model: {},
  disabled: props.model.type === "edit" ? true : false,
  items: [
    {
      component: "slot",
      prop: "divider",
      span: 24 
    },
    {
      label: "行政区划",
      prop: "regionDetail",
      component: "input" 
    },
    {
      label: "详细地址",
      prop: "detailAddress",
      component: "input"
    },
    {
      label: "地理坐标",
      prop: "coordinate",
      component: "slot",
    },
    {
      label: "部署场所名称",
      prop: "siteName",
      component: "input"
    },
    {
      label: "部署场所类型",
      prop: "siteType",
      component: "select",
      dict: "DEV_SITE_TYPE" 
    },
    {
      label: "网络策略",
      prop: "networkPolicy",
      component: "select",
      dict: "NETWORD_POLICY"
    },
    {
      label: "mac地址",
      prop: "mac",
      component: "input"
    },
    {
      label: "IP地址",
      prop: "ip",
      component: "input"
    },
    {
      label: "设备营业时间",
      prop: "fileds",
      component: "input"
    },
    {
      label: "定时开关机",
      prop: "timerOnOff",
      component: "select",
      dict: "YES_NO"
    },
    {
      component: "slot",
      prop: "divider2",
      span: 24 
    },
    {
      label: "设备管理单位",
      prop: "devManageUnit",
      component: "select",
    },
    {
      label: "自助终端管理员",
      prop: "managePersonName",
      component: "input"
    },
    {
      label: "自助终端管理员联系方式",
      prop: "managePersonContact",
      component: "input"
    },
    {
      label: "生产厂商",
      prop: "manufacturer",
      component: "input"
    },
    {
      label: "设备技术支撑单位",
      prop: "supportingUnit",
      component: "input"
    },
    {
      label: "运维人员",
      prop: "operationPersonName",
      component: "input"
    },
    {
      label: "运维人员联系方式",
      prop: "operationPersonContact",
      component: "input"
    },
  ],
});
watchEffect(() => {
  if (props.model) {
    basisForm.model = props.model
  }
})
</script>
<style lang="scss" scoped>
.refuse-bottom {
  border-bottom: 1px solid #cdd0d6;
  div,
  span {
    color: var(--gray9);
  }
}
</style>
