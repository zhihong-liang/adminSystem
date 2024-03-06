<template>
  <div class="content-root ofh">
    <!-- 面包屑 -->
    <div class="flex flex-between">
      <div class="flex flex-center">
        <el-button
          v-if="showBackUpButton"
          class="mr-lg"
          icon="Back"
          @click="router.back"
        >
          返回
        </el-button>
        <el-breadcrumb class="cn-breadcrumb" separator="/">
          <el-breadcrumb-item v-for="item in breadcrumbList" :key="item.id">{{
            item.name
          }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="flex flex-center">
        <CnIcon size="20px" html="SwitchFilled" />
      </div>
    </div>

    <!-- container -->
    <div class="container ofh" :style="containerStyle">
      <el-scrollbar>
        <RouterView v-slot="{ Component, route }">
          <Transition name="fade-transform" mode="out-in">
            <!-- <keep-alive> -->
            <div class="connect" :key="route.path">
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
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import { useHomeStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

import CnIcon from '@/components/cn-page/CnIcon.vue'

const [route, router, store] = [useRoute(), useRouter(), useHomeStore()]

const showBackUpButton = computed(() => route.meta.status === 0)
const { breadcrumbList, containerStyle } = storeToRefs(store)
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
  // padding: $--content-padding;
  height: calc(100% - ($--breadcrumb-height));

  background-color: #fff;
}

.cn-breadcrumb {
  line-height: $--breadcrumb-height;
}
</style>
