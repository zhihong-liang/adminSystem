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
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { ElScrollbar } from 'element-plus'
import { useHomeStore } from '@/stores/home'
import { useRoute } from 'vue-router'

import TabItem from './tabItem.vue'

const [route, store] = [useRoute(), useHomeStore()]
const { tabList, menuList } = storeToRefs(store)

// tab 组件初始化
const tabListInit = () => {
  const { addTabToList } = store
  const { path = '', name = '' } = route // 先获取当前路由的tab

  const tabExit = !!tabList.value.find((t) => t.path === path)

  // TODO tabList、menuList都不存在该路由的数据，则显示404或跳回首页
  if (!tabExit) {
    const exitInMenu = menuList.value.find((item) => item.path === path)
    !!exitInMenu && addTabToList({ id: exitInMenu.id, name: name as string, path })
  }
}

onMounted(() => {
  tabListInit()
})
</script>

<style lang="scss" scoped>
.tabs-root {
  height: 40px;
  background-color: #fff;
  border-bottom: 1px solid #e7eaef;
}
</style>
