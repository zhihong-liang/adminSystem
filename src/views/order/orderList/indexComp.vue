<template>
  <CnPage v-bind="pages">
    <template #codeSlot="{ row }">
      <el-button link @click="handleOpen('Look', {})">{{ row.workOrderNumber }}</el-button>
    </template>
  </CnPage>
  <detail
    ref="detailRef"
    @success="
      () => {
        pages.refresh = Date.now()
      }
    "
  ></detail>
  <repulse ref="repulseRef"></repulse>
</template>

<script lang="ts" setup>
import { reactive, ref, computed, provide } from 'vue'
import { orderBaseListPage } from '@/api/order'
import CnPage from '@/components/cn-page/CnPage.vue'
import detail from './child/detail.vue'
import repulse from './child/repulse.vue'
import useSearch from './hooks/useSearch'

const props = defineProps({
  type: {
    type: String,
    default: ''
  },
  // 流程节点
  bpmNodeCode: {
    type: String,
    default: ''
  }
})

const detailRef = ref()
const repulseRef = ref()

const detailData = ref()

provide('homeData', computed(() => detailData.value))

const handleOpen = (type: string, data: any, workAuditType = '', all = false) => {
  detailData.value = data
  detailRef.value.open(type, data, workAuditType, all)
}

const handleRepuse = (data: any) => {
  repulseRef.value.open(data)
}

const toolBtn: any[] = [
  // {
  //   label: '分拨',
  //   type: 'primary',
  //   onClick: () => handleOpen('Allocation', {}, '', true),
  //   visible: ['Allocation']
  // },
  // {
  //   label: '派单',
  //   type: 'primary',
  //   onClick: () => handleOpen('Dispatch', {}, '', true),
  //   visible: ['Dispatch']
  // },
  // {
  //   label: '转派',
  //   type: 'primary',
  //   onClick: () => handleOpen('Transfer', {}, '', true),
  //   visible: ['NotHandle', 'InHandle']
  // },
  // {
  //   label: '处理',
  //   type: 'primary',
  //   onClick: () => handleOpen('Handle', {}, '', true),
  //   visible: ['NotHandle']
  // },
  // {
  //   label: '完成处理',
  //   type: 'primary',
  //   onClick: () => handleOpen('FinishDeal', {}, '', true),
  //   visible: ['InHandle']
  // },
  // {
  //   label: '退回工单',
  //   type: 'primary',
  //   onClick: () => handleOpen('Back', {}, '', true),
  //   visible: ['Dispatch', 'NotHandle']
  // },
  // {
  //   label: '关闭工单',
  //   type: 'primary',
  //   onClick: () => handleOpen('Close', {}, '', true),
  //   visible: ['Allocation', 'Dispatch', 'NotHandle']
  // },
  // {
  //   label: '完成',
  //   type: 'primary',
  //   onClick: () => handleOpen('Finish', {}, '', true),
  //   visible: ['Handled']
  // },
  // {
  //   label: '评价',
  //   type: 'primary',
  //   onClick: () => handleOpen('Evaluate', {}, '', true),
  //   visible: ['Handled']
  // },
  // {
  //   label: '回访',
  //   type: 'primary',
  //   onClick: () => handleOpen('Visit', {}, '', true),
  //   visible: ['Handled']
  // },
  // { label: '打回工单', type: 'primary', onClick: () => handleRepuse(), visible: ['Handled'] },
  {
    label: '导出',
    type: 'primary',
    visible: ['Allocation', 'Dispatch', 'NotHandle', 'InHandle', 'Handled', 'History']
  }
]

