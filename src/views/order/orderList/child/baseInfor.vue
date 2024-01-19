<template>
  <CnForm v-bind="baseForm" />
</template>

<script lang="ts" setup>
import CnForm from '@/components/cn-page/CnForm.vue'
import { reactive } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const baseForm = reactive({
  model: props.data,
  items: [
    { label: '工单编号', prop: 'workOrderNumber' },
    { label: '工单来源系统', prop: 'orderSourceOs', dict: 'ORDER_SOURCE_OS' },
    { label: '工单来源', prop: 'orderSource', dict: 'ORDER_SOURCE' },
    { label: '提交人姓名', prop: 'submitterName' },
    { label: '提交人手机号码', prop: 'submitterPhone' },
    { label: '派单员姓名', prop: 'xxx' },
    { label: '派单员手机号码', prop: 'xxx' }
  ],
  labelWidth: 100,
  colSpan: 24,
  rules: {}
})
</script>
