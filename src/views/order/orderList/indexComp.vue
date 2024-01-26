<template>
  <CnPage v-bind="pages">
    <template #codeSlot="{ row }">
      <el-button link @click="handleOpen('Look', row)">{{ row.workOrderNumber }}</el-button>
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
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { orderBaseListPage, orderHistoryList } from '@/api/order'
import CnPage from '@/components/cn-page/CnPage.vue'
import detail from './child/detail.vue'
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

const handleOpen = (type: string, data: any, workAuditType = '', all = false) => {
  detailRef.value.open(type, data, workAuditType, all)
}

const toolBtn: any[] = [
  // {
  //   label: '分拨',
  //   type: 'primary',
  //   onClick: () => handleOpen('Allocation', {}, '', true),
  //   show: ['Allocation']
  // },
  // {
  //   label: '派单',
  //   type: 'primary',
  //   onClick: () => handleOpen('Dispatch', {}, '', true),
  //   show: ['Dispatch']
  // },
  // {
  //   label: '转派',
  //   type: 'primary',
  //   onClick: () => handleOpen('Transfer', {}, '', true),
  //   show: ['NotHandle', 'InHandle']
  // },
  // {
  //   label: '处理',
  //   type: 'primary',
  //   onClick: () => handleOpen('Handle', {}, '', true),
  //   show: ['NotHandle']
  // },
  // {
  //   label: '完成处理',
  //   type: 'primary',
  //   onClick: () => handleOpen('FinishDeal', {}, '', true),
  //   show: ['InHandle']
  // },
  // {
  //   label: '退回工单',
  //   type: 'primary',
  //   onClick: () => handleOpen('Back', {}, '', true),
  //   show: ['Dispatch', 'NotHandle']
  // },
  // {
  //   label: '关闭工单',
  //   type: 'primary',
  //   onClick: () => handleOpen('Close', {}, '', true),
  //   show: ['Allocation', 'Dispatch', 'NotHandle']
  // },
  // {
  //   label: '完成',
  //   type: 'primary',
  //   onClick: () => handleOpen('Finish', {}, '', true),
  //   show: ['Handled']
  // },
  // {
  //   label: '评价',
  //   type: 'primary',
  //   onClick: () => handleOpen('Evaluate', {}, '', true),
  //   show: ['Handled']
  // },
  // {
  //   label: '回访',
  //   type: 'primary',
  //   onClick: () => handleOpen('Visit', {}, '', true),
  //   show: ['Handled']
  // },
  // { label: '打回工单', type: 'primary', onClick: () => handleOpen('Repulse', {}, '', true), show: ['Handled'] },
  {
    label: '导出',
    type: 'primary',
    show: ['Allocation', 'Dispatch', 'NotHandle', 'InHandle', 'Handled', 'History']
  }
]

const tableBtn: any[] = [
  {
    label: '补充',
    type: 'primary',
    text: true,
    onClick: ({ row }) => handleOpen('Supply', row, '95'),
    show: ['Allocation']
  },
  {
    label: '分拨',
    type: 'primary',
    text: true,
    onClick: ({ row }) => handleOpen('Allocation', row, '2'),
    show: ['Allocation']
  },
  {
    label: '派单',
    type: 'primary',
    text: true,
    onClick: ({ row }) => handleOpen('Dispatch', row, '3'),
    show: ['Dispatch']
  },
  {
    label: '转派',
    type: 'primary',
    text: true,
    onClick: ({ row }) => handleOpen('Transfer', row, '4'),
    show: ['NotHandle', 'InHandle']
  },
  {
    label: '处理',
    type: 'primary',
    text: true,
    onClick: ({ row }) => handleOpen('Handle', row, '6'),
    show: ['NotHandle']
  },
  {
    label: '完成处理',
    type: 'primary',
    text: true,
    onClick: ({ row }) => handleOpen('FinishDeal', row, '8'),
    show: ['InHandle']
  },
  {
    label: '退回工单',
    type: 'primary',
    text: true,
    onClick: ({ row }) => handleOpen('Back', row, '5'),
    show: ['Dispatch', 'NotHandle']
  },
  {
    label: '关闭工单',
    type: 'primary',
    text: true,
    onClick: ({ row }) => handleOpen('Close', row, '0'),
    show: ['Allocation', 'Dispatch', 'NotHandle']
  },
  {
    label: '完成',
    type: 'primary',
    text: true,
    onClick: ({ row }) => handleOpen('Finish', row, '99'),
    show: ['Handled']
  },
  {
    label: '评价',
    type: 'primary',
    text: true,
    onClick: ({ row }) => handleOpen('Evaluate', row, '96'),
    show: ['Handled']
  },
  {
    label: '回访',
    type: 'primary',
    text: true,
    onClick: ({ row }) => handleOpen('Visit', row, '97'),
    show: ['Handled']
  },
  {
    label: '打回工单',
    type: 'primary',
    text: true,
    onClick: ({ row }) => handleOpen('Repulse', row, '98'),
    show: ['Handled']
  }
]

const columns: any[] = [
  { type: 'selection' },
  { slot: 'codeSlot', label: '工单编号', width: 140 },
  { prop: 'workTypeIdText', label: '工单类型' },
  { prop: 'orderSourceOs', label: '工单来源系统', dict: 'ORDER_SOURCE_OS' },
  { prop: 'description', label: '情况描述', dict: 'WORK_DESCIPTION' },
  { prop: 'devCode', label: '设备编号', width: 160 },
  { prop: 'createUnitId', label: '创建单位' },
  { prop: 'xxx', label: '派单员', show: ['Closed'] },
  {
    prop: 'operationPersonName',
    label: '运维人员',
    show: ['NotHandle', 'InHandle', 'Handled', 'History', 'Closed']
  },
  { prop: 'orderApplyTime', label: '创建时间', width: 165 },
  { prop: 'orderCloseTime', label: '完成时间', show: ['Closed'] },
  { prop: 'takeUpTime', label: '工单耗时', show: ['History', 'Closed'] },
  {
    prop: 'urgencyLevel',
    label: '紧急程度',
    dict: 'WORK_URGENCY_LEVEL',
    show: ['Allocation', 'Dispatch', 'NotHandle', 'InHandle']
  },
  { prop: 'bpmNodeCode', label: '状态', dict: 'WORK_BPM_NODE_CODE' },
  { prop: 'custom_evaluation', label: '客户评价', show: ['Handled', 'History'] },
  { prop: 'followUp', label: '回访情况', show: ['Handled', 'History'] },
  { prop: 'xxx', label: '关闭原因', show: ['Closed'] },
  { prop: 'xxx', label: '备注', show: ['Closed'] },
  {
    prop: 'action',
    label: '操作',
    width: 220,
    show: ['Allocation', 'Dispatch', 'NotHandle', 'InHandle', 'Handled'],
    buttons: tableBtn.filter((v) => v.show?.includes(props.type))
  }
]

const pages: CnPage.Props = reactive({
  params:
    props.type === 'History'
      ? { bpmNodeCodeList: ['1500', '1550'] }
      : { bpmNodeCode: props.bpmNodeCode },
  action: props.type === 'History' ? orderHistoryList : orderBaseListPage,
  search: {
    items: useSearch(props.type)
  },
  toolbar: {
    items: toolBtn.filter((v) => !v.show || v.show?.includes(props.type))
  },
  table: {
    columns: columns.filter((v) => !v.show || v.show?.includes(props.type)),
    data: [{}]
  }
})
</script>
