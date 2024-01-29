import { reactive, computed, ref } from "vue"
import { getOrderType } from '@/api/order'
import { getUnitList } from '@/api/admin'

export default function useSearch(type: string) {
  const orderList = ref()
  const unitList = ref()
  const operationList = ref()

  getOrderType({
    page: 1,
    size: 1000,
    obj: {}
  }).then((res) => {
    if (res.code === '200') {
      orderList.value = res.rows.map((v) => ({
        label: v.workTypeName,
        value: v.id
      }))
    }
  })

  getUnitList({
    page: 1,
    size: 1000,
    obj: {}
  }).then((res) => {
    if (res.code === '200') {
      unitList.value = res.rows.map((v) => ({
        label: v.fullName,
        value: v.id
      }))
      operationList.value = res.rows.filter((v) => v.unitType === '2').map((v) => ({
        label: v.fullName,
        value: v.id
      }))
    }
  })

  const items = reactive([
    { label: '工单编号', prop: 'workOrderNumber', component: 'input' },
    { label: '情况描述', prop: 'description', component: 'select', dict: 'WORK_DESCIPTION' },
    {
      label: '工单类型',
      prop: 'workTypeId',
      component: 'select',
      props: { options: computed(() => orderList.value) }
    },
    { label: '工单来源', prop: 'orderSource', component: 'select', dict: 'ORDER_SOURCE' },
    {
      label: '工单来源系统',
      prop: 'orderSourceOs',
      component: 'select',
      dict: 'ORDER_SOURCE_OS'
    },
    { label: '创建单位', prop: 'createUnitId', component: 'select', props: { options: computed(() => operationList.value) }, },
    { label: '设备编号', prop: 'devCode', component: 'input' },
    { label: '设备类型', prop: 'devType', component: 'select', dict: 'DEV_TYPE' },
    { label: '运维人员', prop: 'operationPersonName', component: 'input', show: ['All', 'History'] },
    {
      label: '运维单位',
      prop: 'operationUnitId',
      component: 'select',
      props: { options: computed(() => unitList.value) },
      show: ['All', 'History', 'Closed']
    },
    {
      label: '生产厂商',
      prop: 'manufacturer',
      component: 'select',
      props: { options: computed(() => unitList.value) }
    },
    { label: '设备区域', prop: 'ad', component: 'ad', props: { props: { checkStrictly: true } } },
    { label: '工单状态', prop: 'bpmNodeCode', component: 'select', dict: 'WORK_BPM_NODE_CODE', show: ['All'] },
    {
      label: '客户评价',
      prop: 'customEvaluation',
      component: 'select',
      dict: 'WORK_CUSTOM_EVALUATION',
      show: ['All', 'InHandle', 'Handled', 'History']
    },
    { label: '回访情况', prop: 'followUp', component: 'select', dict: 'WORK_FOLLOW_UP', show: ['All', 'InHandle', 'Handled', 'History'] },
    {
      label: '创建时间',
      prop: 'orderApplyTime',
      component: 'datepicker',
      props: { type: 'datetimerange', unlinkPanels: true, valueFormat: 'YYYY-MM-DD HH:mm', format: 'YYYY-MM-DD HH:mm', timeFormat: 'HH:mm' }
    },
    {
      label: '完成时间',
      prop: 'orderCloseTime',
      component: 'datepicker',
      props: { type: 'datetimerange', unlinkPanels: true , valueFormat: 'YYYY-MM-DD HH:mm',format: 'YYYY-MM-DD HH:mm', timeFormat: 'HH:mm'},
      show: ['All', 'Handled', 'History', 'Closed']
    }
  ] as any[])

  const itme = items.filter((v) => !v.show || v.show.includes(type))
  return itme
}