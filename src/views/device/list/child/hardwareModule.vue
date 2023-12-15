<template>
  <CnForm ref="hardwareRef" v-bind="hardwareForm" :value="hardwareForm.model"></CnForm>
</template>
<script lang="ts" setup>
import { reactive, ref, defineProps, watchEffect } from "vue";
import CnForm from "@/components/cn-page/CnForm.vue";
const props = defineProps({
  model: {
    type: Object,
    default: () => ({}),
  },
});
const hardwareForm = reactive({
  labelWidth: 120,
  colSpan: 12,
  model: {},
  disabled: props.model.type === "edit" ? true : false,
  items: [
    {
      label: "硬件模块",
      prop: "hardware",
      component: "select",
      dict: "HARDWARE_MODULE",
      span: 24,
      visible: () => props.model.type === "edit"
    },
    {
      label: "硬件模块",
      prop: "hardware",
      component: "select",
      props: { multiple: true },
      dict: "HARDWARE_MODULE",
      span: 24,
      visible: () => props.model.type !== "edit"
    },
  ],
});
watchEffect(() => {
  if (props.model) {
    hardwareForm.model = props.model;
  }
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
