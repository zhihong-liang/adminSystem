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
  height: 100%;
  justify-content: flex-start;
  width: 100%;
  color: #4E5969;
}
</style>
