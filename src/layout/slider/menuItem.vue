<template>
  <template v-if="!isHideMenu">
    <el-sub-menu v-if="isMenu" :key="menuItem.id" :index="menuIndex">
      <template #title>
        <DynamicIcon v-if="menuItem.icon" :html="menuItem.icon" />
        <span>{{ menuItem.name }}</span>
      </template>

      <menu-item v-for="item in menuItem.childList" :menu-item="item" />
    </el-sub-menu>

    <router-link v-if="isDirt" :to="menuItem.path!" @click="handleRouterLinkClick(menuItem)">
      <el-menu-item :index="menuIndex">
        <DynamicIcon v-if="menuItem.icon" :html="menuItem.icon" />
        <template #title>{{ menuItem.name }}</template>
      </el-menu-item>
    </router-link>
  </template>
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
const isHideMenu = computed(() => props.menuItem?.status === '0')

// 是否为菜单
const isMenu = computed(() => props.menuItem?.type === 'menu')

// 是否为模块
const isDirt = computed(() => props.menuItem?.type === 'dirt')

const menuIndex = computed(() => props.menuItem?.path?.toString())

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
