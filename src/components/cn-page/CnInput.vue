<script lang="ts" setup>
defineProps({
  placeholder: { type: String, default: '请输入' }, // 占位文本
  clearable: { type: Boolean, default: true } // 默认可清空输入
})
</script>

<template>
  <el-input :placeholder="placeholder" :clearable="clearable" />
</template>
