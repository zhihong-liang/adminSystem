<template>
  <div class="cn-content">
    <RouterView v-slot="{ Component, route }">
      <Transition name="fade-transform" mode="out-in">
        <keep-alive>
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
      </Transition>
    </RouterView>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<style lang="scss" scoped>
.cn-content {
  padding: 20px;
  max-height: 100%;

  flex: 1;
}
</style>
