<template>
  <CnDialog
    v-bind="dialogProps"
    ref="dialogRef"
  >
    <Table v-bind="tableProps"></Table>
  </CnDialog>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import CnDialog from "@/components/cn-page/CnDialog.vue";
import CnPage from "@/components/cn-page/CnPage.vue";
import { mattersThemeLabelList } from "@/api/matter";
import { getMattersThemeInfoList } from "../../utils/index";


const dialogRef = ref();

const dialogProps: CnPage.DialogProps = reactive({
  title: "新增",
});

const tableProps = reactive<CnPage.Props>({
  columns: [
    { type: "selection" },
    { label: "事项编号", slot: "proDevCode" },
    { label: "事项名称", prop: "unitDevCode" },
    { label: "事项别名", prop: "status", dict: "devModelNo" },
    { label: "事项进驻单位", prop: "regionDetail" },
    { label: "系统覆盖范围", prop: "detailAddress" },
    { label: "办理类型", prop: "terminalManagePhone" },
    { label: "事项状态", prop: "installActivateTime" },
    {
      prop: "action",
      label: "操作",
      minWidth: 120,
      // buttons: [{ label: "编辑", type: "primary", text: true, onClick: handleEdit }],
    },
  ],
  data: [],
});

const open = async (data: any, _type: string) => {
  console.log(data);
  
  dialogRef.value.open();
  if (_type == "add") {
    // 新增
    // dialogProps.formProps!.model = {};
    // dialogProps.action = () => handleSubmit("add");
    dialogProps.title = "新增";
  } else {
    // dialogProps.action = () => handleSubmit("edit");
    dialogProps.title = "编辑";
  }
  // dialogProps.formProps!.model = data;
};


defineExpose({ open });
</script>

<style scoped lang="scss">
</style>
