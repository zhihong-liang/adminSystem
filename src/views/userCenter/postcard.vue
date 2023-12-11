<template>
  <div class="userinfo flex flex-column flex-center mb-lg">
    <el-avatar class="mb-lg" :size="100">user</el-avatar>

    <div class="flex flex-column flex-center">
      <h2>{{ data.name || '--' }}</h2>
      <p>{{ data.job || '--' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  data: Object,
  default: () => ({
    name: '--',
    job: '--'
  })
})
</script>

<style scoped></style>
