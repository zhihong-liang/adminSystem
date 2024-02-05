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
        <el-text v-else> 停用 </el-text>
      </template>
      <template #matterCode="{ row }">
        <el-button type="text" @click="showDialogByDetail('detail', row)">{{
          row.matterCode
        }}</el-button>
      </template>
    </CnPage>
    <CnDialog ref="dialogRef" v-bind="dialogProps">
      <!-- 控制新增全选 -->
      <template #checkAllIdentityAuthItem>
        <el-checkbox
          v-model="checkAllInfo.identityAuthItem.check"
          :indeterminate="checkAllInfo.identityAuthItem.isIndeterminate"
          @change="(val: boolean) => handleCheckAllChange(val, 'identityAuthItem')"
          >全选</el-checkbox
        >
      </template>
      <template #checkAllPayWay>
        <el-checkbox
          v-model="checkAllInfo.payWay.check"
          :indeterminate="checkAllInfo.payWay.isIndeterminate"
          @change="(val: boolean) => handleCheckAllChange(val, 'payWay')"
          >全选</el-checkbox
        >
      </template>
      <template #checkAllHardwareModule>
        <el-checkbox
          v-model="checkAllInfo.hardwareModule.check"
          :indeterminate="checkAllInfo.hardwareModule.isIndeterminate"
          @change="(val: boolean) => handleCheckAllChange(val, 'hardwareModule')"
          >全选</el-checkbox
        >
      </template>
      <template #checkAllNetwordPolicy>
        <el-checkbox
          v-model="checkAllInfo.networdPolicy.check"
          :indeterminate="checkAllInfo.networdPolicy.isIndeterminate"
          @change="(val: boolean) => handleCheckAllChange(val, 'networdPolicy')"
          >全选</el-checkbox
        >
      </template>
      <!-- 选择单位信息 -->
      <template #entryUnit>
        <el-autocomplete
          v-model="dialogProps.formProps!.model.entryUnit"
          :fetch-suggestions="querySearch"
          value-key="label"
          clearable
          placeholder="请输入事项进驻单位"
          style="width: 100%"
        />
      </template>
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
import { reactive, ref, toRaw, onMounted, computed, watch } from 'vue'
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
  removeLabel,
  pushDownDept
} from '@/api/matter'
import { getDictionary } from '@/api'
import { getUnitList, getUnitDetail } from '@/api/admin'
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
// 硬件模块options
const hardwareModuleOptions = ref<any[]>()
// 网络策略options
const networdPolicyOptions = ref<any[]>()

// 事项标签列表
const matterLabelList = ref<any[]>()

// 当前搜索出的单位列表
const unitListOptions = ref<any[]>()

const detailAndEditorModel = ref<any>({})
const openDialogHandle = ref<ActionType>('detail')

const tableSelection = ref<any[]>()
const dialogRef = ref<InstanceType<typeof CnDialog>>()
const dialogProps = reactive<CnPage.DialogProps>({})

const activeName = ref<tabsActivateName>('basicInfo')

// 控制全选
const checkAllInfo = reactive({
  identityAuthItem: {
    check: false,
    isIndeterminate: true
  },
  payWay: {
    check: false,
    isIndeterminate: true
  },
  hardwareModule: {
    check: false,
    isIndeterminate: true
  },
  networdPolicy: {
    check: false,
    isIndeterminate: true
  }
})

function handleCheckAllChange(val: boolean, field: string) {
  if (field === 'identityAuthItem') {
    checkAllInfo['identityAuthItem'].isIndeterminate = false
    dialogProps.formProps!.model.identityAuthItem = val
      ? identityAuthItemOptions.value?.map((i) => i.value)
      : []
  } else if (field === 'payWay') {
    checkAllInfo['payWay'].isIndeterminate = false
    dialogProps.formProps!.model.payWay = val ? payWayOptions.value?.map((i) => i.value) : []
  } else if (field === 'hardwareModule') {
    checkAllInfo['hardwareModule'].isIndeterminate = false
    dialogProps.formProps!.model.hardwareModule = val
      ? hardwareModuleOptions.value?.map((i) => i.value)
      : []
  } else {
    checkAllInfo['networdPolicy'].isIndeterminate = false
    dialogProps.formProps!.model.networdPolicy = val
      ? networdPolicyOptions.value?.map((i) => i.value)
      : []
  }
}

