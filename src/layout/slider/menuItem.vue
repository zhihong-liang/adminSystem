<template>
  <div class="slider-item" v-if="!isHideMenu">
    <template v-if="menuItem.childList && menuItem.childList.length">
      <el-sub-menu :key="menuItem.id" :index="menuItem.path">
        <template #title>
          <template v-if="menuItem.icon">
            <DynamicIcon :html="menuItem.icon"/>
          </template>
          <span>{{ menuItem.name }}</span>
        </template>

        <menu-item v-for="item in menuItem.childList" :menu-item="item" />
      </el-sub-menu>
    </template>

    <router-link v-else :to="(menuItem.path as string)" @click="handleRouterLinkClick(menuItem)">
      <el-menu-item :index="menuItem.path">
        <template v-if="menuItem.icon">
          <DynamicIcon :html="menuItem.icon"/>
        </template>
        <template #title>
          <span>{{ menuItem.name }}</span>
        </template>
      </el-menu-item>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { useHomeStore } from '@/stores/home'
import DynamicIcon from './dynamicIcon.vue'

import type { Menu } from './type'

const route = useRoute()
const { addTabToList, updateActiveTab } = useHomeStore()

const props = defineProps<{
  menuItem: Menu
}>()

const emits = defineEmits(['onClick'])

// 是否为隐藏菜单
const isHideMenu = computed(() => (props.menuItem?.status === '0'))

const handleRouterLinkClick = (item: Menu) => {
  const { name, id, path } = item
  const tab = { name, id, path: path as string }

  addTabToList(tab)

  updateActiveTab(id as number)

  emits('onClick', item)
}

onBeforeMount(() => {
  // 为每个菜单路由添加元数据 id，后续需要哪些字段可在这里添加
  route.meta.id = props.menuItem.id?.toString()
})
</script>

<style scoped></style>
