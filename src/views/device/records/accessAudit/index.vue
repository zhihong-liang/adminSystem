<template>
  <CnPage v-bind="props">
    <template #action="{ row }">
      <el-button plain text @click="handleAction(row, 'check')">查看</el-button>
      <el-button
        v-if="row.auditCurrentStep === '100'"
        plain
        type="primary"
        text
        @click="handleAction(row, 'agree')"
        >同意</el-button
      >
      <el-button
        v-if="row.auditCurrentStep === '100'"
        plain
        type="primary"
        text
        @click="handleAction(row, 'reject')"
        >拒绝</el-button
      >
    </template>
  </CnPage>
  <ActionDialog ref="ActionDialogRef" @on-success="() => (props.refresh = new Date().getTime())" />
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { queryDevAuditHistoryList } from '@/api/device'
import { useRouter } from 'vue-router'

import CnPage from '@/components/cn-page/CnPage.vue'
import ActionDialog from './actionDialog.vue'

const router = useRouter()

const ActionDialogRef = ref()

const props: CnPage.Props = reactive({
  params: {},
  action: queryDevAuditHistoryList,
  search: {
    items: [
      { label: '申请编号', prop: 'applyNo', component: 'input' },
      { label: '设备接入单位', prop: 'devAccessUnit', component: 'select' },
      { label: '状态', prop: 'auditCurrentStep', component: 'select', dict: 'DEV_ACCESS_NODE' }
    ]
  },
  table: {
    rowKey: 'id',
    columns: [
      { prop: 'id', label: '申请编号', minWidth: 120 },
      { prop: 'devAccessUnitText', label: '设备接入单位' },
      { prop: 'batchNo', label: '批次号' },
      { prop: 'devNum', label: '设备数' },
      { prop: 'applyPerson', label: '申请人' },
      { prop: 'applyTime', label: '申请时间' },
      { prop: 'auditCurrentStep', label: '状态', dict: 'DEV_ACCESS_NODE' },
      { prop: 'auditEndTime', label: '审核时间' },
      {
        prop: 'action',
        label: '操作',
        slot: 'action',
        minWidth: 120
      }
    ]
  },
  pagination: true,
  refresh: new Date().getTime()
})

function handleAction(row: any, actionName: 'check' | 'agree' | 'reject') {
  switch (actionName) {
    case 'check':
      router.push({ path: '/device/accessAudit/detail', query: { id: row.id } })
      break
    case 'agree':
      ActionDialogRef.value.open({ action: actionName, row })
      break
    case 'reject':
      ActionDialogRef.value.open({ action: actionName, row })
      break
    default:
      break
  }
}
</script>

<style scoped></style>
