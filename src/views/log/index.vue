<template>
  <!-- <CnPage v-bind="PageProps"></CnPage> -->
  <div>
    <CnSearch />
    <h2>log页面</h2>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// import CnPage from '@/components/cn-page/CnPage.vue'
import CnSearch from '@/components/cn-page/CnSearch.vue'

const data = ref([])

</script>

<style scoped></style>
