<template>
  <div>
    <CnPage v-bind="props" ref="pageRef">
      <!-- 操作 -->
      <template #action="{ row }">
        <div class="action-con">
          <el-link :underline="false" type="primary" @click="showDialogByEdit('edit', row)"
            >编辑</el-link
          >
          <el-link
            v-if="row.matterStatus !== '1'"
            :underline="false"
            type="primary"
            @click="editMatterStatusAction('online', row)"
            >上线</el-link
          >
          <el-link
            v-if="row.matterStatus !== '0'"
            :underline="false"
            type="primary"
            @click="editMatterStatusAction('deactivate', row)"
            >停用</el-link
          >
          <el-link
            v-if="row.matterStatus !== '2'"
            :underline="false"
            type="primary"
            @click="editMatterStatusAction('Offline', row)"
            >下线</el-link
          >
        </div>
      </template>
      <template #matterStatus="{ row }">
        <el-text v-if="row.matterStatus === '1'" type="success"> 上线 </el-text>
        <el-text v-else-if="row.matterStatus === '2'"> 下线 </el-text>
        <el-text v-else="row.matterStatus === '2'"> 停用 </el-text>
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
      <template #footer v-if="openDialogHandle === 'detail'">
        <div></div>
      </template>
    </CnDialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, toRaw, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'

import CnPage from '@/components/cn-page/CnPage.vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'

import { getSearchConfig } from './config/search-config'
import getTableConfig from './config/table-config'
import getTollbarConifg from './config/tollbar-config'
import { getDialogConfig } from './config/dialog-config'
import type { ActionType, tabsActivateName } from './config/type'

import {
  getDeptList,
  getMatterList,
  addMatter,
  editMatter,
  exportMatterList,
  getMatterLabelList,
  infoLabel,
  pushDownDept
} from '@/api/matter'
import { getDictionary } from '@/api'
import useDictionary from '@/hooks/useDictionary'
import { handlesysCoverageOptionsTree, stringToArray } from '../utils/index'

// 系统覆盖范围options
const sysCoverageOptions = ref<any[]>()
// 身份认证方式options
const identityAuthItemOptions = ref<any[]>()
// 支付方式options
const payWayOptions = ref<any[]>()
// 业务部门options
const businessUnitOptions = ref<any[]>()

const detailAndEditorModel = ref<any>({})
const openDialogHandle = ref<ActionType>('detail')

const tableSelection = ref<any[]>()
const dialogRef = ref<InstanceType<typeof CnDialog>>()
const dialogProps = reactive<CnPage.DialogProps>({})

const activeName = ref<tabsActivateName>('basicInfo')

onMounted(async () => {
  const res = await getDictionary(['SYS_COVERAGE', 'IDENTITY_AUTH_ITEM', 'PAY_WAY'])
  const { data } = res
  sysCoverageOptions.value = handlesysCoverageOptionsTree(data['SYS_COVERAGE'])
  identityAuthItemOptions.value = data['IDENTITY_AUTH_ITEM'].map((i) => ({
    value: i.subtype,
    label: i.description
  }))
  payWayOptions.value = data['PAY_WAY'].map((i) => ({ value: i.subtype, label: i.description }))
  const { rows } = await getDeptList({ page: 1, size: 1000, obj: {} })
  businessUnitOptions.value = rows.map((i) => ({
    value: i.id,
    label: i.businessDeptName
  }))
})

const props = reactive<CnPage.Props>({
  transformRequest: (params) => {
    const sysCoverage = params.sysCoverage ? params.sysCoverage.join(',') : ''
    const obj = { ...params, sysCoverage }
    return { page: 1, size: 10, obj }
  },
  refresh: 0,
  init: undefined,
  params: { page: 1, size: 10 },
  action: getMatterList,
  search: getSearchConfig(
    computed(() => sysCoverageOptions.value),
    computed(() => businessUnitOptions.value)
  ),
  toolbar: getTollbarConifg(showDialogByAddOrLabel),
  table: getTableConfig(selectionChange),
  pagination: {
    page: 1,
    size: 10
  }
})

// 弹窗确定按钮的点击
function dialogSubmitSuccess() {
  props.refresh = new Date().getTime()
}

