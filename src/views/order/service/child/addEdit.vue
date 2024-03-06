<template>
  <CnDialog :title="titleType === 'look' ? '查看': '编辑'" ref="dialogRef">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="first">
        <CnForm v-bind="baseForm" ref="baseRef" />
      </el-tab-pane>
      <el-tab-pane label="内容信息" name="second">
        <CnForm v-bind="contentForm" ref="contentRef" />
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button @click="dialogRef?.close()">{{ titleType === 'look' ? '关闭' : '取消' }}</el-button>
      <el-button v-if="titleType !== 'look'" type="primary" @click="handleSubmit()">提交</el-button>
    </template>
  </CnDialog>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from 'vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'
import CnForm from '@/components/cn-page/CnForm.vue'
import { writeEdit } from '@/api/admin'

const activeName = ref('first')
const titleType = ref()
const baseRef = ref()
const contentRef = ref()

const params = ref()

const emits = defineEmits(['success'])
const dialogRef = ref()

const baseForm = reactive({
  disabled: computed(() => titleType.value === 'look'),
  model: computed(() => params.value),
  items: [
    { label: '更新时间', prop: 'updateTime' },
    { label: '编号', prop: 'messageCode' },
    { label: '状态', prop: 'status', component: 'select', dict: 'MESSAGE_STATUS' },
    { label: '文案类型', prop: 'messageType', component: 'select', dict: 'MESSAGE_TYPE' },
    { label: '备注', prop: 'remark', component: 'input', props: { type: 'textarea' }, span: 24 }
  ],
  labelWidth: 100,
  rules: {
    status: [{ required: true, message: '请选择状态' }],
    messageType: [{ required: true, message: '请选择文案类型' }]
  }
})

const contentForm = reactive({
  disabled: computed(() => titleType.value === 'look'),
  model: computed(() => params.value),
  items: [
    {
      label: '文案内容',
      prop: 'messageContext',
      component: 'editor',
      props: {
        height: '400px'
      }
    }
  ],
  labelWidth: 100,
  colSpan: 24,
  rules: {
    messageContext: [{ required: true, message: '请填写文案内容' }]
  }
})

const open = (type: string, data: any) => {
  titleType.value = type
  params.value = data
  dialogRef.value.open()
}
defineExpose({ open })

const handleSubmit = () => {
  const valid1 = baseRef.value.formRef.validate()
  const valid2 = contentRef.value.formRef.validate()
  Promise.all([valid1, valid2]).then(() => {
    writeEdit({
      ...baseForm.model,
      messageContext: contentForm.model.messageContext
    }).then((res) => {
      if (res.code === '200') {
        emits('success')
        dialogRef.value.close()
      }
    })
  })
}
</script>
