<template>
  <CnDialog v-bind="dialogProps" ref="dialogRef" @success="onSuccess"> </CnDialog>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'
import CnPage from '@/components/cn-page/CnPage.vue'
import { type SubDict, dictAdd as AddRequest, dictEdit as EditRequest } from '@/api'
const type = ref()
const dialogProps: CnPage.DialogProps = reactive({
  title: '新增',
  formProps: {
    model: {},
    items: [
      { label: '主类', prop: 'type' },
      {
        label: '值',
        prop: 'subtype',
        component: 'input'
      },
      { label: '描述', prop: 'description', component: 'input' },
      { label: '排序', prop: 'orderNum', component: 'input' },
      { label: '备注', prop: 'remarks', component: 'input' }
    ],
    colSpan: 24,
    rules: {
      subtype: [{ required: true, message: '请输入字典值' }],
      description: [{ required: true, message: '请输入描述信息' }]
    }
  }
})

const dialogRef = ref()

const open = (data: SubDict, _type: string) => {
  dialogRef.value.open()
  if (_type == 'add') {
    // 新增
    dialogProps.formProps!.model = {}
    dialogProps.action = () => handleSubmit('add')
    type.value = 'add'
    dialogProps.title = '新增'
  } else {
    dialogProps.action = () => handleSubmit('edit')
    type.value = 'edit'
    dialogProps.title = '编辑'
  }
  dialogProps.formProps!.model = data
}

function handleSubmit(action: 'add' | 'edit') {
  let params: SubDict = {
    ...dialogProps.formProps!.model
  }
  return action === 'add' ? AddRequest(params) : EditRequest(params)
}

defineExpose({ open })

const onSuccess = () => {}
</script>

<style scoped lang="scss"></style>
