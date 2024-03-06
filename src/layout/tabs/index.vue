<template>
  <div class="tabs-root">
    <el-scrollbar>
      <div class="flex">
        <tab-item
          v-for="item in tabList"
          :key="item.name"
          :value="item"
          :is-active="activeTab === item.id"
        />
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ElScrollbar } from 'element-plus'
import { useHomeStore } from '@/stores/home'

import TabItem from './tabItem.vue'

const store = useHomeStore()
const { tabList, activeTab } = storeToRefs(store)

</script>

<style lang="scss" scoped>
.tabs-root {
  height: 40px;
  background-color: #93B2D1;
  color: #4E5969;
}
</style>
