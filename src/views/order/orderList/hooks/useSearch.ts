import { reactive } from "vue"

export default function useSearch(type: string) {
  const items = reactive([
    { label: '工单编号', prop: 'name', component: 'input' },
    { label: '运维/巡检内容', prop: 'name', component: 'input' },
    { label: '工单来源', prop: 'phone', component: 'select' },
    { label: '工单类型', prop: 'phone', component: 'select' },
    { label: '工单来源系统', prop: 'phone', component: 'select' },
    { label: '创建单位', prop: 'phone', component: 'select' },
    { label: '设备编号/设备接入单位设备编号', prop: 'phone', component: 'input' },
    { label: '设备类型', prop: 'phone', component: 'select' },
    { label: '运维人员', prop: 'phone', component: 'input', show: ['NotHandle', 'InHandle', 'Handled', 'Finished', 'Closed'] },
    { label: '运维单位', prop: 'phone', component: 'select' },
    { label: '生产厂商', prop: 'phone', component: 'select', show: ['Dispatch', 'NotHandle', 'InHandle', 'Handled', 'Finished', 'Closed'] },
    { label: '行政区域', prop: 'phone', component: 'ad' },
    { label: '工单状态', prop: 'phone', component: 'select', show: ['Finished', 'Closed'] },
    { label: '完成情况', prop: 'phone', component: 'select', show: ['Handled', 'Finished'] },
    { label: '客户评价', prop: 'phone', component: 'select', show: ['Handled', 'Finished'] },
    { label: '客户评价满意度', prop: 'phone', component: 'select', show: ['Handled', 'Finished'] },
    { label: '回访状态', prop: 'phone', component: 'select', show: ['Finished'] },
    {
      label: '创建时间',
      prop: 'phone',
      component: 'datepicker',
      props: { type: 'daterange', unlinkPanels: true }
    },
    {
      label: '完成时间',
      prop: 'phone',
      component: 'datepicker',
      props: { type: 'daterange', unlinkPanels: true },
      show: ['Finished', 'Closed']
    },
  ] as any[])

  const itme = items.filter((v) => !v.show || v.show.includes(type))
  return itme
}