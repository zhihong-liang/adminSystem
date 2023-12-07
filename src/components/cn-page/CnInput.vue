<script lang="ts" setup>
defineProps({
  placeholder: { type: String, default: '请输入' }, // 占位文本
  clearable: { type: Boolean, default: true }, // 默认可清空输入
  slots: { type: Array<any>, default: [] }
})
</script>

<template>
  <el-input :placeholder="placeholder" :clearable="clearable"> </el-input>
</template>
