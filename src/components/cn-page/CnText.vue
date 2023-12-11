<template>
  <el-text>{{ setText($attrs.modelValue) }}</el-text>
</template>

<script lang="ts" setup>
// import { useAttrs  } from 'vue'
// console.log(useAttrs())

function setText(val: unknown) {
  if (val === undefined || val === null || val === '') return '--'
  return val
}
</script>
