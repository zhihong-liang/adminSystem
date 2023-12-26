<template>
  <CnPage v-bind="props" />
</template>

<script lang="ts" setup>
import CnPage from '@/components/cn-page/CnPage.vue'
import { reactive, ref } from 'vue';

const props: CnPage.Props = reactive({
  params: {},
  action: () => Promise.reject(),
  search: {
    items: [
      { label: '工单编号', prop: 'name', component: 'input' },
      { label: '运维/巡检内容', prop: 'name', component: 'input' },
      { label: '工单来源', prop: 'phone', component: 'select' },
      { label: '工单类型', prop: 'phone', component: 'select' },
      { label: '工单来源系统', prop: 'phone', component: 'select' }
    ]
  },
  toolbar: {
    items: [
      {
        label: '新增',
        type: 'primary',
      }
    ]
  },
  table: {
    columns: [
      { type: 'selection' },
      { prop: 'name', label: '工单编号' },
      { prop: 'name', label: '关联工单' },
      { prop: 'name', label: '工单类型' },
      { prop: 'name', label: '工单来源系统' },
      { prop: 'name', label: '运维/巡检内容' },
      { prop: 'name', label: '设备编号' },
      { prop: 'name', label: '创建单位' },
      { prop: 'name', label: '派单员' },
      { prop: 'name', label: '运维人员' },
      { prop: 'name', label: '创建时间' },
      { prop: 'name', label: '完成时间' },
      { prop: 'name', label: '工单耗时' },
      { prop: 'status', label: '工单状态', dict: 'USER_STATUS' },
      { prop: 'name', label: '客户评价' },
      { prop: 'name', label: '客户评价满意度' },
      { prop: 'name', label: '回访状态' },
      { prop: 'name', label: '关闭原因' },
      { prop: 'name', label: '备注' },
      {
        prop: 'action',
        label: '操作',
        width: 220,
        buttons: [
          { label: '补充', type: 'primary', text: true },
          { label: '分拨', type: 'success', text: true },
          { label: '派单', type: 'primary', text: true },
        ],
      }
    ]
  }
})
</script>