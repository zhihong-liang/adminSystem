<template>
  <div class="tabs-root">
    <el-scrollbar>
      <div class="flex">
        <tab-item
          v-for="item in tabList"
          :key="item.name"
          :value="item"
          :active="item.path === currentActiveTabPath"
        />
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ElScrollbar } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useHomeStore } from '@/stores/home'

import TabItem from './tabItem.vue'

const store = useHomeStore()
const { tabList, currentActiveTabPath } = storeToRefs(store)
</script>

<style lang="scss" scoped>
.tabs-root {
  height: 40px;
  background-color: #fff;
  border-bottom: 1px solid #e7eaef;
}
</style>
