<template>
  <CnPage v-bind="pages">
    <template #codeSlot="{ row }">
      <el-button link @click="handleOpen('Look')">{{ row.name }}</el-button>
    </template>
  </CnPage>
  <detail ref="detailRef"></detail>
  <repulse ref="repulseRef"></repulse>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { getUserList } from '@/api/admin'
import CnPage from '@/components/cn-page/CnPage.vue'
import detail from './child/detail.vue'
import repulse from './child/repulse.vue'
import useSearch from './hooks/useSearch'

const props = defineProps({
  type: {
    type: String,
    default: ''
  }
})

const detailRef = ref()
const repulseRef = ref()

const handleOpen = (type: string, all = false) => {
  detailRef.value.open(type, all)
}

const handleRepuse = () => {
  repulseRef.value.open()
}

const toolBtn: any[] = [
  {
    label: '分拨',
    type: 'primary',
    onClick: () => handleOpen('Allocation', true),
    visible: ['Allocation']
  },
  {
    label: '派单',
    type: 'primary',
    onClick: () => handleOpen('Dispatch', true),
    visible: ['Dispatch']
  },
  {
    label: '转派',
    type: 'primary',
    onClick: () => handleOpen('Transfer', true),
    visible: ['NotHandle', 'InHandle']
  },
  {
    label: '处理',
    type: 'primary',
    onClick: () => handleOpen('Handle', true),
    visible: ['NotHandle']
  },
  {
    label: '完成处理',
    type: 'primary',
    onClick: () => handleOpen('FinishDeal', true),
    visible: ['InHandle']
  },
  {
    label: '退回工单',
    type: 'primary',
    onClick: () => handleOpen('Back', true),
    visible: ['Dispatch', 'NotHandle']
  },
  {
    label: '关闭工单',
    type: 'primary',
    onClick: () => handleOpen('Close', true),
    visible: ['Allocation', 'Dispatch', 'NotHandle']
  },
  {
    label: '完成',
    type: 'primary',
    onClick: () => handleOpen('Finish', true),
    visible: ['Handled']
  },
  {
    label: '评价',
    type: 'primary',
    onClick: () => handleOpen('Evaluate', true),
    visible: ['Handled']
  },
  {
    label: '回访',
    type: 'primary',
    onClick: () => handleOpen('Visit', true),
    visible: ['Handled']
  },
  { label: '打回工单', type: 'primary', onClick: () => handleRepuse(), visible: ['Handled'] },
  { label: '导出', type: 'primary' }
]

const tableBtn: any[] = [
  {
    label: '补充',
    type: 'primary',
    text: true,
    onClick: () => handleOpen('Supply'),
    visible: ['Allocation']
  },
  {
    label: '分拨',
    type: 'primary',
    text: true,
    onClick: () => handleOpen('Allocation'),
    visible: ['Allocation']
  },
  {
    label: '派单',
    type: 'primary',
    text: true,
    onClick: () => handleOpen('Dispatch'),
    visible: ['Dispatch']
  },
  {
    label: '转派',
    type: 'primary',
    text: true,
    onClick: () => handleOpen('Transfer'),
    visible: ['NotHandle', 'InHandle']
  },
  {
    label: '处理',
    type: 'primary',
    text: true,
    onClick: () => handleOpen('Handle'),
    visible: ['NotHandle']
  },
  {
    label: '完成处理',
    type: 'primary',
    text: true,
    onClick: () => handleOpen('FinishDeal'),
    visible: ['InHandle']
  },
  {
    label: '退回工单',
    type: 'primary',
    text: true,
    onClick: () => handleOpen('Back'),
    visible: ['Dispatch', 'NotHandle']
  },
  {
    label: '关闭工单',
    type: 'primary',
    text: true,
    onClick: () => handleOpen('Close'),
    visible: ['Allocation', 'Dispatch', 'NotHandle']
  },
  {
    label: '完成',
    type: 'primary',
    text: true,
    onClick: () => handleOpen('Finish'),
    visible: ['Handled']
  },
  {
    label: '打回工单',
    type: 'primary',
    text: true,
    onClick: () => handleRepuse(),
    visible: ['Handled']
  }
]

const columns: any[] = [
  { type: 'selection' },
  { slot: 'codeSlot', label: '工单编号' },
  { prop: 'name', label: '工单类型' },
  { prop: 'name', label: '工单来源系统' },
  { prop: 'name', label: '描述' },
  { prop: 'name', label: '设备编号' },
  { prop: 'name', label: '创建单位' },
  {
    prop: 'name',
    label: '派单员',
    visible: ['Dispatch', 'NotHandle', 'InHandle', 'Handled', 'Finished', 'Closed']
  },
  {
    prop: 'name',
    label: '运维人员',
    visible: ['NotHandle', 'InHandle', 'Handled', 'Finished', 'Closed']
  },
  { prop: 'name', label: '运维单位', visible: ['Allocation'] },
  { prop: 'name', label: '创建时间' },
  { prop: 'name', label: '完成时间', visible: ['Handled', 'Finished', 'Closed'] },
  { prop: 'name', label: '工单耗时', visible: ['Handled', 'Finished', 'Closed'] },
  { prop: 'status', label: '状态', dict: 'USER_STATUS' },
  { prop: 'name', label: '客户评价', visible: ['Handled', 'Finished'] },
  { prop: 'name', label: '客户评价满意度', visible: ['Handled', 'Finished'] },
  { prop: 'name', label: '回访状态', visible: ['Handled', 'Finished'] },
  { prop: 'name', label: '关闭原因', visible: ['Closed'] },
  { prop: 'name', label: '备注', visible: ['Closed'] },
  {
    prop: 'action',
    label: '操作',
    width: 220,
    visible: ['Allocation', 'Dispatch', 'NotHandle', 'InHandle', 'Handled'],
    buttons: tableBtn.filter((v) => v.visible?.includes(props.type))
  }
]

const pages: CnPage.Props = reactive({
  params: {},
  action: getUserList,
  search: {
    items: useSearch(props.type)
  },
  toolbar: {
    items: toolBtn.filter((v) => !v.visible || v.visible?.includes(props.type))
  },
  table: {
    columns: columns.filter((v) => !v.visible || v.visible?.includes(props.type)),
    data: [{}]
  }
})
</script>
