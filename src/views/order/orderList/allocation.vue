<template>
  <indexComp v-bind="data" />
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import indexComp from './indexComp.vue'

const data = reactive({
  type: 'Allocation',
  bpmNodeCode: '1001'
})
</script>