watch(
  () => dialogProps.formProps?.model.identityAuthItem,
  (newVal) => {
    const checkedCount = newVal?.length
    checkAllInfo['identityAuthItem'].check = checkedCount === identityAuthItemOptions.value?.length
    checkAllInfo['identityAuthItem'].isIndeterminate =
      checkedCount > 0 && identityAuthItemOptions.value
        ? checkedCount < identityAuthItemOptions.value?.length
        : false
  }
)

watch(
  () => dialogProps.formProps?.model.payWay,
  (newVal) => {
    const checkedCount = newVal?.length
    checkAllInfo['payWay'].check = checkedCount === payWayOptions.value?.length
    checkAllInfo['payWay'].isIndeterminate =
      checkedCount > 0 && payWayOptions.value ? checkedCount < payWayOptions.value?.length : false
  }
)

watch(
  () => dialogProps.formProps?.model.hardwareModule,
  (newVal) => {
    const checkedCount = newVal?.length
    checkAllInfo['hardwareModule'].check = checkedCount === hardwareModuleOptions.value?.length
    checkAllInfo['hardwareModule'].isIndeterminate =
      checkedCount > 0 && hardwareModuleOptions.value
        ? checkedCount < hardwareModuleOptions.value?.length
        : false
  }
)

watch(
  () => dialogProps.formProps?.model.networdPolicy,
  (newVal) => {
    const checkedCount = newVal?.length
    checkAllInfo['networdPolicy'].check = checkedCount === networdPolicyOptions.value?.length
    checkAllInfo['networdPolicy'].isIndeterminate =
      checkedCount > 0 && networdPolicyOptions.value
        ? checkedCount < networdPolicyOptions.value?.length
        : false
  }
)

onMounted(async () => {
  const res = await getDictionary([
    'SYS_COVERAGE',
    'IDENTITY_AUTH_ITEM',
    'PAY_WAY',
    'HARDWARE_MODULE',
    'NETWORD_POLICY'
  ])
  const { data } = res
  sysCoverageOptions.value = handlesysCoverageOptionsTree(data['SYS_COVERAGE'])
  identityAuthItemOptions.value = data['IDENTITY_AUTH_ITEM'].map((i) => ({
    value: i.subtype,
    label: i.description
  }))
  payWayOptions.value = data['PAY_WAY'].map((i) => ({ value: i.subtype, label: i.description }))
  hardwareModuleOptions.value = data['HARDWARE_MODULE'].map((i) => ({
    value: i.subtype,
    label: i.description
  }))
  networdPolicyOptions.value = data['NETWORD_POLICY'].map((i) => ({
    value: i.subtype,
    label: i.description
  }))
  const { rows } = await getDeptList({ page: 1, size: 1000, obj: {} })
  businessUnitOptions.value = rows.map((i) => ({
    value: i.id,
    label: i.businessDeptName
  }))
  const matterLabelListRes = await getMatterLabelList({ page: 1, size: 1000, obj: {} })
  matterLabelList.value = matterLabelListRes.rows.map((item: any) => ({
    label: item.lableName,
    value: item.id
  }))
})

