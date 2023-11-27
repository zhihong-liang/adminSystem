<template>
  <div style="height: 100vh" class="baseLayout">
    <el-container style="flex: none">
      <!-- 头部 -->
      <el-header height="70px">
        <Header />
      </el-header>
    </el-container>

    <el-container class="cn_container ofh">
      <!-- 侧边栏 -->
      <el-aside>
        <Slider />
      </el-aside>

      <!-- 内容 -->
      <el-main class="flex flex-column">
        <!-- tabs组件 -->
        <Tabs />

        <!-- 显示内容组件 -->
        <Content />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ElContainer, ElHeader, ElAside, ElMain } from 'element-plus'

import Content from '@/layout/content/index.vue'
import Slider from '@/layout/slider/index.vue'
import Header from '@/layout/header/index.vue'
import Tabs from '@/layout/tabs/index.vue'
</script>

<style scoped>
.baseLayout {
  display: flex;
  flex-direction: column;
}
</style>
