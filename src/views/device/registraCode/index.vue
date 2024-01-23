<template>
  <CnPage v-bind="pageProps">
    <template #action="{ row }">
      <el-button plain type="primary" text @click="() => handleEdit([row])">编辑</el-button>
    </template>
  </CnPage>
  <CnDialog
    v-bind="dialogProps"
    width="30%"
    ref="dialogRef"
    @success="() => (pageProps.refresh = new Date().getTime())"
  />
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import moment from 'moment'
import { exportBlob } from '@/utils'
import { storeToRefs } from 'pinia'
import { useLoginStore } from '@/stores'
import { queryDevLicenseListPage, queryEditDevLicense, queryExportDevLicense } from '@/api/device'

import CnPage from '@/components/cn-page/CnPage.vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'

const loginStore = useLoginStore()
const { userInfo } = storeToRefs(loginStore)

const selectedList = ref([])

const pageProps: CnPage.Props = reactive({
  params: {},
  action: queryDevLicenseListPage,
  search: {
    items: [
      { label: '设备编号', prop: 'devCode', component: 'input' },
      { label: '批次号', prop: 'batchNo', component: 'input' },
      { label: '状态', prop: 'status', component: 'select', dict: 'DEV_LICENSE_STATUS' }
    ]
  },
  toolbar: {
    items: [
      {
        label: '编辑有效期',
        type: 'primary',
        disabled: computed(() => !selectedList.value.length),
        onClick: () => handleEdit(selectedList.value)
      },
      {
        label: '导出',
        onClick: handleExport
        // onClick: () => {}
      }
    ]
  },
  table: {
    rowKey: 'id',
    columns: [
      { type: 'selection', width: '40' },
      { prop: 'authorizationContent', label: '注册码', minWidth: 200 },
      { prop: 'devCode', label: '设备编号' },
      { prop: 'unitDevCode', label: '设备接入单位设备编号' },
      { prop: 'batchNo', label: '批次号' },
      { prop: 'devUnitText', label: '设备接入单位', minWidth: 120 },
      { prop: 'siteName', label: '部署场所' },
      { prop: 'regionDetail', label: '行政区划', minWidth: 200 },
      { prop: 'detailAddress', label: '详细地址' },
      { prop: 'statusText', label: '状态' },
      { prop: 'expirationDate', label: '有效期' },
      {
        prop: 'action',
        label: '操作',
        slot: 'action',
        minWidth: 120
      }
    ],
    selectionChange: (list) => {
      selectedList.value = list
    }
  },
  pagination: true,
  refresh: new Date().getTime()
})

const dialogRef = ref()
const dialogProps: CnPage.DialogProps = reactive({
  title: '编辑有效期',
  formProps: {
    model: {},
    items: [
      {
        label: '设备编号',
        prop: 'devCode'
      },
      {
        label: '有效期',
        prop: 'expirationDate',
        component: 'datepicker'
      }
    ],
    colSpan: 24,
    rules: {
      expirationDate: [{ required: true, message: '请选择有效期' }]
    },
    labelWidth: '100',
    labelPosition: 'right'
  },
  action: dialogAction
})

function dialogAction() {
  const params = {
    ...dialogProps.formProps?.model,
    updateUser: userInfo.value.username,
    updateTime: moment().format('YYYY-MM-DD HH:mm:ss')
  }

  return queryEditDevLicense(params)
}

function handleEdit(devList: Array<any>) {
  dialogProps.formProps!.model = {
    devCode: devList.map((dev) => dev.devCode).join('、'),
    ids: devList.map((dev) => dev.id)
  }
  if (devList.length === 1) {
    dialogProps!.formProps!.model = {
      ...dialogProps.formProps?.model,
      expirationDate: devList[0].expirationDate
    }
  }
  dialogRef.value.open()
}

function handleExport() {
  const params = {
    ...pageProps.params
  }

  queryExportDevLicense(params).then((res: any) => {
    exportBlob(res.data, { headers: res.headers['content-type'], fileName: '设备注册码管理.xlsx' })
  })
}
</script>

<style scoped></style>
