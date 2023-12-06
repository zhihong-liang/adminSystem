<template>
  <div>
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
      <template #delete>
        <div>是否删除</div>
      </template>
      <template #offShelf>
        <div>下架</div>
      </template>
      <template #content>
        <CnEditor v-model:modelValue="editorContent"></CnEditor>
      </template>
    </CnDialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import CnPage from '@/components/cn-page/CnPage.vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'
import CnEditor from '@/components/Editor/Editor.vue'

import searchConfig from './config/search-config'
import getTableConfig from './config/table-config'
import getTollbarConifg from './config/tollbar-config'
import { getTollBarActionDialogConfig } from './config/dialog-config'

import type { dialogActionType } from './config/type'

import { getUsers } from '@/api'

// const init: Promise<void> = new Promise((resolve) =>
//   setTimeout(() => {
//     resolve()
//   }, 1000)
// )

const dialogRef = ref<InstanceType<typeof CnDialog>>()
const dialogProps = reactive<CnPage.DialogProps>({})

const editorContent = ref('123')

const props = reactive<CnPage.Props>({
  init: undefined,
  params: {
    page: 1,
    size: 10
  },
  // action: () => Promise.reject('暂无数据'),
  action: getUsers,
  search: searchConfig,
  toolbar: getTollbarConifg(showDialog),
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
function handleTableActionClick(params: any, handle: dialogActionType) {
  showDialog(handle)
}

// 设置tollbar点击弹窗的配置
function showDialog(handle: dialogActionType) {
  const dialogConfig = getTollBarActionDialogConfig(handle, submit)
  for (const key of Object.keys(dialogConfig)) {
    dialogProps[key] = dialogConfig[key]
  }
  dialogRef.value?.open()
}
</script>

<style scoped lang="scss"></style>
