<template>
  <CnForm ref="basisRef" v-bind="basisForm"> </CnForm>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
import CnForm from "@/components/cn-page/CnForm.vue";

const basisForm = reactive({
  labelWidth: 120,
  colSpan: 12,
  items: [
    {
      label: "部署场所",
      component: "divider", 
      span: 24 
    },
    {
      label: "行政区划",
      prop: "fileds",
    },
    {
      label: "详细地址",
      prop: "fileds",
    },
    {
      label: "地理坐标",
      prop: "fileds",
    },
    {
      label: "部署场所名称",
      prop: "fileds",
    },
    {
      label: "部署场所类型",
      prop: "fileds",
    },
    {
      label: "网络策略",
      prop: "fileds",
    },
    {
      label: "mac地址",
      prop: "fileds",
    },
    {
      label: "IP地址",
      prop: "fileds",
    },
    {
      label: "设备营业时间",
      prop: "fileds",
    },
    {
      label: "定时开关机",
      prop: "fileds",
    },
    {
      label: "管理单位、技术支持单位",
      component: "divider", 
      span: 24 
    },
    {
      label: "设备管理单位",
      prop: "fileds",
    },
    {
      label: "自助终端管理员",
      prop: "fileds",
    },
    {
      label: "自助终端管理员联系方式",
      prop: "fileds",
    },
    {
      label: "生产厂商",
      prop: "fileds",
    },
    {
      label: "设备技术支撑单位",
      prop: "fileds",
    },
    {
      label: "运维人员",
      prop: "fileds",
    },
    {
      label: "运维人员联系方式",
      prop: "fileds",
    },
  ],
});
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
