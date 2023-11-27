<template>
  <div class="slider-item" v-if="isHideMenu">
    <template v-if="menuItem.children.length">
      <el-sub-menu :key="menuItem.id" :index="menuItem.id.toString()">
        <template #title>
          <template v-if="menuItem.icon">
            <el-icon>
              <component :is="menuItem.icon"></component>
            </el-icon>
          </template>
          <span>{{ menuItem.title }}</span>
        </template>

        <Item v-for="item in menuItem.children" :menu-item="item"></Item>
      </el-sub-menu>
    </template>

    <router-link v-else :to="menuItem.path" >
        <el-menu-item :index="menuItem.id.toString()">
          <template v-if="menuItem.icon">
            <el-icon>
              <component :is="menuItem.icon"></component>
            </el-icon>
          </template>
          <span>{{ menuItem.title }}</span>
        </el-menu-item>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElSubMenu, ElMenuItem } from 'element-plus'

import type { ItemProps } from './type'

const props = defineProps<{
  menuItem: ItemProps
}>()

// 是否为隐藏菜单
const isHideMenu = computed(() => (!!props.menuItem?.hideMenu ? false : true))
</script>

<style lang="scss" scoped>
.slider-item {
  > a {
    text-decoration: none;
  }
}
</style>
