<template>
  <CnDialog title="选择设备" width="70%" ref="dialogRef">
    <CnPage v-bind="props"></CnPage>

    <template #footer>
      <el-button @click="() => dialogRef.close()">取消</el-button>
      <el-button type="primary" @click="handleSuccess">选择</el-button>
    </template>
  </CnDialog>
</template>

<script setup lang="ts">
import { reactive, ref, onBeforeMount } from 'vue'
import { queryDevAuthListPageDev } from '@/api/device'
import { getUnitList } from '@/api/admin'

import CnPage from '@/components/cn-page/CnPage.vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'

const emits = defineEmits(['selectValue'])

const dialogRef = ref()
const selectedDev = ref({})
const unitList: any = ref([])

const props: CnPage.Props = reactive({
  params: {},
  action: queryDevAuthListPageDev,
  internal: true,
  search: {
    items: [
      { label: '设备编号', prop: 'proDevCode', component: 'input' },
      {
        label: '设备接入单位',
        prop: 'devUnit',
        component: 'select',
        props: {
          options: unitList
        }
      },
      { label: '部署场所', prop: 'siteName', component: 'input' },
      {
        label: '行政区划',
        prop: 'regionDetail',
        component: 'ad',
        props: {
          props: { checkStrictly: true }
        }
      }
    ]
  },
  table: {
    rowKey: 'id',
    columns: [
      { prop: 'devCode', label: '设备编号' },
      { prop: 'devUnitText', label: '设备接入单位' },
      { prop: 'siteName', label: '部署场所' },
      { prop: 'regionDetail', label: '行政区划' },
      { prop: 'detailAddress', label: '详细地址' }
    ],
    maxHeight: '500px',
    highlightCurrentRow: true,
    onCurrentChange: (val: any) => (selectedDev.value = val)
  },
  pagination: true,
  refresh: new Date().getTime()
})

function handleSuccess() {
  emits('selectValue', selectedDev.value)
  close()
}

function open() {
  dialogRef.value.open()
}

function close() {
  dialogRef.value.close()
}

defineExpose({ open })

onBeforeMount(() => {
  getUnitList({ obj: {}, page: 1, size: 10000 }).then((res) => {
    unitList.value = res.rows.map((item) => ({
      value: item.id,
      label: item.fullName
    }))
  })
})
</script>

<style scoped></style>
