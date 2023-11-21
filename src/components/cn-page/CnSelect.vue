<script lang="ts" setup>
import type { PropType } from 'vue'

defineProps({
  options: Array as PropType<CnPage.OptionProps[]>, // 选项
  clearable: { type: Boolean, default: true }, // 默认可清空选项
  filterable: { type: Boolean, default: true } // 默认可筛选
})
</script>

<template>
  <el-select :clearable="clearable" :filterable="filterable">
    <el-option v-for="option in options" v-bind="option" :key="option.value" />
  </el-select>
</template>
