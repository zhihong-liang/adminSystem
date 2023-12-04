<template>
  <div class="tabs-root">
    <el-scrollbar>
      <div class="flex">
        <tab-item
          v-for="item in tabList"
          :key="item.name"
          :value="item"
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
const { tabList } = storeToRefs(store)

// const handleTabClose = (item) => {
//   if (tabList.value.length <= 1) return
//   const list: TabItem[] = tabList.value.filter((t) => t.path !== props.value.path)
//   const { id, path } = last(list) as TabItem
// }
</script>

<style lang="scss" scoped>
.tabs-root {
  height: 40px;
  background-color: #fff;
  border-bottom: 1px solid #e7eaef;
}
</style>
