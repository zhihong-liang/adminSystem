<template>
  <CnForm v-bind="baseForm" />
</template>

<script lang="ts" setup>
import CnForm from '@/components/cn-page/CnForm.vue'
import { reactive } from 'vue'

const baseForm = reactive({
  model: {},
  items: [
    { label: '工单编号', prop: 'name' },
    { label: '工单来源系统', prop: 'status' },
    { label: '工单来源', prop: 'userNo5' },
    { label: '提交人姓名', prop: 'userNo5' },
    { label: '提交人手机号码', prop: 'userNo5' },
    { label: '派单员姓名', prop: 'userNo5' },
    { label: '派单员手机号码', prop: 'userNo5' }
  ],
  labelWidth: 100,
  colSpan: 24,
  rules: {}
})
</script>
