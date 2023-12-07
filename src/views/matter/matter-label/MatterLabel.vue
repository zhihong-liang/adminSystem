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
      <template #delete>
        <div>确定删除"一次性办结"标签</div>
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
import getDialogConfig from './config/dialog-config'

import type { handleType } from './config/type'

import { getMatterLabelList, addMatterLabel } from '@/api/matter'

// const init: Promise<void> = new Promise((resolve) =>
//   setTimeout(() => {
//     resolve()
//   }, 1000)
// )

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
  table: getTableConfig(showDialog),
  pagination: {
    page: 1,
    size: 10
  }
})

// 弹窗确定按钮的点击
function dialogSubmitSuccess() {
  props.refresh = new Date().getDate()
}

function addMatterLabelAction() {
  const model = dialogProps.formProps?.model || {}
  return addMatterLabel(model)
}

// 显示操作弹窗
function showDialog(handle: handleType, row?: any) {
  console.log(row)
  const dialogConfig = getDialogConfig(handle, dialogSubmitSuccess)
  for (const key of Object.keys(dialogConfig)) {
    dialogProps[key] = dialogConfig[key]
  }
  dialogProps.action = () => addMatterLabelAction()
  dialogRef.value?.open()
}
</script>

<style scoped lang="scss"></style>
