<template>
  <CnPage v-bind="props"></CnPage>
  <CnDialog v-bind="dialogProps" ref="dialogRef">
    <template #devCode>
      <el-button plain type="primary">选择</el-button>
    </template>
  </CnDialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import useConfirm from '@/hooks/useConfirm'
import { queryDevAuthList, queryDevAuthExport, queryDevAuthBind } from '@/api/device'

import CnPage from '@/components/cn-page/CnPage.vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'

const dialogRef = ref()
const dialogProps: CnPage.DialogProps = reactive({
  title: '新建',
  formProps: {
    model: {},
    items: [
      { label: '设备编号', prop: 'devCode', component: 'slot' },
      {
        label: '硬件识别码',
        prop: 'hardIdentificationCode',
        component: 'input',
        props: {
          maxlength: 50,
          showWordLimit: true
        }
      },
      {
        label: '公钥',
        prop: 'publicKey',
        component: 'input',
        props: {
          maxlength: 50,
          showWordLimit: true
        }
      },
      {
        label: '私钥',
        prop: 'privateKey',
        component: 'input',
        props: {
          maxlength: 50,
          showWordLimit: true
        }
      }
    ],
    colSpan: 24,
    rules: {
      // devCode: [{ required: true, message: '请输入标题' }]
    },
    labelWidth: '100',
    labelPosition: 'right'
  }
})

const props: CnPage.Props = reactive({
  params: {},
  action: queryDevAuthList,
  search: {
    items: [
      { label: '设备编号', prop: 'devCode', component: 'input' },
      { label: '硬件识别码', prop: 'hardIdentificationCode', component: 'input' },
      { label: '公钥', prop: 'publicKey', component: 'input' },
      { label: '私钥', prop: 'privateKey', component: 'input' },
      { label: '状态', prop: 'status', component: 'select', dict: 'DEV_AUTH_STATUS' }
    ]
  },
  toolbar: {
    items: [
      {
        label: '新增',
        type: 'primary',
        onClick: () => dialogRef.value.open()
      },
      {
        label: '导出',
        onClick: () => {}
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
      { prop: 'detailAddress', label: '详细地址' },
      { prop: 'hardIdentificationCode', label: '硬件识别码' },
      { prop: 'publicKey', label: '公钥' },
      { prop: 'privateKey', label: '私钥' },
      { prop: 'status', label: '状态', dict: 'DEV_AUTH_STATUS' },
      {
        prop: 'action',
        label: '操作',
        minWidth: 120,
        buttons: [
          {
            label: '编辑',
            type: 'primary',
            text: true,
            onClick: ({ row }) => {
              dialogProps.formProps!.model = row
              dialogRef.value.open()
            }
          },
          { label: '解绑', type: 'danger', text: true, onClick: handleUnbundle }
        ]
      }
    ]
  },
  pagination: true,
  refresh: new Date().getTime()
})

function handleUnbundle({ row }: any) {
  const opts = {
    message: `确定要解绑${row.devCode}?`,
    title: '解绑',
    action: () => queryDevAuthBind({
      ids: row.id || '',
      isBind: row.status === '0' ? true : false
    }),
    success: () => {
      props.refresh = new Date().getTime()
    }
  }
  useConfirm(opts)
}
</script>

<style scoped></style>
