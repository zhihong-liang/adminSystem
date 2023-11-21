<template>
  <CnForm :col-span="colSpan" :footer-span="footerSpan || colSpan">
    <template #footer="{ data, el }">
      <el-button type="primary" @click="handleSearch(data)">搜索</el-button>
      <el-button @click="handleReset(data, el)">重置</el-button>
    </template>
  </CnForm>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import CnForm from './CnForm.vue'

defineProps({
  colSpan: { type: Number, default: 6 },
  footerSpan: { type: Number, default: 6 }
})

const emits = defineEmits(['search', 'reset'])

function handleSearch(data: unknown) {
  emits('search', data)
}

function handleReset(data: unknown, el?: FormInstance) {
  el?.resetFields()
  emits('reset', data, el)
}
</script>
