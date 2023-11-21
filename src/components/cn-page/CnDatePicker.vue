<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  type: String,
  valueFormat: String,
  placeholder: { type: String, default: '请选择' }
})

const format = computed(() => {
  if (props.valueFormat) {
    return props.valueFormat
  } else if (props.type === 'date' || props.type === 'dates' || props.type === 'daterange') {
    return 'YYYY-MM-DD'
  } else if (props.type === 'datetime' || props.type === 'datetimerange') {
    return 'YYYY-MM-DD HH:mm:ss'
  } else if (props.type === 'week') {
    return 'd'
  } else if (props.type === 'month' || props.type === 'monthrange') {
    return 'YYYY-MM'
  } else if (props.type === 'year') {
    return 'YYYY'
  } else {
    return 'YYYY-MM-DD'
  }
})
</script>

<template>
  <el-date-picker :type="type" :value-format="format" :placeholder="placeholder" />
</template>
