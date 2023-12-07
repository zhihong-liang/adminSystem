<template>
  <div class="content-root ofh">
    <!-- 面包屑 -->
    <div class="flex flex-between">
      <el-breadcrumb class="cn-breadcrumb" separator="/">
        <el-breadcrumb-item v-for="item in breadcrumbList" :to="{ path: item.path }" :key="item.id">{{
          item.name
        }}</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="flex flex-center">
        <CnIcon size="20px" html="SwitchFilled"/>
      </div>
    </div>

    <!-- container -->
    <div class="container ofh">
      <el-scrollbar>
        <RouterView v-slot="{ Component, route }">
          <Transition name="fade-transform" mode="out-in">
            <!-- <keep-alive> -->
            <div :key="route.path">
              <!-- 解决没有根节点的组件与 transition 组件冲突的bug -->
              <component :is="Component" :key="route.fullPath" />
            </div>
            <!-- </keep-alive> -->
          </Transition>
        </RouterView>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useHomeStore } from '@/stores';
import { storeToRefs } from 'pinia'

import CnIcon from '@/components/cn-page/CnIcon.vue'

const store = useHomeStore()
const { breadcrumbList } = storeToRefs(store)
</script>

<style lang="scss" scoped>
$--content-padding: 20px;
$--breadcrumb-height: 40px;

.content-root {
  padding: $--content-padding;
  padding-top: 0px;
  flex: 1;

  background-color: var(--system-container-background);
}

.container {
  padding: $--content-padding;
  height: calc(100% - (($--content-padding * 2) + $--breadcrumb-height));

  background-color: #fff;
}

.cn-breadcrumb {
  line-height: $--breadcrumb-height;
}
</style>
