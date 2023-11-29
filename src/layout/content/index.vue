<template>
  <div class="content-root">

    <div class="container">
      <suspense>
        <RouterView v-slot="{ Component, route }">
          <Transition name="fade-transform" mode="out-in">
            <keep-alive>
              <component :is="Component" :key="route.fullPath" />
            </keep-alive>
          </Transition>
        </RouterView>

        <template #fallback>
          <div v-loading>加载中...</div>
        </template>
      </suspense>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<style lang="scss" scoped>
$--content-padding: 20px;

.content-root {
  padding: $--content-padding;
  flex: 1;

  background-color: var(--system-container-background);
}

.container {
  padding: $--content-padding;
  height: calc(100% - ($--content-padding * 2));

  background-color: #fff;
}
</style>
