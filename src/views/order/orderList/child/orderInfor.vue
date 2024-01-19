<template>
  <CnForm v-bind="orderForm" />
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

const orderForm = reactive({
  model: props.data,
  items: [
    { label: '设备编号', prop: 'devCode' },
    { label: '设备接入单位设备编号', prop: 'xxx' },
    { label: '设备地址', prop: 'address' },
    { label: '设备类型', prop: 'devType', dict: 'DEV_TYPE' },
    { label: '自助终端管理员', prop: 'xx' },
    { label: '手机号码', prop: 'createUser' },
    { label: '描述', prop: 'remark' },
    { label: '图片', prop: 'imagePath' },
    { label: '紧急程度', prop: 'urgencyLevel', dict: 'WORK_URGENCY_LEVEL' },
    { label: '运维单位', prop: 'createUnitId' },
    { label: '运维人员姓名', prop: 'operationPersonName' },
    { label: '运维人员手机号码', prop: 'operationPersonContact' }
  ],
  labelWidth: 100,
  colSpan: 24,
  rules: {}
})
</script>
