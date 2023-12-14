<template>
  <div>
    <CnPage v-bind="props">
      <template #businessDeptName="{ row }">
        <el-button type="text" @click="showDialog('detail', row)">{{
          row.businessDeptName
        }}</el-button>
      </template>
      <template #status="{ row }">
        <span>{{ row.id }}</span>
      </template>
    </CnPage>
    <CnDialog ref="dialogRef" v-bind="dialogProps">
      <!-- 单个删除 -->
      <template #businessDeptName v-if="handleType === 'delete'">
        <div class="deleteTitle">
          确定删除 "<span class="deptName"> {{ deptName }} </span>" 业务部门
        </div>
      </template>
      <template #footer v-if="handleType === 'delete'">
        <div class="btns">
          <el-button type="primary" size="large" @click="removeDeptAction">删除</el-button>
        </div>
      </template>
      <!-- 多个删除 -->
      <template #businessDeptName v-if="handleType === 'manyDelete'">
        <div class="deleteTitle">
          确定删除 "<span class="deptName"> {{ (deptName as any[]).join('，') }} </span>" 业务部门
        </div>
      </template>
      <template #footer v-if="handleType === 'manyDelete'">
        <div class="btns">
          <el-button type="primary" size="large" @click="removeManyDeptAction">删除</el-button>
        </div>
      </template>
      <template #footer v-if="handleType === 'detail'">
        <div></div>
      </template>
    </CnDialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, toRaw } from 'vue'
import { ElMessage } from 'element-plus'

import CnPage from '@/components/cn-page/CnPage.vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'

import searchConfig from './config/search-config'
import getTableConfig from './config/table-config'
import getTollbarConifg from './config/tollbar-config'
import { getDialogConfig } from './config/dialog-config'

import type { ActionType } from './config/type'

import { getDeptList, addDept, removeDept, editDept } from '@/api/matter'

const handleType = ref<ActionType>()
const deptName = ref<string | any[]>('')
const deptIds = ref<string | any[]>('')

const tableSelection = ref<any[]>()

const dialogRef = ref<InstanceType<typeof CnDialog>>()
const dialogProps = reactive<CnPage.DialogProps>({})

const props = reactive<CnPage.Props>({
  refresh: 0,
  init: undefined,
  params: {
    page: 1,
    size: 10
  },
  action: getDeptList,
  search: searchConfig,
  toolbar: getTollbarConifg(showDialog),
  table: getTableConfig(showDialog, selectionChange),
  pagination: {
    page: 1,
    size: 10
  }
})

function selectionChange(selection: any[]) {
  tableSelection.value = selection
}

// 弹窗确定按钮的点击
function dialogSubmitSuccess() {
  props.refresh = new Date().getTime()
}

// 新增业务部门
function addDeptAction() {
  const model = dialogProps.formProps?.model || {}
  return addDept(model)
}

// 修改业务部门
function editDeptAction() {
  const model = dialogProps.formProps?.model || {}
  return editDept(model)
}

// 删除业务部门
async function removeDeptAction() {
  await removeDept(deptIds.value as string)
  dialogRef.value?.close()
  props.refresh = new Date().getTime()
  ElMessage.success('操作成功')
}

// 删除多个业务部门
async function removeManyDeptAction() {
  for (const ids of deptIds.value) {
    await removeDept(ids)
  }
  dialogRef.value?.close()
  props.refresh = new Date().getTime()
  ElMessage.success('操作成功')
}

// 显示弹窗
function showDialog(handle: ActionType, row?: any) {
  handleType.value = handle
  if (handle === 'add' || handle === 'edit') {
    const model = handle === 'edit' ? window.structuredClone(toRaw(row)) : undefined
    const dialogConfig = getDialogConfig(handle)({ dialogSubmitSuccess, model })
    for (const key of Object.keys(dialogConfig)) {
      dialogProps[key] = dialogConfig[key]
    }
    dialogProps.action = () => (handle === 'add' ? addDeptAction() : editDeptAction())
  } else if (handle === 'delete' || handle === 'manyDelete') {
    if (handle === 'delete') {
      const model = window.structuredClone(toRaw(row))
      if (model.mattersCount)
        return ElMessage.warning(`${model.businessDeptName}，存在事项数，无法删除。`)
      deptName.value = model.businessDeptName
      deptIds.value = model.id
    } else {
      if (!tableSelection.value?.length) return
      // 存在使用事项数，无法删除
      const hasMattersCountList = tableSelection.value.filter((item) => item.mattersCount)
      if (hasMattersCountList.length) {
        const businessDeptNames = hasMattersCountList.map((i: any) => i.businessDeptName).join('，')
        return ElMessage.warning(`${businessDeptNames}，存在事项数，无法删除。`)
      }
      deptName.value = tableSelection.value.map((item) => item.businessDeptName)
      deptIds.value = tableSelection.value.map((item) => item.id)
    }
    const dialogConfig = getDialogConfig(handle)({})
    for (const key of Object.keys(dialogConfig)) {
      dialogProps[key] = dialogConfig[key]
    }
  } else {
    const model = window.structuredClone(toRaw(row))
    const dialogConfig = getDialogConfig(handle)({ model })
    for (const key of Object.keys(dialogConfig)) {
      dialogProps[key] = dialogConfig[key]
    }
  }
  dialogRef.value?.open()
}
</script>

<style scoped lang="scss">
.deleteTitle {
  width: 100%;
  display: flex;
  font-size: 20px;
  justify-content: center;
  .deptName {
    color: #409eff;
  }
}
.btns {
  width: 100%;
  justify-content: center;
  display: flex;
}
</style>
