<template>
  <CnDialog v-bind="dialogProps" ref="dialogRef">
    <div class="wrap" v-loading="loading">
      <div class="table-left">
        <CnTable max-height="700px" v-bind="tableProps" ref="tableRef"></CnTable>
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
import { reactive, ref } from "vue";
import CnDialog from "@/components/cn-page/CnDialog.vue";
import CnTable from "@/components/cn-page/CnTable.vue";
import {
  mattersProgrammeRelationListProgrammeMatters,
  mattersProgrammeRelationAddList,
} from "@/api/matter";
import { ElMessage, type TableInstance } from "element-plus";

const emits = defineEmits(["onHandleSubmit"]);
const dialogRef = ref();
const loading = ref(false);

const dialogProps: CnPage.DialogProps = reactive({
  title: "选择事项",
  width: 1200,
});

const tableRef = ref()
const tableProps = reactive<CnPage.TableProps>({
  columns: [
    { type: "selection" },
    { label: "事项编号", slot: "matterCode" },
    { label: "事项名称", prop: "matterName" },
    { label: "事项别名", prop: "matterAlias" },
    { label: "事项进驻单位", prop: "entryUnitText" },
    { label: "办理类型", prop: "handleType", dict: "HANDLE_TYPE" },
    { label: "事项状态", prop: "matterStatus", dict: "MATTER_STATUS" },
  ],
  data: [],
  onSelect: (selection) => {
    selectTableProps.data = selection;
  },
  onSelectAll: (selection) => {
    selectTableProps.data = selection
  }
});
const selectTableProps = reactive<CnPage.TableProps>({
  columns: [
    { label: "事项编号", slot: "matterCode" },
    { label: "事项名称", prop: "matterName" },
    { label: "事项别名", prop: "matterAlias" },
    { label: "事项进驻单位", prop: "entryUnitText" },
    { label: "办理类型", prop: "handleType", dict: "HANDLE_TYPE" },
    { label: "事项状态", prop: "matterStatus", dict: "MATTER_STATUS" },
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
            const tableIns = tableRef.value?.$refs?.tableRef as TableInstance
            if (!tableIns) return
            const rows = tableIns.getSelectionRows() || []
            const current = rows.find((v: { mattersId: string; }) => v.mattersId === row.mattersId)
            if (current) {
              tableIns.toggleRowSelection(current, false)
            }
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
  selectTableProps.data = []
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
