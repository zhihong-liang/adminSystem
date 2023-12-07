<template>
  <CnForm ref="basisRef" v-bind="basisForm"></CnForm>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
import CnForm from "@/components/cn-page/CnForm.vue";

const basisForm = reactive({
  labelWidth: 120,
  colSpan: 12,
  items: [
    {
      label: "省统一设备编号",
      prop: "fileds",
    },
    {
      label: "状态",
      prop: "fileds",
    },
    {
      label: "设备接入单位设备编号",
      prop: "fileds",
    },
    {
      label: "设备接入单位",
      prop: "fileds",
    },
    {
      label: "设备类型",
      prop: "fileds",
    },
    {
      label: "设备型号",
      prop: "fileds",
    },
    {
      label: "硬件模块",
      prop: "fileds",
    },
    {
      label: "设备来源",
      prop: "fileds",
    },
    {
      label: "政务程序版本号",
      prop: "fileds",
    },
    {
      label: "操作系统",
      prop: "fileds",
    },
    {
      label: "设备用途",
      prop: "fileds",
    },
    {
      label: "到货时间",
      prop: "fileds",
    },
    {
      label: "安装激活时间",
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
