<template>
  <div class="readonly">
    {{ setText($attrs.modelValue) }}
  </div>
</template>

<script lang="ts" setup>
function setText(val: unknown) {
  if (val === undefined || val === null || val === '') return '--'
  return val
}
</script>

<style lang="scss" scoped>
.readonly {
  background-color: #f7f8fa;
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
  height: 100%;
  justify-content: flex-start;
  padding: 0 10px;
  width: 100%;
}
</style>
