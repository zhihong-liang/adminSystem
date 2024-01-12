<template>
  <CnForm ref="basisRef" v-bind="basisForm" :value="basisForm.model"></CnForm>
</template>
<script lang="ts" setup>
import { reactive, ref, defineProps, watchEffect } from "vue";
import CnForm from "@/components/cn-page/CnForm.vue";
import { getUnitListUtils } from "../../utils/index";

const props = defineProps({
  model: {
    type: Object,
    default: () => ({}),
  },
});
const supList: any = ref([]);
const basisRef = ref()

const basisForm = reactive({
  labelWidth: 120,
  colSpan: 12,
  model: {},
  disabled: props.model.type === "view" ? true : false,
  rules: {
    proDevCode: [{ required: true, message: "请输入省统一设备编号" }],
    status: [{ required: true, message: "请选择状态" }],
    unitDevCode: [{ required: true, message: "请输入设备接入单位设备编号" }],
    devUnit: [{ required: true, message: "请输入设备接入单位" }],
    devType: [{ required: true, message: "请选择设备类型" }],
    devModelNo: [{ required: true, message: "请输入设备型号" }],
    accesType: [{ required: true, message: "请输入设备接入方式" }],
    devSource: [{ required: true, message: "请输入设备来源" }],
    procedureVersion: [{ required: true, message: "请输入政务程序版本号" }],
    operSystem: [{ required: true, message: "请输入操作系统" }],
    devUsage: [{ required: true, message: "请输入设备用途" }],
    comeTime: [{ required: true, message: "请选择到货时间" }],
    installActivateTime: [{ required: true, message: "请选择安装激活时间" }],
  },
  items: [
    { label: "省统一设备编号", prop: "proDevCode", component: "input", props: {disabled: true}  },
    { label: "状态", prop: "status", component: "select", dict: "DEV_STATUS", props: {disabled: true}  },
    { label: "设备接入单位设备编号", prop: "unitDevCode", component: "input", },
    { label: "设备接入单位", prop: "devUnit", component: "select", props: { options: supList }},
    { label: "设备类型", prop: "devType", component: "select", dict: "DEV_TYPE" },
    { label: "设备型号", prop: "devModelNo", component: "input" },
    { label: "设备接入方式", prop: "accesType", component: "select", dict: 'DEV_ACCES_TYPE' },
    { label: "设备来源", prop: "devSource", component: "input" },
    { label: "政务程序版本号", prop: "procedureVersion", component: "select", dict: 'DEV_VERSION' },
    { label: "操作系统", prop: "operSystem", component: "select", dict: 'DEV_OPER_SYSTEM' },
    { label: "设备用途", prop: "devUsage", component: "select", dict: "DEV_USAGE"  },
    { label: "到货时间", prop: "comeTime", component: "datepicker", },
    { label: "安装激活时间", prop: "installActivateTime", component: "datepicker", props: { disabled: true }  },
  ],
});
const validateForm = () => {
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

watchEffect(async() => {
  if (props.model) {
    basisForm.model = props.model
    supList.value = await getUnitListUtils().then(res => { return res})
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
