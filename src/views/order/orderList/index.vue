<template>
  <CnPage v-bind="props">
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

const detailRef = ref()
const repulseRef = ref()

const handleOpen = (type: string, all = false) => {
  detailRef.value.open(type, all)
}

const handleRepuse = () => {
  repulseRef.value.open()
}

const props: CnPage.Props = reactive({
  params: {},
  action: getUserList,
  search: {
    items: [
      { label: '工单编号', prop: 'name', component: 'input' },
      { label: '运维/巡检内容', prop: 'name', component: 'input' },
      { label: '工单来源', prop: 'phone', component: 'select' },
      { label: '工单类型', prop: 'phone', component: 'select' },
      { label: '工单来源系统', prop: 'phone', component: 'select' },
      { label: '创建单位', prop: 'phone', component: 'select' },
      { label: '设备编号/设备接入单位设备编号', prop: 'phone', component: 'input' },
      { label: '设备类型', prop: 'phone', component: 'select' },
      { label: '运维人员', prop: 'phone', component: 'input' },
      { label: '运维单位', prop: 'phone', component: 'select' },
      { label: '生产厂商', prop: 'phone', component: 'select' },
      { label: '行政区域', prop: 'phone', component: 'ad' },
      { label: '工单状态', prop: 'phone', component: 'select' },
      { label: '完成情况', prop: 'phone', component: 'select' },
      { label: '客户评价', prop: 'phone', component: 'select' },
      { label: '客户评价满意度', prop: 'phone', component: 'select' },
      { label: '回访状态', prop: 'phone', component: 'select' },
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
        props: { type: 'daterange', unlinkPanels: true }
      }
    ]
  },
  toolbar: {
    items: [
      { label: '补充', type: 'primary', onClick: () => handleOpen('Supply', true) },
      { label: '分拨', type: 'primary', onClick: () => handleOpen('Allocation', true) },
      { label: '派单', type: 'primary', onClick: () => handleOpen('Dispatch', true) },
      { label: '转派', type: 'primary', onClick: () => handleOpen('Transfer', true) },
      { label: '处理', type: 'primary', onClick: () => handleOpen('Handle', true) },
      { label: '完成处理', type: 'primary', onClick: () => handleOpen('FinishDeal', true) },
      { label: '退回工单', type: 'primary', onClick: () => handleOpen('Back', true) },
      { label: '关闭工单', type: 'primary', onClick: () => handleOpen('Close', true) },
      { label: '完成', type: 'primary', onClick: () => handleOpen('Finish', true) },
      { label: '打回工单', type: 'primary', onClick: () => handleRepuse() },
      { label: '导出', type: 'primary' },
      { label: '导入', type: 'primary' }
    ]
  },
  table: {
    columns: [
      { type: 'selection' },
      { slot: 'codeSlot', label: '工单编号' },
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
          { label: '补充', type: 'primary', text: true, onClick: () => handleOpen('Supply') },
          { label: '分拨', type: 'primary', text: true, onClick: () => handleOpen('Allocation') },
          { label: '派单', type: 'primary', text: true, onClick: () => handleOpen('Dispatch') },
          { label: '转派', type: 'primary', text: true, onClick: () => handleOpen('Transfer') },
          { label: '处理', type: 'primary', text: true, onClick: () => handleOpen('Handle') },
          {
            label: '完成处理',
            type: 'primary',
            text: true,
            onClick: () => handleOpen('FinishDeal')
          },
          { label: '退回工单', type: 'primary', text: true, onClick: () => handleOpen('Back') },
          { label: '关闭工单', type: 'primary', text: true, onClick: () => handleOpen('Close') },
          { label: '完成', type: 'primary', text: true, onClick: () => handleOpen('Finish') },
          { label: '打回工单', type: 'primary', text: true, onClick: () => handleRepuse() },
          { label: '评价', type: 'primary', text: true, onClick: () => handleOpen('Evaluate') },
          { label: '回访', type: 'primary', text: true, onClick: () => handleOpen('Visit') }
        ]
      }
    ],
    data: [{}]
  }
})
</script>