const tableBtn: any[] = [
  {
    label: '补充',
    type: 'primary',
    text: true,
    onClick: ({ row }) => handleOpen('Supply', row, '95'),
    visible: ['Allocation']
  },
  {
    label: '分拨',
    type: 'primary',
    text: true,
    onClick: ({ row }) => handleOpen('Allocation', row, '2'),
    visible: ['Allocation']
  },
  {
    label: '派单',
    type: 'primary',
    text: true,
    onClick: ({ row }) => handleOpen('Dispatch', row, '3'),
    visible: ['Dispatch']
  },
  {
    label: '转派',
    type: 'primary',
    text: true,
    onClick: ({ row }) => handleOpen('Transfer', row, '4'),
    visible: ['NotHandle', 'InHandle']
  },
  {
    label: '处理',
    type: 'primary',
    text: true,
    onClick: ({ row }) => handleOpen('Handle', row, '6'),
    visible: ['NotHandle']
  },
  {
    label: '完成处理',
    type: 'primary',
    text: true,
    onClick: ({ row }) => handleOpen('FinishDeal', row, '8'),
    visible: ['InHandle']
  },
  {
    label: '退回工单',
    type: 'primary',
    text: true,
    onClick: ({ row }) => handleOpen('Back', row, '5'),
    visible: ['Dispatch', 'NotHandle']
  },
  {
    label: '关闭工单',
    type: 'primary',
    text: true,
    onClick: ({ row }) => handleOpen('Close', row, '0'),
    visible: ['Allocation', 'Dispatch', 'NotHandle']
  },
  {
    label: '完成',
    type: 'primary',
    text: true,
    onClick: ({ row }) => handleOpen('Finish', row, '99'),
    visible: ['Handled']
  },
  {
    label: '评价',
    type: 'primary',
    text: true,
    onClick: ({ row }) => handleOpen('Evaluate', row, '96'),
    visible: ['Handled']
  },
  {
    label: '回访',
    type: 'primary',
    text: true,
    onClick: ({ row }) => handleOpen('Visit', row, '97'),
    visible: ['Handled']
  },
  {
    label: '打回工单',
    type: 'primary',
    text: true,
    onClick: ({ row }) => handleRepuse(row),
    visible: ['Handled']
  }
]

const columns: any[] = [
  { type: 'selection' },
  { slot: 'codeSlot', label: '工单编号', width: 130 },
  { prop: 'workTypeIdText', label: '工单类型' },
  { prop: 'orderSourceOs', label: '工单来源系统', dict: 'ORDER_SOURCE_OS' },
  { prop: 'description', label: '情况描述', dict: 'WORK_DESCIPTION' },
  { prop: 'devCode', label: '设备编号', width: 160 },
  { prop: 'createUnitId', label: '创建单位' },
  { prop: 'xxx', label: '派单员', visible: ['Closed'] },
  {
    prop: 'operationPersonName',
    label: '运维人员',
    visible: ['NotHandle', 'InHandle', 'Handled', 'History', 'Closed']
  },
  { prop: 'orderApplyTime', label: '创建时间', width: 165 },
  { prop: 'orderCloseTime', label: '完成时间', visible: ['Closed'] },
  { prop: 'takeUpTime', label: '工单耗时', visible: ['History', 'Closed'] },
  {
    prop: 'urgencyLevel',
    label: '紧急程度',
    dict: 'WORK_URGENCY_LEVEL',
    visible: ['Allocation', 'Dispatch', 'NotHandle', 'InHandle']
  },
  { prop: 'bpmNodeCode', label: '状态', dict: 'WORK_BPM_NODE_CODE' },
  { prop: 'custom_evaluation', label: '客户评价', visible: ['Handled', 'History'] },
  { prop: 'followUp', label: '回访情况', visible: ['Handled', 'History'] },
  { prop: 'xxx', label: '关闭原因', visible: ['Closed'] },
  { prop: 'xxx', label: '备注', visible: ['Closed'] },
  {
    prop: 'action',
    label: '操作',
    width: 220,
    visible: ['Allocation', 'Dispatch', 'NotHandle', 'InHandle', 'Handled'],
    buttons: tableBtn.filter((v) => v.visible?.includes(props.type))
  }
]

const pages: CnPage.Props = reactive({
  params: { bpmNodeCode: props.bpmNodeCode },
  action: orderBaseListPage,
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
