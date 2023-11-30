<template>
  <CnPage v-bind="props" />
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import CnPage from '@/components/cn-page/CnPage.vue'
import { getDivisionList } from '@/api/admin';

const props = reactive<CnPage.Props>({
  params: {},
  action: getDivisionList,
  transformRequest: (params) => {
    return params
  },
  transformResponse: (data) => {
    return {
      ...data,
      rows: data.data
    }
  },
  search: {
    items: [
      { label: '区划名称', prop: 'areaName', component: 'input' },
      { label: '区划编号', prop: 'areaCode', component: 'input' },
      { label: '状态', prop: 'status', component: 'select' }
    ]
  },
  table: {
    rowKey: 'id',
    columns: [
      { label: '区划名称', prop: 'areaName' },
      { label: '区划编号', prop: 'areaCode' },
      { label: '状态', prop: 'status', dict: 'STATUS' },
      { label: '备注', prop: 'remark' }
    ]
  },
  pagination: false
})
</script>
