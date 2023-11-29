<template>
  <div class="slider-item" v-if="isHideMenu">
    <template v-if="menuItem.children && menuItem.children.length">
      <el-sub-menu :key="menuItem.id" :index="menuItem.id.toString()">
        <template #title>
          <template v-if="menuItem.icon">
            <el-icon>
              <component :is="menuItem.icon"></component>
            </el-icon>
          </template>
          <span>{{ menuItem.title }}</span>
        </template>

        <menu-item v-for="item in menuItem.children" :menu-item="item"></menu-item>
      </el-sub-menu>
    </template>

    <router-link v-else :to="menuItem.path" @click="handleRouterLinkClick(menuItem)">
      <el-menu-item :index="menuItem.path.toString()">
        <template v-if="menuItem.icon">
          <el-icon>
            <component :is="menuItem.icon"></component>
          </el-icon>
        </template>
        <template #title>
          <span>{{ menuItem.title }}</span>
        </template>
      </el-menu-item>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElSubMenu, ElMenuItem } from 'element-plus'

import type { MenuItemProps } from './type'

const props = defineProps<{
  menuItem: MenuItemProps
}>()

const emits = defineEmits(['onClick'])

// 是否为隐藏菜单
const isHideMenu = computed(() => (!!props.menuItem?.hideMenu ? false : true))

const handleRouterLinkClick = (item: MenuItemProps) => {
  emits('onClick', item)
}
</script>

<style scoped></style>
