<template>
  <div>
    <CnPage v-bind="props">
      <template #lableName="{ row }">
        <el-button type="text" @click="showDialog('detail', row)">{{ row.lableName }}</el-button>
      </template>
      <template #status="{ row }">
        <span>{{ row.id }}</span>
      </template>
    </CnPage>
    <CnDialog ref="dialogRef" v-bind="dialogProps">
      <!-- 新建标签 -->
      <template #footer v-if="handleType === 'add' || handleType === 'edit'">
        <div class="btns">
          <el-button
            type="primary"
            size="large"
            @click="() => (handleType === 'add' ? addMatterLabelAction() : editMatterLabelAction())"
            >确定</el-button
          >
        </div>
      </template>
      <!-- 删除单个标签 -->
      <template #deleteTitle v-if="handleType === 'delete'">
        <div class="deleteTitle">
          确定删除 "<span class="labelName"> {{ labelName }} </span>" 标签
        </div>
      </template>
      <template #footer v-if="handleType === 'delete'">
        <div class="btns">
          <el-button type="primary" size="large" @click="removeMatterLabelAction">删除</el-button>
        </div>
      </template>
      <!-- 删除多个标签 -->
      <template #deleteTitle v-if="handleType === 'manyDelete'">
        <div class="deleteTitle">
          确定删除 "<span class="labelName"> {{ (labelName as any).join('，') }} </span>" 标签
        </div>
      </template>
      <template #footer v-if="handleType === 'manyDelete'">
        <div class="btns">
          <el-button type="primary" size="large" @click="removeManyMatterLabelAction"
            >删除</el-button
          >
        </div>
      </template>
      <template #footer v-if="handleType === 'detail'">
        <div class="btns"></div>
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

import {
  getMatterLabelList,
  addMatterLabel,
  removeMatterLabel,
  editMatterLabel
} from '@/api/matter'

const handleType = ref<ActionType>()

// 标题名称
const labelName = ref<string | any[]>('')
const labelIds = ref<string | any[]>('')

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
  action: getMatterLabelList,
  search: searchConfig,
  toolbar: getTollbarConifg(showDialog),
  table: getTableConfig(showDialog, selectionChange),
  pagination: {
    page: 1,
    size: 10
  }
})

// 弹窗确定按钮的点击
function dialogSubmitSuccess() {
  props.refresh = new Date().getTime()
}

function selectionChange(selection: any[]) {
  tableSelection.value = selection
}

// 新建标签
async function addMatterLabelAction() {
  const model = dialogProps.formProps?.model || {}
  const { userInfo } = JSON.parse(localStorage.getItem('user')!)
  model.createUser = userInfo.name
  await addMatterLabel(model)
  dialogRef.value?.close()
  props.refresh = new Date().getTime()
  ElMessage.success('操作成功')
}

// 修改标签
async function editMatterLabelAction() {
  const model = dialogProps.formProps?.model || {}
  await editMatterLabel(model)
  dialogRef.value?.close()
  props.refresh = new Date().getTime()
  ElMessage.success('操作成功')
}

// 删除标签
async function removeMatterLabelAction() {
  await removeMatterLabel(labelIds.value as string)
  dialogRef.value?.close()
  props.refresh = new Date().getTime()
  ElMessage.success('操作成功')
}

// 删除多个标签
async function removeManyMatterLabelAction() {
  for (const ids of labelIds.value) {
    await removeMatterLabel(ids)
  }
  dialogRef.value?.close()
  props.refresh = new Date().getTime()
  ElMessage.success('操作成功')
}

// 显示添加/删除/标签弹窗
function showDialog(handle: ActionType, row?: any) {
  handleType.value = handle
  if (handle === 'add' || handle === 'edit') {
    const model = handle === 'edit' ? window.structuredClone(toRaw(row)) : undefined
    const dialogConfig = getDialogConfig(handle)({ dialogSubmitSuccess, model })
    for (const key of Object.keys(dialogConfig)) {
      dialogProps[key] = dialogConfig[key]
    }
  } else if (handle === 'delete' || handle === 'manyDelete') {
    if (handle === 'delete') {
      const model = window.structuredClone(toRaw(row))
      if (model.mattersCount)
        return ElMessage.warning(`${model.lableName}，存在使用事项数，无法删除。`)
      labelName.value = model.lableName
      labelIds.value = model.id
    } else {
      if (!tableSelection.value?.length) return
      // 存在使用事项数，无法删除
      const hasMattersCountList = tableSelection.value.filter((item) => item.mattersCount)
      if (hasMattersCountList.length) {
        const labelNames = hasMattersCountList.map((i: any) => i.lableName).join('，')
        return ElMessage.warning(`${labelNames}，存在使用事项数，无法删除。`)
      }
      labelName.value = tableSelection.value.map((item) => item.lableName)
      labelIds.value = tableSelection.value.map((item) => item.id)
    }
    const dialogConfig = getDialogConfig(handle)({})
    for (const key of Object.keys(dialogConfig)) {
      dialogProps[key] = dialogConfig[key]
    }
  } else {
    const model = window.structuredClone(toRaw(row))
    const obj = {
      status: model.status === '1' ? '有效' : '无效'
    }
    const dialogConfig = getDialogConfig(handle)({ model: { ...model, ...obj } })
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
  .labelName {
    color: #409eff;
  }
}
.btns {
  width: 100%;
  justify-content: center;
  display: flex;
}
</style>
