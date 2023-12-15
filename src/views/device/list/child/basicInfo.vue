<template>
  <CnForm ref="basisRef" v-bind="basisForm" :value="basisForm.model"></CnForm>
</template>
<script lang="ts" setup>
import { reactive, defineProps, watchEffect } from "vue";
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
      label: "省统一设备编号",
      prop: "proDevCode",
      component: "input" 
    },
    {
      label: "状态",
      prop: "status",
      component: "select",
      dict: "DEV_STATUS" 
    },
    {
      label: "设备接入单位设备编号",
      prop: "unitDevCode",
      component: "input",
    },
    {
      label: "设备接入单位",
      prop: "devUnit",
      component: "select",
      dict: "DEV_STATUS" 
    },
    {
      label: "设备类型",
      prop: "devType",
      component: "select",
      dict: "DEV_TYPE" 
    },
    {
      label: "设备型号",
      prop: "devModelNo",
      component: "input",
    },
    {
      label: "设备来源",
      prop: "devSource",
      component: "input",
    },
    {
      label: "政务程序版本号",
      prop: "procedureVersion",
      component: "input",
    },
    {
      label: "操作系统",
      prop: "operSystem",
      component: "input",
    },
    {
      label: "设备用途",
      prop: "devUsage",
      component: "input",
    },
    {
      label: "到货时间",
      prop: "comeTime",
      component: "datepicker",
    },
    {
      label: "安装激活时间",
      prop: "installActivateTime",
      component: "datepicker",
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
