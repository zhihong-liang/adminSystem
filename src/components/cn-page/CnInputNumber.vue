<template>
  <el-input-number :step-strictly="stepStrictly" />
</template>

<script lang="ts" setup>
defineProps({
  stepStrictly: { type: Boolean, default: true }
})
</script>
