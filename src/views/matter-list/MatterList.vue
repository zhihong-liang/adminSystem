<template>
  <div class="matter-list">
    <CnPage v-bind="props">
      <template #status="{ row }">
        <span>{{ row.id }}</span>
      </template>
      <template #itemId="{ row }">
        <el-button type="text" @click="handleTableActionClick(row, 'detail')">{{
          row.id
        }}</el-button>
      </template>
    </CnPage>
    <CnDialog ref="dialogRef" v-bind="dialogProps">
      <template #tabs>
        <el-radio-group v-model="activeName" @change="setTableActionDialogConfig">
          <el-radio-button label="basicInfo">基本信息</el-radio-button>
          <el-radio-button label="configInfo">配置信息</el-radio-button>
        </el-radio-group>
      </template>
    </CnDialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import CnPage from '@/components/cn-page/CnPage.vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'

import searchConfig from './config/search-config'
import getTableConfig from './config/table-config'
import getTollbarConifg from './config/tollbar-config'
import { getTollBarActionDialogConfig, getTableActionConfig } from './config/dialog-config'

import type { tollbarActionType, tableActionType, tabsActivateName } from './config/type'

import { getUsers } from '@/api'

// const init: Promise<void> = new Promise((resolve) =>
//   setTimeout(() => {
//     resolve()
//   }, 1000)
// )

const dialogRef = ref<InstanceType<typeof CnDialog>>()
const dialogProps = reactive<CnPage.DialogProps>({})

const activeName = ref<tabsActivateName>('basicInfo')
const tableHandle = ref<tableActionType>()

const props = reactive<CnPage.Props>({
  init: undefined,
  params: {
    page: 1,
    size: 10
  },
  // action: () => Promise.reject('暂无数据'),
  action: getUsers,
  search: searchConfig,
  toolbar: getTollbarConifg(tollbarClick),
  table: getTableConfig(handleTableActionClick),
  pagination: {
    page: 1,
    size: 10
  }
})

// 弹窗确定按钮的点击
function submit() {
  console.log(dialogProps.formProps?.model)
}

// table操作按钮的点击
function handleTableActionClick(params: any, handle: tableActionType) {
  console.log(params.row)
  tableHandle.value = handle
  activeName.value = 'basicInfo'
  setTableActionDialogConfig()
}

// 控制是否显示支付方式
function payTypeVisible() {
  return dialogProps.formProps?.model?.isPay === '1'
}

// 控制是否显示认证方式
function authenticationTypeVisible() {
  return dialogProps.formProps?.model?.isAuthenticationType === '1'
}

// 设置tollbar点击弹窗的配置
function tollbarClick(handle: tollbarActionType) {
  const dialogConfig = getTollBarActionDialogConfig(
    handle,
    submit,
    payTypeVisible,
    authenticationTypeVisible
  )
  for (const key of Object.keys(dialogConfig)) {
    dialogProps[key] = dialogConfig[key]
  }
  dialogRef.value?.open()
}

// 设置table点击弹窗的配置
function setTableActionDialogConfig() {
  const dialogConfig = getTableActionConfig(
    tableHandle.value!,
    activeName.value,
    payTypeVisible,
    authenticationTypeVisible
  )
  for (const key of Object.keys(dialogConfig)) {
    dialogProps[key] = dialogConfig[key]
  }
  dialogRef.value?.open()
}
</script>

<style scoped lang="scss">
.matter-list {
  margin: 30px;
  padding: 20px;
  border: 1px solid #ccc;
}
</style>
