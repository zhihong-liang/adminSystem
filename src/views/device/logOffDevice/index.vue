<template>
  <CnPage v-bind="props" />
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import CnPage from "@/components/cn-page/CnPage.vue";
// import { getDivisionList } from "@/api/admin";

const props = reactive<CnPage.Props>({
  params: {},
  action: () => Promise.reject(),
  search: {
    items: [
      { label: "设备基本信息", component: "divider", span: 24 },
      { label: "设备编号", prop: "areaName", component: "input" },
      { label: "设备接入单位设备编号", prop: "areaCode", component: "input" },
      { label: "设备类型", prop: "status", component: "select" },
      { label: "设备型号", prop: "status", component: "input" },
      { label: "硬件模块", prop: "status", component: "select" },
      { label: "操作系统", prop: "status", component: "select" },
      { label: "设备接入方式", prop: "status", component: "select" },
      { label: "政务程序版本号", prop: "status", component: "select" },
      { label: "安装激活时间", prop: "status", component: "select" },
      { label: "设备分组", prop: "status", component: "select" },
      { label: "状态", prop: "status", component: "select" },
      { label: "部署场所", component: "divider", span: 24 },
      { label: "行政区划", prop: "status", component: "select" },
      { label: "部署场所", prop: "status", component: "input" },
      { label: "部署场所类型", prop: "status", component: "select" },
      { label: "自助终端管理员", prop: "status", component: "select" },
      { label: "网络策略", prop: "status", component: "select" },
      { label: "相关方", component: "divider", span: 24 },
      { label: "设备接入单位", prop: "status", component: "select" },
      { label: "设备管理单位", prop: "status", component: "select" },
      { label: "设备技术支撑单位", prop: "status", component: "select" },
    ],
  },
  toolbar: {
    items: [
      {
        label: '批量编辑',
        type: 'primary',
        onClick: () => {
          dialogRef.value?.open()
          dialogProps.action = () => handleSubmit('add')
        }
      },
      {
        label: '启用',
        type: 'primary',
        onClick: () => {
          dialogRef.value?.open()
          dialogProps.action = () => handleSubmit('add')
        }
      },
      {
        label: '停用',
        type: 'primary',
        onClick: () => {
          dialogRef.value?.open()
          dialogProps.action = () => handleSubmit('add')
        }
      },
      {
        label: '注销',
        type: 'primary',
        onClick: () => {
          dialogRef.value?.open()
          dialogProps.action = () => handleSubmit('add')
        }
      },
      {
        label: '导出',
        type: 'warning',
        onClick: () => {
          dialogRef.value?.open()
          dialogProps.action = () => handleSubmit('add')
        }
      },
    ]
  },
  table: {
    rowKey: "id",
    columns: [
      { type: "selection" },
      { label: "设备编号", prop: "areaName" },
      { label: "设备接入单位设备编号", prop: "areaCode" },
      { label: "设备型号", prop: "status", dict: "STATUS" },
      { label: "行政区划", prop: "remark" },
      { label: "详细地址", prop: "remark" },
      { label: "自助终端管理员联系方式", prop: "remark" },
      { label: "安装激活时间", prop: "remark" },
      { label: "政务程序版本号", prop: "remark" },
      { label: "状态", prop: "remark" },
      {
        prop: 'action',
        label: '操作',
        minWidth: 120,
        buttons: [
          { label: '编辑', type: 'primary', text: true, onClick: handleEdit },
        ]
      }
    ],
  },
  pagination: false,
});

// 编辑
function handleEdit({ row }: any) {
  console.log("编辑");
}
// 批量编辑
function handleSubmit({ row }: any) {
  console.log("编辑");
}

</script>
