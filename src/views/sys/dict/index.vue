<template>
  <div v-show="type === ''">
    <MainClass @change-type="(row) => (type = row.type)" />
  </div>
  <SubClass v-if="type" :type="type" @change-type="() => (type = '')" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import MainClass from './child/mainClass.vue'
import SubClass from './child/subClass.vue'
const type = ref('')
</script>

<style lang="scss" scoped></style>
