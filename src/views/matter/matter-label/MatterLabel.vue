<template>
  <div>
    <CnPage v-bind="props">
      <template #itemId="{ row }">
        <el-button type="text" @click="showDialog('detail', row)">{{ row.id }}</el-button>
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

import { getUsers } from '@/api'

// const init: Promise<void> = new Promise((resolve) =>
//   setTimeout(() => {
//     resolve()
//   }, 1000)
// )

const dialogRef = ref<InstanceType<typeof CnDialog>>()
const dialogProps = reactive<CnPage.DialogProps>({})

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
  table: getTableConfig(showDialog),
  pagination: {
    page: 1,
    size: 10
  }
})

// 弹窗确定按钮的点击
function submit() {
  console.log(dialogProps.formProps?.model)
}

// 显示操作弹窗
function showDialog(handle: handleType, row?: any) {
  console.log(row)
  const dialogConfig = getDialogConfig(handle, submit)
  for (const key of Object.keys(dialogConfig)) {
    dialogProps[key] = dialogConfig[key]
  }
  dialogRef.value?.open()
}
</script>

<style scoped lang="scss"></style>
