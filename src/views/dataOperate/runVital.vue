<template>
    <CnPage v-bind="pages" />
  </template>
  
  <script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import CnPage from '@/components/cn-page/CnPage.vue'
  import { getUserList } from '@/api/admin'
  
  const pages: CnPage.Props = reactive({
    params: {},
    action: getUserList,
    search: {
      items: [
        { label: '设备编号', prop: 'name', component: 'input' },
        { label: '设备接入单位设备编号', prop: 'name1', component: 'input' },
        { label: '设备类型', prop: 'name2', component: 'select' },
        { label: '设备型号', prop: 'name2', component: 'select' },
        { label: '设备接入单位', prop: 'name2', component: 'select' },
        { label: '设备技术支撑单位', prop: 'name2', component: 'select' },
        { label: '行政区域', prop: 'name2', component: 'ad' },
        { label: '查询时间', prop: 'name2', component: 'input' },
      ]
    },
    toolbar: {
      items: [
        {
          label: '导出',
          type: 'warning'
        }
      ]
    },
    table: {
      columns: [
        { type: 'selection' },
        { type: 'index', label: '序号', width: 60 },
        { prop: 'name', label: '设备编号' },
        { prop: 'name', label: '设备接入单位设备编号' },
        { prop: 'name', label: '设备类型' },
        { prop: 'name', label: '设备型号' },
        { prop: 'name', label: '部署场所' },
        { prop: 'name', label: '行政区划' },
        { prop: 'name', label: '详细地址' },
        { prop: 'name', label: '计划在线时长(小时)' },
        { prop: 'name', label: '在线故障时长(小时)' },
        { prop: 'name', label: '在线正常时长(小时)' },
        { prop: 'name', label: '在线天数(小时)' },
        { prop: 'name', label: '在线率' },
      ]
    }
  })
  </script>
  