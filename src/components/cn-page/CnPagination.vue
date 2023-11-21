<template>
  <el-pagination
    v-model:current-page="state.currentPage"
    v-model:page-size="state.pageSize"
    @update:current-page="(page: number) => handleUpdate(page, state.pageSize)"
    @update:page-size="(size: number) => handleUpdate(state.currentPage, size)"
  />
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

const props = defineProps({
  page: { type: Number, default: 1 },
  size: { type: Number, default: 10 }
})
const state = reactive({
  currentPage: props.page,
  pageSize: props.size
})

const emits = defineEmits(['update'])
function handleUpdate(page: number, size: number) {
  emits('update', page, size)
}
</script>
