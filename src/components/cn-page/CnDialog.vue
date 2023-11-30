<template>
  <el-dialog
    v-model="visible"
    :destroy-on-close="destroyOnClose"
    :close-on-click-modal="closeOnClickModal"
    :append-to-body="appendToBody"
    @closed="handleClosed"
  >
    <template #default>
      <slot v-if="formProps">
        <CnForm v-bind="formProps" ref="formWrapRef">
          <template v-for="item in slots" v-slot:[item.prop]="slotProps" :key="item.prop">
            <slot :name="item.prop" v-bind="slotProps" />
          </template>
        </CnForm>
      </slot>
    </template>

    <template #footer>
      <slot name="footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">提交</el-button></slot
      >
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, type PropType, type UnwrapNestedRefs, watchEffect } from 'vue'
import CnForm from './CnForm.vue'

const props = defineProps({
  destroyOnClose: { type: Boolean, default: true },
  closeOnClickModal: { type: Boolean, default: false },
  appendToBody: { type: Boolean, default: true },
  formProps: { type: Object as PropType<UnwrapNestedRefs<CnPage.FormProps>> },
  action: Function,
  params: Object
})

const slots = ref<CnPage.FormItemSlotProps[]>([])
watchEffect(() => {
  if (props.formProps) {
    slots.value = props.formProps.items.filter(v => v.component === 'slot') as CnPage.FormItemSlotProps[]
  }
})

const visible = ref(false)
const loading = ref(false)

function handleCancel() {
  visible.value = false
}
function handleSubmit() {
  formWrapRef.value?.formRef
    ?.validate()
    .then(() => {
      if (props.action) {
        props.action(props.params).finally(() => {
          visible.value = false
        })
      }
    })
    .catch(() => {})
}

const formWrapRef = ref()
function handleClosed() {
  formWrapRef.value?.formRef?.resetFields()
}
function open() {
  visible.value = true
}
defineExpose({ open })
</script>
