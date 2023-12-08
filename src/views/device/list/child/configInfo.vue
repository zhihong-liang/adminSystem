<template>
  <CnForm ref="basisRef" v-bind="configForm"></CnForm>
  <CnTable v-bind="configTable"></CnTable>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
import CnForm from "@/components/cn-page/CnForm.vue";
import CnTable from "@/components/cn-page/CnTable.vue";

const configForm = reactive({
  labelWidth: 120,
  colSpan: 12,
  items: [
    {
      label: "设备分组",
      prop: "fileds",
      span: 24,
    },
    {
      label: "方案名称",
      prop: "fileds",
    },
    {
      label: "事项主题名称",
      prop: "fileds",
    },
    {
      label: "事项列表",
      prop: "fileds",
      span: 24,
    },
  ],
});

const configTable = reactive({
  columns: [
    { label: "事项编号", prop: "areaName" },
    { label: "事项别名", prop: "areaCode" },
    { label: "事项名称", prop: "status", dict: "STATUS" },
    { label: "业务部门", prop: "remark" },
    { label: "系统覆盖范围", prop: "remark" },
    { label: "办理类型", prop: "remark" },
    { label: "事项状态", prop: "remark" },
  ],
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
