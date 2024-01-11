<template>
  <CnForm v-bind="orderForm" />
</template>

<script lang="ts" setup>
import CnForm from '@/components/cn-page/CnForm.vue'
import { reactive } from 'vue'

const orderForm = reactive({
  model: {},
  items: [
    { label: '设备编号', prop: 'name' },
    { label: '设备接入单位设备编号', prop: 'status' },
    { label: '设备地址', prop: 'userNo5' },
    { label: '设备类型', prop: 'userNo5' },
    { label: '自助终端管理员', prop: 'userNo5' },
    { label: '手机号码', prop: 'userNo5' },
    { label: '描述', prop: 'userNo5' },
    { label: '图片', prop: 'userNo5' },
    { label: '紧急程度', prop: 'userNo5' },
    { label: '预约上门服务时间', prop: 'userNo5' },
    { label: '运维单位', prop: 'userNo5' },
    { label: '运维人员姓名', prop: 'userNo5' },
    { label: '运维人员手机号码', prop: 'userNo5' }
  ],
  labelWidth: 100,
  colSpan: 24,
  rules: {}
})
</script>
