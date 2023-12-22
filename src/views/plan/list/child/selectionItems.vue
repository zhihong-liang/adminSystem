<template>
  <CnDialog v-bind="dialogProps" ref="dialogRef">
    <el-row :gutter="20">
      <el-col :span="12">
        <CnTable v-bind="tableProps"></CnTable>
      </el-col>
      <el-col :span="12">
        <CnTable v-bind="selectTableProps"></CnTable>
      </el-col>
    </el-row>
    <template #footer>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </CnDialog>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import CnDialog from "@/components/cn-page/CnDialog.vue";
import CnPage from "@/components/cn-page/CnPage.vue";
import {
  mattersProgrammeRelationListProgrammeMatters,
  mattersProgrammeRelationAddList,
} from "@/api/matter";
import { ElMessage } from "element-plus";
const emits = defineEmits(["onHandleSubmit"]);
const dialogRef = ref();

const dialogProps: CnPage.DialogProps = reactive({
  title: "选择事项",
  width: 1200,
});

const tableProps = reactive<CnPage.Props>({
  columns: [
    { type: "selection" },
    { label: "事项编号", slot: "matterCode" },
    { label: "事项名称", prop: "matterName" },
    { label: "事项别名", prop: "matterAlias" },
    { label: "事项进驻单位", prop: "entryUnitText" },
    { label: "办理类型", prop: "handleType", dict: "HANDLE_TYPE" },
    { label: "事项状态", prop: "matterStatus", dict: "HANDLE_TYPE" },
  ],
  data: [],
  onSelect: (selection: any) => {
    console.log(selection);
    selectTableProps.data = selection;
  },
});
const selectTableProps = reactive<CnPage.Props>({
  columns: [
    { label: "事项编号", slot: "matterCode" },
    { label: "事项名称", prop: "matterName" },
    { label: "事项别名", prop: "matterAlias" },
    { label: "事项进驻单位", prop: "entryUnitText" },
    { label: "办理类型", prop: "handleType", dict: "HANDLE_TYPE" },
    { label: "事项状态", prop: "matterStatus", dict: "HANDLE_TYPE" },
    {
      prop: "action",
      label: "操作",
      minWidth: 120,
      buttons: [
        {
          label: "取消选择",
          type: "primary",
          text: true,
          onClick: ({ row }) => {
            selectTableProps.data = selectTableProps.data.filter(
              (item) => item.mattersId !== row.mattersId
            );
          },
        },
      ],
    },
  ],
  data: [],
});

const open = async (data: any) => {
  console.log(data);
  dialogRef.value.open();
  mattersProgrammeRelationListProgrammeMatters(data).then((res) => {
    console.log(res);
    const { code, data } = res;
    if (code === "200") {
      tableProps.data = data;
    }
  });
};

const handleSubmit = () => {
  // const params = {

  // }
  mattersProgrammeRelationAddList(selectTableProps.data).then((res) => {
    if (res.code === "200") {
      emits("onHandleSubmit", selectTableProps.data);
      dialogRef.value.close();
      ElMessage({
        type: "success",
        message: res.message,
      });
    } else {
      ElMessage({
        type: "error",
        message: res.message,
      });
    }
  });
};

defineExpose({ open });
</script>

<style scoped lang="scss"></style>