const props = reactive<CnPage.Props>({
  transformRequest: (params: any, page: number, size: number) => {
    const sysCoverage = params.sysCoverage ? params.sysCoverage.join(',') : ''
    const obj = { ...params, sysCoverage }
    return { page, size, obj }
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

// 单位校验
function entryUnitValidator(rule: any, value: any, callback: any) {
  if (!unitListOptions.value!.find((v) => v.label === value)) {
    callback(new Error('请填写正确的单位'))
  } else {
    callback()
  }
}

function hardwareModuleValidator(rule: any, value: any, callback: any) {
  if (!dialogProps.formProps?.model.hardwareModule.length) {
    callback(new Error(''))
  } else {
    callback()
  }
}

function networdPolicyValidator(rule: any, value: any, callback: any) {
  if (!dialogProps.formProps?.model.networdPolicy.length) {
    callback(new Error(''))
  } else {
    callback()
  }
}

function handleTabChange() {
  if (openDialogHandle.value === 'edit')
    showDialogByEdit(openDialogHandle.value, detailAndEditorModel.value, false)
  else showDialogByDetail(openDialogHandle.value, detailAndEditorModel.value, false)
}

// 弹窗关闭
function handleDialogClose() {
  unitListOptions.value = []
}

// 搜索单位列表
async function querySearch(queryString: string, cb: any) {
  if (!queryString) return []
  try {
    const unitList = await getUnitList({
      page: 1,
      size: 1000,
      obj: { fullName: queryString }
    })
    const results = unitList.rows.map((i: any) => ({ value: i.id, label: i.fullName }))
    unitListOptions.value = results
    return results
  } catch (err) {
    return []
  }
}

// 新增事项
function addMatterAction() {
  const model = dialogProps.formProps?.model || {}
  model.hardwareModule = model.hardwareModule.join(',')
  model.identityAuthItem = model.identityAuthType === '1' ? model.identityAuthItem.join(',') : ''
  model.networdPolicy = model.networdPolicy.join(',')
  model.payWay = model.payStatus === '1' ? model.payWay.join(',') : ''
  model.sysCoverage = model.sysCoverage.join(',')
  model.entryUnit = unitListOptions.value!.find((v) => v.label === model.entryUnit).value
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
    sysCoverage: model.sysCoverage.join(','),
    entryUnit: '',
    lableName: matterLabelList.value?.find((v) => v.value === model.lableId).label
  }
  obj.entryUnit = unitListOptions.value!.find((v) => v.label === model.entryUnit).value
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
    '事项编码',
    '事项别名',
    '事项名称',
    '业务部门',
    '系统覆盖范围',
    '办理类型',
    '事项状态'
  ]
  tableSelection.value?.forEach((item) => {
    mattersIds.push(item.id)
  })
  const res: any = await exportMatterList({ mattersIds: mattersIds, filedList, filedNameList })
  let blob = new Blob([res.data], {
    type: res.headers['content-type'] || 'application/vnd.ms-excel'
  })
  const fileName = decodeURI(res.headers['content-disposition'].split(';filename=')[1])
  let href = window.URL.createObjectURL(blob)
  let downloadElement = document.createElement('a')
  downloadElement.href = href
  downloadElement.download = fileName || '事项列表.xlsx'
  document.body.appendChild(downloadElement)
  downloadElement.click() //点击下载
  document.body.removeChild(downloadElement) //下载完成移除元素
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

// 删除标签
async function delLabelAction() {
  const mattersIds = tableSelection.value!.map((item) => item.id)
  try {
    const result = await removeLabel({
      labelId: null,
      mattersIds
    })
    props.refresh = new Date().getTime()
    ElMessage.success(result.message || '操作成功')
  } catch (err: any) {
    ElMessage.error(err)
  }
}

// 显示新建事项/所属标签窗口/导出事项列表
async function showDialogByAddOrLabel(handle: ActionType) {
  openDialogHandle.value = handle
  if (handle === 'export') {
    exportMatterListAction()
    return
  } else if (handle === 'label' || handle === 'delLabel') {
    if (!tableSelection.value || !tableSelection.value.length)
      return ElMessage.warning('请先勾选事项')

    const matterNameList = tableSelection.value.map((item) => item.matterName)
    const dialogConfig = getDialogConfig(handle)({
      dialogSubmitSuccess: dialogSubmitSuccess,
      model: {
        matterName: matterNameList.join('、')
      },
      optionsMap: {
        label: computed(() => matterLabelList.value)
      }
    })
    for (const key of Object.keys(dialogConfig)) {
      dialogProps[key] = dialogConfig[key]
    }
    if (handle === 'label') {
      dialogProps.action = () => infoLabelAction()
    } else {
      return delLabelAction()
    }
  } else {
    const dialogConfig = getDialogConfig(handle)(
      {
        dialogSubmitSuccess: dialogSubmitSuccess,
        optionsMap: {
          sysCoverage: computed(() => sysCoverageOptions.value),
          identityAuthItem: computed(() => identityAuthItemOptions.value),
          payWay: computed(() => payWayOptions.value),
          businessUnit: computed(() => businessUnitOptions.value)
        },
        visible: { payWay: payTypeVisible, identityAuthItem: authenticationTypeVisible },
        onClose: handleDialogClose
      },
      entryUnitValidator,
      hardwareModuleValidator,
      networdPolicyValidator
    )
    for (const key of Object.keys(dialogConfig)) {
      dialogProps[key] = dialogConfig[key]
    }
    dialogProps.action = () => addMatterAction()
  }
  dialogRef.value?.open()
}

// 显示编辑窗口
async function showDialogByEdit(handle: ActionType, row: any, firstOpen: boolean = true) {
  if (firstOpen) activeName.value = 'basicInfo'
  const model = window.structuredClone(toRaw(row))
  model.hardwareModule = stringToArray(model.hardwareModule)
  model.identityAuthItem = stringToArray(model.identityAuthItem)
  model.networdPolicy = stringToArray(model.networdPolicy)
  model.payWay = stringToArray(model.payWay)
  model.sysCoverage = model.sysCoverageCode.split(',')
  model.businessUnit =
    businessUnitOptions.value?.find((v) => v.label === model.businessUnit)?.value ||
    model.businessUnit
  if (!unitListOptions.value?.length) {
    const unitInfo = await getUnitDetail(model.entryUnit)
    unitListOptions.value = [{ label: unitInfo.data.fullName, value: unitInfo.data.id }]
    model.entryUnit = unitInfo.data.fullName
  }
  detailAndEditorModel.value = model
  openDialogHandle.value = handle
  const dialogConfig = getDialogConfig(handle)(
    {
      dialogSubmitSuccess: dialogSubmitSuccess,
      optionsMap: {
        sysCoverage: computed(() => sysCoverageOptions.value),
        identityAuthItem: computed(() => identityAuthItemOptions.value),
        payWay: computed(() => payWayOptions.value),
        businessUnit: computed(() => businessUnitOptions.value),
        hardwareModuleOptions: computed(() => hardwareModuleOptions.value),
        networdPolicyOptions: computed(() => networdPolicyOptions.value),
        label: computed(() => matterLabelList.value)
      },
      visible: { payWay: payTypeVisible, identityAuthItem: authenticationTypeVisible },
      activeName: activeName.value,
      model: model,
      onClose: handleDialogClose
    },
    entryUnitValidator
  )
  for (const key of Object.keys(dialogConfig)) {
    dialogProps[key] = dialogConfig[key]
  }
  dialogProps.action = () => editMatterAction()
  dialogRef.value?.open()
}

// 显示详情窗口
async function showDialogByDetail(handle: ActionType, row: any, firstOpen: boolean = true) {
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

  // 将单位转成中文传入
  if (!unitListOptions.value?.length) {
    const unitInfo = await getUnitDetail(model.entryUnit)
    unitListOptions.value = [{ label: unitInfo.data.fullName, value: unitInfo.data.id }]
    model.entryUnit = unitInfo.data.fullName
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
    },
    onClose: handleDialogClose
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
