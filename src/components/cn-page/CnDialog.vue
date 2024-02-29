<template>
  <el-dialog
    v-model="visible"
    :destroy-on-close="destroyOnClose"
    :close-on-click-modal="closeOnClickModal"
    :append-to-body="appendToBody"
    @closed="handleClosed"
  >
    <template #default>
      <div class="background" v-if="type == 'tabs'">
        <div class="tab-title">{{ $attrs.title }}</div>
        <el-icon class="tab-close" @click="handleCancel"><Close /></el-icon>
        <div class="angle-left">
          <div class="angle-left-inset"></div>
        </div>
        <div class="angle-right">
          <div class="angle-right-inset"></div>
        </div>
      </div>

      <slot v-if="formProps">
        <CnForm v-bind="formProps" v-loading="loading" ref="formWrapRef">
          <template v-for="item in slots" v-slot:[item.prop]="slotProps" :key="item.prop">
            <slot :name="item.prop" v-bind="slotProps" />
          </template>
        </CnForm>
      </slot>

      <slot v-else></slot>
    </template>

    <template #footer>
      <slot name="footer" v-bind="{ ref: formWrapRef }">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">提交</el-button></slot
      >
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, type PropType, type UnwrapNestedRefs, watchEffect } from 'vue'
import { ElMessage } from 'element-plus'
import type { Res } from '@/api'
import CnForm from './CnForm.vue'

const props = defineProps({
  type: { type: String, default: '' },
  destroyOnClose: { type: Boolean, default: true },
  closeOnClickModal: { type: Boolean, default: false },
  appendToBody: { type: Boolean, default: true },
  formProps: { type: Object as PropType<UnwrapNestedRefs<CnPage.FormProps>> },
  loading: { type: Boolean, default: false },
  action: { type: Function as PropType<() => Promise<Res<any>>> }
})
const emits = defineEmits(['success', 'close'])

const slots = ref<CnPage.FormItemSlotProps[]>([])
watchEffect(() => {
  if (props.formProps) {
    slots.value = props.formProps.items.filter(
      (v) => v.component === 'slot'
    ) as CnPage.FormItemSlotProps[]
  }
})

const visible = ref(false)
const submitting = ref(false)

function handleCancel() {
  visible.value = false
}
function handleSubmit() {
  formWrapRef.value?.formRef
    ?.validate()
    .then(() => {
      if (props.action) {
        submitting.value = true
        props
          .action()
          .then((res) => {
            ElMessage.success(res?.message || '操作成功')
            emits('success')
          })
          // .catch((err) => {
          //   err?.message && ElMessage.warning(err?.message || '操作失败')
          // })
          .finally(() => {
            visible.value = false
            submitting.value = false
          })
      }
    })
    .catch(() => {})
}

const formWrapRef = ref()
function handleClosed() {
  emits('close')
  formWrapRef.value?.formRef?.resetFields()
}
function open() {
  visible.value = true
}
function close() {
  visible.value = false
}
defineExpose({ open, close, handleSubmit })
</script>

<style lang="scss" scoped>
:deep(.el-date-editor--datetime) {
  width: 100% !important;
}

.background {
  width: 100%;
  height: 124px;
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(180deg, #add0ff 0%, #ecf4ff 100%),
    radial-gradient(154% 117% at 11% -17%, #aee7ff 0%, rgba(236, 244, 255, 0) 100%);
  box-shadow: inset 0px 0 0px 0px #e5e6eb;
  z-index: 1;
  .angle-left {
    width: 20px;
    height: 20px;
    background: #e9f2ff;
    display: block;
    bottom: -20px;
    left: 0;
    position: absolute;
    .angle-left-inset {
      width: 100%;
      height: 100%;
      border-top-left-radius: 50%;
      background: #fff;
    }
  }
  .angle-right {
    width: 20px;
    height: 20px;
    background: #e9f2ff;
    display: block;
    bottom: -20px;
    right: 0;
    position: absolute;
    .angle-right-inset {
      width: 100%;
      height: 100%;
      border-top-right-radius: 50%;
      background: #fff;
    }
  }
}
.tab-title {
  text-align: center;
  padding-top: 15px;
  font-weight: bold;
  color: #000;
  font-size: 15px;
}

.tab-close {
  position: absolute;
  top: 15px;
  right: 10px;
  cursor: pointer;
  color: #171717;
  &:hover {
    transform: scale(1.2);
  }
}
</style>
