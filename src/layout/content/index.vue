<template>
  <div class="content-root">
    <!-- TODO 还有个面包屑组件，弄完菜单再搞 -->

    <div class="container">
      <RouterView v-slot="{ Component, route }">
        <Transition name="fade-transform" mode="out-in">
          <!-- <keep-alive> -->
            <div :key="route.path"> <!-- 解决没有根节点的组件与 transition 组件冲突的bug -->
              <component :is="Component" :key="route.fullPath" />
            </div>
          <!-- </keep-alive> -->
        </Transition>
      </RouterView>
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
