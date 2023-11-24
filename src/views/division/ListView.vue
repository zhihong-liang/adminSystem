<template>
  <CnPage v-bind="props" />
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import CnPage from '@/components/cn-page/CnPage.vue'

const props = reactive<CnPage.Props>({
  params: {},
  action: () => Promise.reject('暂无接口'),
  search: {
    items: [
      { label: '区划名称', prop: 'name', component: 'input' },
      { label: '区划编号', prop: 'code', component: 'input' },
      { label: '状态', prop: 'status', component: 'select' }
    ]
  },
  table: {
    columns: [
      { label: '区划名称', prop: 'name' },
      { label: '区划编号', prop: 'code' },
      { label: '状态', prop: 'status', dict: 'STATUS' },
      { label: '备注', prop: 'remark' }
    ]
  }
})
</script>
