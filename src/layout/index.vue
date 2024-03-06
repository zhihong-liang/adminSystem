<template>
  <div class="baseLayout">
    <el-container style="flex: none">
      <el-header height="64px">
        <Header />
      </el-header>
    </el-container>

    <el-container class="cn_container ofh">
      <el-aside :width="finalWidth">
        <Slider />
      </el-aside>

      <el-main class="flex flex-column">
        <Tabs />
        <Content />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useHomeStore } from '@/stores/home'

import { ElContainer, ElHeader, ElAside, ElMain } from 'element-plus'
import Content from '@/layout/content/index.vue'
import Slider from '@/layout/slider/index.vue'
import Header from '@/layout/header/index.vue'
import Tabs from '@/layout/tabs/index.vue'

const store = useHomeStore()
const { collapse } = storeToRefs(store)

const finalWidth = computed(() => (collapse.value ? '64px' : '240px'))
</script>

<style scoped>
.baseLayout {
  display: flex;
  flex-direction: column;

  height: 100vh;
}
</style>
