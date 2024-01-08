<template>
  <CnDialog v-bind="dialogProps" ref="dialogRef"></CnDialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'

const emits = defineEmits(['success'])
const addType = ref()
const dialogRef = ref()
const dialogProps = reactive<CnPage.DialogProps>({
  title: '新建',
  action: () => Promise.resolve(),
  formProps: {
    model: {},
    items: [
      { label: '服务标准名称', prop: 'name', component: 'input' },
      {
        label: '状态',
        prop: 'status',
        span: 24,
        component: 'radio',
        dict: 'USER_STATUS'
      },
      {
        label: '服务标准内容',
        prop: 'userNo5',
        component: 'input',
        props: { type: 'textarea' }
      }
    ],
    colSpan: 24,
    rules: {
      name: [{ required: true, message: '请输入服务标准名称' }]
    }
  },
  onSuccess: () => {
    console.log('成功')
    emits('success')
  },
  onSubmit: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('')
      }, 2000)
    })
  }
})

const open = (type: string, title: string) => {
  addType.value = type
  dialogProps.title = title + '服务标准'
  dialogRef.value.open()
}
defineExpose({ open })
</script>
