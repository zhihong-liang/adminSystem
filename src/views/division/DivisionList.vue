<template>
  <CnPage v-bind="props" />
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import CnPage from '@/components/cn-page/CnPage.vue'
import { areaList } from '@/api/admin'

const props = reactive<CnPage.Props>({
  params: { parentId: 0 },
  action: areaList,
  transformRequest: (params) => {
    if (params.areaName || params.areaCode) {
      delete params.parentId
    } else {
      params.parentId = 0
    }
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
      { label: '状态', prop: 'status', component: 'select', dict: 'AREA_STATUS' }
    ]
  },
  table: {
    rowKey: 'id',
    load: (row: any, treeNode: unknown, resolve: any) => {
      areaList({ parentId: row.id }).then((res: any) => {
        resolve(res.data)
      })
    },
    lazy: true,
    treeProps: { children: 'children', hasChildren: 'open' },
    columns: [
      { label: '区划名称', prop: 'areaName' },
      { label: '区划编号', prop: 'areaCode' },
      { label: '状态', prop: 'status', dict: 'AREA_STATUS' },
      { label: '备注', prop: 'remark' }
    ]
  },
  pagination: false
})
</script>
