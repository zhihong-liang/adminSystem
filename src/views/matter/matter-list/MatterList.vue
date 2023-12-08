<template>
  <div>
    <CnPage v-bind="props">
      <template #matterStatus="{ row }">
        <el-text :type="row.matterStatus === '1' ? 'success' : ''">
          {{ row.matterStatus === '1' ? '有效' : '无效' }}
        </el-text>
      </template>
      <template #matterCode="{ row }">
        <el-button type="text" @click="showDialogByDetail('detail', row)">{{
          row.matterCode
        }}</el-button>
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
import { reactive, ref, toRaw, onMounted, computed } from 'vue'
import CnPage from '@/components/cn-page/CnPage.vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'

import { getSearchConfig } from './config/search-config'
import getTableConfig from './config/table-config'
import getTollbarConifg from './config/tollbar-config'
import { getDialogConfig } from './config/dialog-config'
import type { ActionType, tabsActivateName } from './config/type'

import { getMatterList, addMatter, editMatter, getDictBySysCoverage } from '@/api/matter'
import useDictionary from '@/hooks/useDictionary'
import { isString } from 'lodash-es'

onMounted(async () => {
  const res = await getDictBySysCoverage()
  const data = res.data['SYS_COVERAGE']
  const list = data
    .filter((v: any) => v.subtype.length <= 4)
    .map((item: any) => {
      const value = item.subtype
      let parentId
      if (value.length === 2) {
        parentId = '0'
      } else {
        parentId = value.substring(0, 2)
      }
      return { parentId, value: item.subtype, label: item.description }
    })
  createTree([...list])
})

const sysCoverAgeList = ref<any[]>([])

const detailAndEditorModel = ref<any>({})
const openDialogHandle = ref<ActionType>('detail')

const dialogRef = ref<InstanceType<typeof CnDialog>>()
const dialogProps = reactive<CnPage.DialogProps>({})

const activeName = ref<tabsActivateName>('basicInfo')

const props = reactive<CnPage.Props>({
  transformRequest: (params) => {
    console.log(params)
    const sysCoverage = params.sysCoverage ? params.sysCoverage.join(',') : ''
    const obj = { ...params, sysCoverage }
    return { page: 1, size: 10, obj }
  },
  refresh: 0,
  init: undefined,
  params: { page: 1, size: 10 },
  action: getMatterList,
  search: getSearchConfig(computed(() => sysCoverAgeList.value)),
  toolbar: getTollbarConifg(showDialogByAddOrLabel),
  table: getTableConfig(showDialogByEdit),
  pagination: {
    page: 1,
    size: 10
  }
})

// 弹窗确定按钮的点击
function dialogSubmitSuccess() {
  props.refresh = new Date().getDate()
}

// 控制是否显示支付方式
function payTypeVisible() {
  return dialogProps.formProps?.model?.payStatus === '1'
}

// 控制是否显示认证方式
function authenticationTypeVisible() {
  return dialogProps.formProps?.model?.identityAuthType === '1'
}

function handleTabChange() {
  if (openDialogHandle.value === 'edit')
    showDialogByEdit(openDialogHandle.value, detailAndEditorModel.value, false)
  else showDialogByDetail(openDialogHandle.value, detailAndEditorModel.value, false)
}

// 查询事项列表
function getMatterListAction() {
  const model: any = props.params
  console.log(model)
  return getMatterList(model)
}

// 新增事项
function addMatterAction() {
  const model = dialogProps.formProps?.model || {}
  console.log(model)
  model.hardwareModule = model.hardwareModule.join(',')
  model.identityAuthItem = model.identityAuthItem.join(',')
  model.networdPolicy = model.networdPolicy.join(',')
  model.payWay = model.payWay.join(',')
  model.sysCoverage = model.sysCoverage.join(',')
  return addMatter(model)
}

// 修改事项
function editMatterAction() {
  const model = dialogProps.formProps?.model || {}
  const obj = {
    hardwareModule: model.hardwareModule.join(','),
    identityAuthItem: model.identityAuthItem.join(','),
    networdPolicy: model.networdPolicy.join(','),
    payWay: model.payWay.join(','),
    sysCoverage: model.sysCoverage.join(',')
  }
  return editMatter({ ...model, ...obj })
}

