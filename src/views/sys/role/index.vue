<template>
  <CnSearch v-bind="search" :model="params" @search="handleQuery()" @reset="handleQuery()" />
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import CnSearch from '@/components/cn-page/CnSearch.vue'

// 搜索
const inited = ref(false)
const search = ref({
  items: [{ label: '主类', prop: 'type', component: 'input' }]
})
const params = ref()
const handleQuery = () => {}
</script>

<style scoped lang="scss"></style>
