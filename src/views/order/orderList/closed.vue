<template>
  <indexComp v-bind="data" />
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import indexComp from './indexComp.vue'
import { orderCloseList } from '@/api/order'

const data = reactive({
  type: 'Closed',
  bpmNodeCode: '1520',
  action: orderCloseList
})
</script>
