<template>
  <CnDialog v-bind="dialogProps" ref="dialogRef" @success="onSuccess"> </CnDialog>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'
import CnPage from '@/components/cn-page/CnPage.vue'
import { type DictType, dictTypeAdd as AddRequest, dictTypeEdit as EditRequest } from '@/api'
const type = ref()
const treeData = []
const dialogProps: CnPage.DialogProps = reactive({
  title: '新增',
  formProps: {
    model: {},
    items: [
      { label: '基本信息', component: 'divider', span: 24 },
      { label: '角色名称', prop: 'name', component: 'input' },
      { label: '状态', prop: 'status', component: 'input' },
      { label: '角色描述', prop: 'descript', component: 'input', props: { type: 'textarea' } },
      { label: '功能权限', component: 'divider', span: 24 },
      {
        label: '',
        component: 'tree',
        span: 24,
        prop: 'ids',
        props: {
          showCheckbox: true,
          data: treeData,
          nodeKey: 'value',
          onCheckChange: (data) => {
            console.log('data: ', data)
          }
        }
      }
    ],
    colSpan: 24,
    rules: {
      type: [{ required: true, message: '请输入类型' }],
      description: [{ required: true, message: '请输入描述' }]
    }
  }
})

const dialogRef = ref()

const open = (data: DictType) => {
  dialogRef.value.open()
  if (!data) {
    // 新增
    dialogProps.formProps!.model = {
      ids: []
    }
    dialogProps.action = () => handleSubmit('add')
    type.value = 'add'
  } else {
    dialogProps.formProps!.model = { data }
    dialogProps.action = () => handleSubmit('edit')
    type.value = 'edit'
  }
}

function handleSubmit(action: 'add' | 'edit') {
  let params: DictType = {
    ...dialogProps.formProps!.model
  }
  console.log('params: ', params)
  // return action === 'add' ? 'ddd' : 'dd'
}

defineExpose({ open })
</script>

<style scoped lang="scss"></style>
