<template>
  <CnForm ref="hardwareRef" v-bind="hardwareForm" :value="hardwareForm.model"></CnForm>
</template>
<script lang="ts" setup>
import { reactive, ref, defineProps, watchEffect, onMounted } from "vue";
import CnForm from "@/components/cn-page/CnForm.vue";
const props = defineProps({
  model: {
    type: Object,
    default: () => ({}),
  },
});

const hardwareRef = ref();

const hardwareForm: any = reactive({
  labelWidth: 120,
  colSpan: 12,
  model: {},
  readonly: props.model.type === "view" ? true : false,
  rules: {
    hardware: [{ required: true, message: "请选择硬件模块" }],
  },
  items: [
    {
      label: "硬件模块",
      prop: "hardware",
      component: "select",
      props: { multiple: true },
      dict: "HARDWARE_MODULE",
      span: 24,
    },
  ],
});

const validateForm = () => {
  return hardwareRef.value.formRef.validate((valid: boolean) => {
    if (valid) {
      return true;
    } else {
      return false;
    }
  });
};
const getFormData = () => {
  return hardwareForm.model;
};
defineExpose({ validateForm, getFormData });

watchEffect(() => {
  if (props.model.hardware) {
    hardwareForm.model.hardware = props.model.hardware.split(",");
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
