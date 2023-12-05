<template>
  <CnDialog v-bind="dialogProps" ref="dialogRef" @success="onSuccess"> </CnDialog>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'
import CnPage from '@/components/cn-page/CnPage.vue'
import { type DictType, dictTypeAdd as AddRequest, dictTypeEdit as EditRequest } from '@/api'

const dialogProps: CnPage.DialogProps = reactive({
  title: '新增字典类型',
  formProps: {
    model: {},
    items: [
      { label: '类型', prop: 'type', component: 'input' },
      { label: '描述', prop: 'description', component: 'input' }
    ],
    colSpan: 24,
    rules: {
      type: [{ required: true, message: '请输入' }],
      description: [{ required: true, message: '请输入' }]
    }
  }
})

const dialogRef = ref()
const open = (data) => {
  dialogRef.value.open()
  if (!data) {
    // 新增
    dialogProps.formProps!.model = {}
    dialogProps.action = () => handleSubmit('add')
  } else {
    dialogProps.formProps!.model = data
    dialogProps.action = () => handleSubmit('edit')
  }
}

function handleSubmit(action: 'add' | 'edit') {
  let params: DictType = {
    ...dialogProps.formProps!.model
  }
  return action === 'add' ? AddRequest(params) : EditRequest(params)
}

defineExpose({ open })

const onSuccess = () => {}
</script>

<style scoped lang="scss"></style>
