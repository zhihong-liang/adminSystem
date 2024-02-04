<template>
  <indexComp v-bind="data" />
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import indexComp from './indexComp.vue'
import { orderHistoryList } from '@/api/order'

const data = reactive({
  type: 'History',
  bpmNodeCode: '1500',
  action: orderHistoryList
})
</script>
