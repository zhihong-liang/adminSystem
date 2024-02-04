<template>
  <el-image
    v-for="(items, indexs) in setList($attrs.modelValue)"
    style="width: 100px; height: 100px; margin-right: 10px"
    :src="items"
    :key="indexs"
    :zoom-rate="1.2"
    :max-scale="7"
    :min-scale="0.2"
    :preview-src-list="[items]"
    :initial-index="0"
    fit="cover"
  />
  <span v-if="!$attrs.modelValue">--</span>
</template>

<script lang="ts" setup>
function setList(val: unknown) {
  if (val === undefined || val === null || val === '') return []
  if (typeof val === 'string') return val.split(',')
  return val
}
</script>
