<template>
  <template v-if="!isHideMenu">
    <el-sub-menu v-if="isMenu" :key="menuItem.id" :index="menuIndex">
      <template #title>
        <DynamicIcon v-if="menuItem.icon" :html="menuItem.icon" />
        <span>{{ menuItem.name }}</span>
      </template>

      <menu-item v-for="item in menuItem.childList" :menu-item="item" />
    </el-sub-menu>

    <router-link v-if="isDirt" :to="menuItem.path!">
      <el-menu-item
        :index="menuIndex"
        @click="handleMenuItemClick"
        style="{--el-menu-hover-bg-color: var(--system-slider-hover-background)}"
      >
        <DynamicIcon v-if="menuItem.icon" :html="menuItem.icon" />
        <template #title>{{ menuItem.name }}</template>
      </el-menu-item>
    </router-link>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHomeStore } from '@/stores/home'
import { storeToRefs } from 'pinia'

import DynamicIcon from './dynamicIcon.vue'

import type { Menu } from './type'

const store = useHomeStore()
const { menuList } = storeToRefs(store)
const { addTabToList, updateActiveTab, updateBreadcrumb } = store

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

// 处理面包屑数据
function filterMenu(list: Array<string>) {
  let array: Menu[] = [...menuList.value]

  return list.map((title: string) => {
    const target = array.find((menu) => menu.path === title)
    const { id, path = '', name = '', type, childList = [] } = target || {} as Menu

    array = childList

    return { path, name, id, type }
  })
}

const handleMenuItemClick = (instance: any) => {
  // 更新面包屑
  const { indexPath = [] } = instance || {}
  updateBreadcrumb(filterMenu(indexPath))

  // 更新tab
  const { name, id, path } = props.menuItem
  const tab = { name, id, path: path as string }
  addTabToList(tab)
  updateActiveTab(id as number)

  // emits('onClick', props.menuItem)
}
</script>

<style lang="scss" scoped>

.el-menu-item {
  padding: 0 5px;
  &:hover {
    background-color: var(--system-primary-color);
  }
  &.is-active {
    background-color: var(--system-primary-color);
    color: var(--system-primary-text-color);
  }
}
</style>
