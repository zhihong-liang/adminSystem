<template>
  <div class="userCenter-root flex">
    <UserFile />
    <div class="rightPane-root">
      <BaseInfo />
      <AuthorizeInfo />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onUnmounted } from 'vue'
import { useHomeStore } from '@/stores'

import UserFile from './components/userFile.vue'
import BaseInfo from './components/baseInfo.vue'
import AuthorizeInfo from './components/authorizeInfo.vue'

const homeStore = useHomeStore()
const { updateContainerStyle } = homeStore

onBeforeMount(() => {
  updateContainerStyle({
    'background-color': 'var(--system-container-background)',
    padding: '0px'
  })
})

onUnmounted(() => {
  updateContainerStyle({})
})
</script>

<style lang="scss" scoped>
.userCenter-root {
  height: 100%;

  .rightPane-root {
    flex: 1;
  }
}
:deep(.el-mail) {
  display: block !important;
}
</style>