// 显示新建事项/所属标签窗口
function showDialogByAddOrLabel(handle: ActionType) {
  const dialogConfig = getDialogConfig(handle)({
    dialogSubmitSuccess: dialogSubmitSuccess,
    sysCoverAgeList: computed(() => sysCoverAgeList.value)
  })
  for (const key of Object.keys(dialogConfig)) {
    dialogProps[key] = dialogConfig[key]
  }
  dialogProps.action = () => addMatterAction()
  dialogRef.value?.open()
}

// 显示编辑窗口
function showDialogByEdit(handle: ActionType, row: any, firstOpen: boolean = true) {
  if (firstOpen) activeName.value = 'basicInfo'
  const model = window.structuredClone(toRaw(row))
  model.hardwareModule = stringToArray(model.hardwareModule)
  model.identityAuthItem = stringToArray(model.identityAuthItem)
  model.networdPolicy = stringToArray(model.networdPolicy)
  model.payWay = stringToArray(model.payWay)
  detailAndEditorModel.value = model
  openDialogHandle.value = handle
  console.log(model.matterStatus)
  const dialogConfig = getDialogConfig(handle)({
    dialogSubmitSuccess: dialogSubmitSuccess,
    sysCoverAgeList: computed(() => sysCoverAgeList.value),
    activeName: activeName.value,
    model: model
  })
  for (const key of Object.keys(dialogConfig)) {
    dialogProps[key] = dialogConfig[key]
  }
  dialogProps.action = () => editMatterAction()
  dialogRef.value?.open()
}

// 显示详情窗口
function showDialogByDetail(handle: ActionType, row: any, firstOpen: boolean = true) {
  if (firstOpen) activeName.value = 'basicInfo'
  const model = window.structuredClone(toRaw(row))
  const obj = {
    hardwareModule: useDictionary('HARDWARE_MODULE', stringToArray(model.hardwareModule)),
    identityAuthItem: useDictionary('IDENTITY_AUTH_ITEM', stringToArray(model.identityAuthItem)),
    networdPolicy: useDictionary('NETWORD_POLICY', stringToArray(model.networdPolicy)),
    payWay: useDictionary('PAY_WAY', stringToArray(model.payWay)),
    handleType: useDictionary('HANDLE_TYPE', stringToArray(model.handleType)),
    matterType: useDictionary('MATTER_TYPE', model.matterType),
    serviceObject: useDictionary('SERVICE_OBJECT', stringToArray(model.serviceObject)),
    sysLevel: useDictionary('SYS_LEVEL', stringToArray(model.sysLevel)),
    matterStatus: model.matterStatus === '1' ? '有效' : '无效'
  }
  detailAndEditorModel.value = model
  openDialogHandle.value = handle
  const dialogConfig = getDialogConfig(handle)({
    dialogSubmitSuccess: dialogSubmitSuccess,
    sysCoverAgeList: computed(() => sysCoverAgeList.value),
    activeName: activeName.value,
    model: {
      ...model,
      ...obj
    }
  })
  for (const key of Object.keys(dialogConfig)) {
    dialogProps[key] = dialogConfig[key]
  }
  dialogProps.action = () => editMatterAction()
  dialogRef.value?.open()
}

function stringToArray(value: any) {
  return isString(value) ? value.split(',') : value
}

function createTree(list: any) {
  const len = list.length
  for (let i = 0; i < len; i++) {
    let arrTemp = []
    for (let j = 0; j < list.length; j++) {
      if (list[i].value == list[j].parentId) {
        list[i].childen = arrTemp
        arrTemp.push(list[j])
      }
    }
  }
  const result = []
  for (let i = 0; i < list.length; i++) {
    if (list[i].parentId == 0) {
      result.push(list[i])
    }
  }
  sysCoverAgeList.value = result
}
</script>

<style scoped lang="scss"></style>