function selectionChange(selection: any) {
  tableSelection.value = selection
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

// 新增事项
function addMatterAction() {
  const model = dialogProps.formProps?.model || {}
  model.hardwareModule = model.hardwareModule.join(',')
  model.identityAuthItem = model.identityAuthType === '1' ? model.identityAuthItem.join(',') : ''
  model.networdPolicy = model.networdPolicy.join(',')
  model.payWay = model.payStatus === '1' ? model.payWay.join(',') : ''
  model.sysCoverage = model.sysCoverage.join(',')
  return addMatter(model)
}

// 编辑事项
function editMatterAction() {
  const model = dialogProps.formProps?.model || {}
  const obj = {
    hardwareModule: model.hardwareModule.join(','),
    identityAuthItem: model.identityAuthItem.join(','),
    identityAuthType: model.identityAuthItem.length ? '1' : '0',
    networdPolicy: model.networdPolicy.join(','),
    payWay: model.payWay.join(','),
    payStatus: model.payWay.length ? '1' : '0',
    sysCoverage: model.sysCoverage.join(',')
  }

  return editMatter({ ...model, ...obj })
}

// 上线/下线/停用事项
async function editMatterStatusAction(handle: ActionType, row: any) {
  let matterStatus
  if (handle === 'online') matterStatus = '1'
  if (handle === 'Offline') matterStatus = '2'
  if (handle === 'deactivate') matterStatus = '0'
  const model = window.structuredClone(toRaw(row))
  model.sysCoverage = model.sysCoverageCode
  model.sysCoverageCode = ''
  const result = await pushDownDept({ ...model, matterStatus })
  props.refresh = new Date().getTime()
  ElMessage.success(result.message || '操作成功')
}

// 导出事项列表
async function exportMatterListAction() {
  if (tableSelection.value && tableSelection.value.length) {
    const mattersIds: any[] = []
    const filedList = [
      'matterCode',
      'matterAlias',
      'matterName',
      'businessUnit',
      'sysCoverage',
      'handleType',
      'matterStatus'
    ]
    const filedNameList = [
      '粤智助事项编码',
      '事项别名',
      '事项名称',
      '业务部门',
      '系统覆盖范围',
      '办理类型',
      '事项状态'
    ]
    tableSelection.value.forEach((item) => {
      mattersIds.push(item.id)
    })
    const result: any = await exportMatterList({ mattersIds: mattersIds, filedList, filedNameList })
    let blob = new Blob([result], {
      type: `application/vnd.ms-excel`
    })
    let href = window.URL.createObjectURL(blob)
    let downloadElement = document.createElement('a')
    downloadElement.href = href
    downloadElement.download = '事项列表.xlsx'
    document.body.appendChild(downloadElement)
    downloadElement.click() //点击下载
    document.body.removeChild(downloadElement) //下载完成移除元素
  }
}

// 所属标签
function infoLabelAction() {
  const model = dialogProps.formProps?.model || {}
  const mattersIds = tableSelection.value!.map((item) => item.id)
  const { label } = model
  return infoLabel({
    labelId: label,
    mattersIds
  })
}

// 显示新建事项/所属标签窗口/导出事项列表
async function showDialogByAddOrLabel(handle: ActionType) {
  openDialogHandle.value = handle
  if (handle === 'export') {
    exportMatterListAction()
    return
  } else if (handle === 'label') {
    if (!tableSelection.value || !tableSelection.value.length) return
    const result = await getMatterLabelList({ page: 1, size: 1000, obj: {} })
    const options = result.rows.map((item: any) => ({ label: item.lableName, value: item.id }))
    const matterNameList = tableSelection.value.map((item) => item.matterName)
    const dialogConfig = getDialogConfig(handle)({
      dialogSubmitSuccess: dialogSubmitSuccess,
      model: {
        matterName: matterNameList.join('、')
      },
      optionsMap: {
        label: options
      }
    })
    for (const key of Object.keys(dialogConfig)) {
      dialogProps[key] = dialogConfig[key]
    }
    dialogProps.action = () => infoLabelAction()
  } else {
    const dialogConfig = getDialogConfig(handle)({
      dialogSubmitSuccess: dialogSubmitSuccess,
      optionsMap: {
        sysCoverage: computed(() => sysCoverageOptions.value),
        identityAuthItem: computed(() => identityAuthItemOptions.value),
        payWay: computed(() => payWayOptions.value),
        businessUnit: computed(() => businessUnitOptions.value)
      },
      visible: { payWay: payTypeVisible, identityAuthItem: authenticationTypeVisible }
    })
    for (const key of Object.keys(dialogConfig)) {
      dialogProps[key] = dialogConfig[key]
    }
    dialogProps.action = () => addMatterAction()
  }
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
  model.sysCoverage = model.sysCoverageCode.split(',')
  detailAndEditorModel.value = model
  openDialogHandle.value = handle
  const dialogConfig = getDialogConfig(handle)({
    dialogSubmitSuccess: dialogSubmitSuccess,
    optionsMap: {
      sysCoverage: computed(() => sysCoverageOptions.value),
      identityAuthItem: computed(() => identityAuthItemOptions.value),
      payWay: computed(() => payWayOptions.value),
      businessUnit: computed(() => businessUnitOptions.value)
    },
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
    hardwareModule: useDictionary('HARDWARE_MODULE', stringToArray(model.hardwareModule)).value,
    identityAuthItem: useDictionary('IDENTITY_AUTH_ITEM', stringToArray(model.identityAuthItem))
      .value,
    networdPolicy: useDictionary('NETWORD_POLICY', stringToArray(model.networdPolicy)).value,
    payWay: useDictionary('PAY_WAY', stringToArray(model.payWay)).value,
    handleType: useDictionary('HANDLE_TYPE', stringToArray(model.handleType)).value,
    serviceObject: useDictionary('SERVICE_OBJECT', stringToArray(model.serviceObject)).value,
    sysLevel: useDictionary('SYS_LEVEL', stringToArray(model.sysLevel)).value,
    matterStatus: useDictionary('MATTER_STATUS', stringToArray(model.matterStatus)).value
  }
  detailAndEditorModel.value = model
  openDialogHandle.value = handle
  const dialogConfig = getDialogConfig(handle)({
    optionsMap: {
      sysCoverage: computed(() => sysCoverageOptions.value)
    },
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
</script>

<style scoped lang="scss">
.action-con {
  display: flex;
  justify-content: space-between;
}
</style>
