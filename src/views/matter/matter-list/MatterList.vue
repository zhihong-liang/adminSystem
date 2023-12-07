<template>
  <div>
    <CnPage v-bind="props">
      <template #matterStatus="{ row }">
        <el-text :type="row.matterStatus === '1' ? 'success' : ''">
          {{ row.matterStatus === '1' ? '有效' : '无效' }}
        </el-text>
      </template>
      <template #matterCode="{ row }">
        <el-button type="text">{{ row.matterCode }}</el-button>
      </template>
    </CnPage>
    <CnDialog ref="dialogRef" v-bind="dialogProps">
      <template #tabs>
        <el-radio-group v-model="activeName" @change="handleTabChange">
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
import { getDialogConfig } from './config/dialog-config'

import type { ActionType, tabsActivateName } from './config/type'

import { getMatterList, addMatter } from '@/api/matter'

// const init: Promise<void> = new Promise((resolve) =>
//   setTimeout(() => {
//     resolve()
//   }, 1000)
// )

const dialogRef = ref<InstanceType<typeof CnDialog>>()
const dialogProps = reactive<CnPage.DialogProps>({})

const activeName = ref<tabsActivateName>('basicInfo')

const props = reactive<CnPage.Props>({
  refresh: 0,
  init: undefined,
  params: {
    page: 1,
    size: 10
  },
  action: getMatterList,
  search: searchConfig,
  toolbar: getTollbarConifg(showDialog),
  table: getTableConfig(handleTableActionClick),
  pagination: {
    page: 1,
    size: 10
  }
})

// 弹窗确定按钮的点击
function dialogSubmitSuccess() {
  props.refresh = new Date().getTime()
}

// table操作按钮的点击
function handleTableActionClick(row: any, handle: ActionType) {
  console.log(handle)
}

// 控制是否显示支付方式
function payTypeVisible() {
  return dialogProps.formProps?.model?.payStatus === '1'
}

// 控制是否显示认证方式
function authenticationTypeVisible() {
  return dialogProps.formProps?.model?.identityAuthType === '1'
}

function handleTabChange() {}

// 新增事项
function addMatterAction() {
  const model = dialogProps.formProps?.model || {}
  model.hardwareModule = model.hardwareModule.join(',')
  model.identityAuthItem = model.identityAuthItem.join(',')
  model.networdPolicy = model.networdPolicy.join(',')
  model.payWay = model.payWay.join(',')
  return addMatter(model)
}

// 设置tollbar点击弹窗的配置
function showDialog(handle: ActionType) {
  const dialogConfig = getDialogConfig(handle, dialogSubmitSuccess, {
    identityAuthItem: authenticationTypeVisible,
    payWay: payTypeVisible
  })
  for (const key of Object.keys(dialogConfig)) {
    dialogProps[key] = dialogConfig[key]
  }
  dialogProps.action = () => addMatterAction()
  dialogRef.value?.open()
}
</script>

<style scoped lang="scss"></style>
