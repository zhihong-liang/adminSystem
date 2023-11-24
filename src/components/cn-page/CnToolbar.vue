<script lang="ts" setup>
defineProps(['items']);
</script>

<template>
  <div v-if="items.length">
    <el-button v-for="(item, index) in items" v-bind="item" :key="index">
      {{ item.label }}
    </el-button>
  </div>
</template>
