<template>
  <CnPage v-bind="props">
    <template #action="{ row }: any">
      <el-button plain type="primary" text @click="() => handleEdit(row)">编辑</el-button>
      <el-button v-if="row.status === '1'" plain type="danger" text @click="() => handleUnbundle(row)">解绑</el-button>
    </template>
  </CnPage>
  <CnDialog v-bind="dialogProps" ref="dialogRef" @success="handleSuccess" @close="handleClose">
    <template #devInfo>
      <el-button plain type="primary" @click="() => devDialogRef.open()">选择设备</el-button>

      <el-table v-show="!!selectedDev.length" class="mt-lg" :data="selectedDev" border>
        <el-table-column prop="devCode" label="设备编号" width="100" />
        <el-table-column prop="devUnitText" label="设备接入单位" width="200" />
        <el-table-column prop="siteName" label="部署场所" width="150" />
        <el-table-column prop="regionDetail" label="行政区划" width="200" />
        <el-table-column prop="detailAddress" label="详细地址" />
      </el-table>
    </template>
  </CnDialog>
  <DevDialog ref="devDialogRef" @select-value="handleSelectValue" />
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import useConfirm from '@/hooks/useConfirm'
import {
  queryDevAuthList,
  queryDevAuthExport,
  queryDevAuthBind,
  queryDevAuth,
  type DevAuthObj
} from '@/api/device'
import { useUserStore } from '@/stores'
import { storeToRefs } from 'pinia'
import moment from 'moment'

import CnPage from '@/components/cn-page/CnPage.vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'
import DevDialog from './devDialog.vue'

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const DEFAULT_ITEMS: any = [
  { label: '设备信息', prop: 'devInfo', component: 'slot' },
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
]

const devDialogRef = ref()
const model = ref('') // add: 新增；edit: 编辑

const dialogRef = ref()
const selectedDev = ref<DevAuthObj[]>([])
const dialogProps: CnPage.DialogProps = reactive({
  title: '新建',
  formProps: {
    model: {},
    items: DEFAULT_ITEMS,
    colSpan: 24,
    rules: {
      // devCode: [{ required: true, message: '请输入标题' }]
    },
    labelWidth: '100',
    labelPosition: 'right'
  },
  action: DialogAction
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
        onClick: () => {
          dialogProps.title = '新增'
          model.value = 'add'
          dialogRef.value.open()
        }
      }
      // {
      //   label: '导出',
      //   onClick: handleExport
      // }
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
        slot: 'action',
        minWidth: 120
      }
    ]
  },
  pagination: true,
  refresh: new Date().getTime()
})

function DialogAction() {
  const params: any = {
    ...dialogProps!.formProps!.model,
    createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    createUser: userInfo.value.userName || '--'
  }

  if (model.value === 'add') params['status'] = '0'

  if (model.value === 'edit') {
    params['updateTime'] = moment().format('YYYY-MM-DD HH:mm:ss')
    params['updateUser'] = userInfo.value.userName || '--'
  }

  console.log('params: ', params)

  return queryDevAuth(params, model.value === 'add' ? 'post' : 'put')
  // return Promise.resolve()
}

// 解绑
function handleUnbundle(row: any) {
  const opts = {
    message: `确定要解绑${row.devCode}?`,
    title: '解绑',
    action: () =>
      queryDevAuthBind({
        ids: row.id || '',
        isBind: row.status === '0' ? true : false
      }),
    success: () => {
      props.refresh = new Date().getTime()
    }
  }
  useConfirm(opts)
}

// 产品说导出暂时不上线
function handleExport() {
  const params = {
    ...props.params
  }

  queryDevAuthExport(params).then((res: any) => {
    let blob = new Blob([res.data], {
      type: res.headers['content-type'] || 'application/vnd.ms-excel'
    })
    let href = window.URL.createObjectURL(blob)
    let downloadElement = document.createElement('a')
    downloadElement.href = href
    downloadElement.download = '设备认证列表.xlsx'
    document.body.appendChild(downloadElement)
    downloadElement.click() //点击下载
    document.body.removeChild(downloadElement) //下载完成移除元素
  })
}

function handleEdit(row: any) {
  dialogProps.title = '编辑'
  model.value = 'edit'
  dialogProps.formProps!.model = row
  selectedDev.value = [
    {
      devCode: row.devCode,
      devUnitText: row.devUnitText,
      siteName: row.siteName,
      regionDetail: row.regionDetail,
      detailAddress: row.detailAddress
    }
  ]
  dialogRef.value.open()
}

function handleSelectValue(val: DevAuthObj) {
  if (val && Object.keys(val).length) {
    dialogProps!.formProps!.model.devCode = val.devCode
    selectedDev.value = [val]
  }
}

function handleSuccess() {
  dialogProps!.formProps!.model = {}
  props.refresh = new Date().getTime()
}

function handleClose() {
  dialogProps!.formProps!.model = {}
  selectedDev.value = []
}
</script>

<style scoped></style>
