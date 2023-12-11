<template>
  <div>
    <CnPage v-bind="props">
      <template #lableName="{ row }">
        <el-button type="text" @click="showDialogByAddAndEditAndDetail('detail', row)">{{
          row.lableName
        }}</el-button>
      </template>
      <template #status="{ row }">
        <span>{{ row.id }}</span>
      </template>
    </CnPage>
    <CnDialog ref="dialogRef" v-bind="dialogProps">
      <template #deleteTitle v-if="handleType === 'delete'">
        <div class="deleteTitle">
          确定删除"<span class="labelName"> {{ labelName }} </span>"标签
        </div>
      </template>
      <template #footer v-if="handleType === 'delete'">
        <div class="btns">
          <el-button type="primary" size="large" @click="removeMatterLabelAction">删除</el-button>
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
const labelName = ref('')
const labelIds = ref('')

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
  toolbar: getTollbarConifg(showDialogByAddAndEditAndDetail),
  table: getTableConfig(showDialogByAddAndEditAndDetail),
  pagination: {
    page: 1,
    size: 10
  }
})

// 弹窗确定按钮的点击
function dialogSubmitSuccess() {
  props.refresh = new Date().getTime()
}

// 新建标签
function addMatterLabelAction() {
  const model = dialogProps.formProps?.model || {}
  return addMatterLabel(model)
}

// 删除标签
async function removeMatterLabelAction() {
  await removeMatterLabel(labelIds.value)
  dialogRef.value?.close()
  props.refresh = new Date().getTime()
  ElMessage.success('操作成功')
}

function editMatterLabelAction() {
  const model = dialogProps.formProps?.model || {}
  return editMatterLabel(model)
}

// 显示添加/删除/标签弹窗
function showDialogByAddAndEditAndDetail(handle: ActionType, row?: any) {
  handleType.value = handle
  if (handle === 'add' || handle === 'edit') {
    const model = handle === 'edit' ? window.structuredClone(toRaw(row)) : undefined
    const dialogConfig = getDialogConfig(handle)({ dialogSubmitSuccess, model })
    for (const key of Object.keys(dialogConfig)) {
      dialogProps[key] = dialogConfig[key]
    }
    dialogProps.action = () => (handle === 'add' ? addMatterLabelAction() : editMatterLabelAction())
  } else if (handle === 'delete') {
    if (!row) return
    const model = window.structuredClone(toRaw(row))
    labelName.value = model.lableName
    labelIds.value = model.id
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
