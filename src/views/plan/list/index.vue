<template>
  <CnPage
    v-bind="props"
    @success="
      () => {
        props.refresh = new Date().getTime();
      }
    "
  ></CnPage>
  <Addplan ref="addplayRef"></Addplan>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import { mattersProgrammeListPage, delMattersProgramme } from "@/api/matter";
import Addplan from "./child/addplan.vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { log } from "console";

const addplayRef = ref();

// 删除
const handleRemove = ({ row }: any) => {
  ElMessageBox.confirm(`确定要删除${row.programmeName}?`, {
    title: "删除",
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    beforeClose: (action, instance, done) => {
      if (action === "confirm") {
        instance.confirmButtonLoading = true;
        instance.confirmButtonText = "Loading...";

        delMattersProgramme(row.id)
          .then((res) => {
            const { code, message } = res;
            if (code == "200") {
              done();
            }
          })
          .finally(() => {});
      } else {
        done();
      }
    },
  }).then(() => {
    ElMessage.success({ message: "删除成功" });
    props.refresh = new Date().getTime();
  });
};

const props: CnPage.Props = reactive({
  params: {},
  action: (params) => mattersProgrammeListPage(params),
  search: {
    items: [
      { label: "方案编号", prop: "programmeCode", component: "input" },
      { label: "方案名称", prop: "programmeName", component: "input" },
      { label: "主题名称", prop: "themeId", component: "input" },
      { label: "状态", prop: "devType", component: "select", dict: "START_STOP" },
    ],
  },
  toolbar: {
    items: [
      {
        label: "新增",
        type: "primary",
        onClick: () => {
          addplayRef.value?.open({}, "add");
        },
      },
    ],
  },
  table: {
    rowKey: "id",
    columns: [
      { label: "方案编号", prop: "programmeCode" },
      { label: "方案名称", prop: "programmeName" },
      { label: "备注", prop: "remark" },
      { label: "主题名称", prop: "themeName" },
      { label: "关联事项数", prop: "mattersCount" },
      { label: "关联设备数", prop: "devCount" },
      { label: "状态", prop: "status", dict: "START_STOP" },
      {
        prop: "action",
        label: "操作",
        minWidth: 150,
        buttons: [
          {
            label: "编辑",
            type: "primary",
            text: true,
            onClick: ({ row }) => {
              addplayRef.value?.open(row, "edit");
              // addplayRef.value?.open(row, 'edit')
            },
          },
          {
            label: "选择事项",
            type: "info",
            text: true,
            onClick: ({ row }) => {
              addplayRef.value?.open(row, "select");
            },
          },
          { label: "删除", type: "danger", text: true, onClick: handleRemove },
        ],
      },
    ],
  },
  pagination: true,
  refresh: new Date().getTime(),
  // transformResponse: () => {}
});
</script>

<style scoped lang="scss"></style>
