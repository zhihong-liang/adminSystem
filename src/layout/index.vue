<template>
  <div class="baseLayout ofh">
    <el-container style="flex: none">
      <!-- 头部 -->
      <el-header style="padding: 0px;" height="70px"><Header /></el-header>
    </el-container>

    <el-container class="cn_container">
      <!-- 侧边栏 -->
      <el-aside>
        <Slider />
      </el-aside>

      <!-- 内容 -->
      <el-main>
        <!-- 还有个tabs组件 -->
        <Content></Content>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ElContainer, ElHeader, ElAside, ElMain } from 'element-plus'

import Content from '@/layout/content/index.vue'
import Slider from '@/layout/slider/index.vue'
import Header from '@/layout/header/index.vue'
</script>

<style scoped>
.baseLayout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
}
</style>
