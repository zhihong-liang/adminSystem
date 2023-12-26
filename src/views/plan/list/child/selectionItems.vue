<template>
  <CnDialog v-bind="dialogProps" ref="dialogRef">
    <div class="wrap" v-loading="loading">
      <div class="table-left">
        <CnTable max-height="700px" v-bind="tableProps"></CnTable>
      </div>
      <div class="table-icon">
        <el-icon>
          <DArrowRight />
        </el-icon>
      </div>
      <div class="table-right">
        <CnTable max-height="700px" v-bind="selectTableProps"></CnTable>
      </div>
    </div>

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
const loading = ref(false);

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
            console.log(tableProps);
            
            // selectTableProps.data = selectTableProps.data.filter(
            //   (item) => item.mattersId !== row.mattersId
            // );
          },
        },
      ],
    },
  ],
  data: [],
});

const open = (data: any) => {
  loading.value = true;
  dialogRef.value.open();
  mattersProgrammeRelationListProgrammeMatters(data)
    .then((res) => {
      console.log(res);
      const { code, data } = res;
      if (code === "200") {
        tableProps.data = data;
      }
    })
    .finally(() => {
      loading.value = false;
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

<style lang="scss" scoped>
.wrap {
  display: flex;
  width: 100%;

  .table-left {
    width: calc(50% - 20px);
    // border: 1px solid #ebeef5;
  }
  .table-icon {
    flex: 1;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .table-right {
    width: calc(50% - 20px);
    // border: 1px solid #ebeef5;
  }
}
</style>
