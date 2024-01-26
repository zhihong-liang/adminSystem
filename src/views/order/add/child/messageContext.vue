<template>
  <CnDialog v-bind="dialogProps" ref="dialogRef">
    <template #footer>
      <el-button @click="dialogRef?.close()">关闭</el-button>
    </template>
  </CnDialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'
import {writeQueryList} from '@/api/admin'

const dialogRef = ref()
const dialogProps = reactive<CnPage.DialogProps>({
  title: '服务标准',
  action: () => Promise.resolve(),
  formProps: {
    model: {},
    items: [
      {
        label: '',
        prop: 'messageContext',
        component: 'editor',
        props: {
          height: '400px'
        }
      }
    ],
    colSpan: 24,
    rules: {}
  },
})

const open = () => {
  writeQueryList({
    size: 10,
    page: 1,
    obj: {messageType: '1', status: '1'}
  }).then((res: any) => {
    if (res.code === '200') {
      dialogProps.formProps!.model.messageContext = res.rows[0].messageContext
    }
  })
  dialogRef.value.open()
}
defineExpose({ open })
</script>
