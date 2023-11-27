<template>
  <div class="home_slider" :style="{ width: 280 }">
    <el-scrollbar>
      <el-menu
        default-active="1"
        class="layoutMenu"
        background-color="var(--system-slider-background)"
        text-color="var(--system-slider-text-color)"
        active-text-color="var(--system-primary-color)"
        :collapse="isCollapse"
        @open="handleOpen"
        @close="handleClose"
      >
        <MenuItem v-for="menuItem in menus" :menu-item="menuItem"></MenuItem>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMenu, ElScrollbar } from 'element-plus'
import MenuItem from './item.vue'
import type { ItemProps } from './type'

const menus = ref<ItemProps[]>([
  {
    id: 1,
    parentId: -1,
    children: [],
    icon: 'HomeFilled',
    title: '首页',
    href: '/screenRules',
    spread: false,
    path: '/home',
    code: 'screenRules',
    type: 'menu',
    attr1: 'screenRules/index',
    attr2: '{}',
    attr3: '{}',
    description: '',
    orderNum: 81
  },
  {
    id: 110,
    parentId: -1,
    children: [],
    icon: 'Histogram',
    title: '区划管理',
    href: '/division',
    spread: false,
    path: '/division',
    code: 'Division',
    type: 'menu',
    description: '区划管理',
    orderNum: 1
  },
  {
    id: 111,
    parentId: -1,
    children: [],
    icon: 'Histogram',
    title: '日志管理',
    href: '/logManage',
    spread: false,
    path: '/log',
    code: 'logManage',
    type: 'menu',
    description: '日志管理',
    orderNum: 1
  },
])

const isCollapse = computed(() => false)

const handleOpen = () => {}

const handleClose = () => {}
</script>

<style lang="scss" scoped>
.home_slider {
  background-color: var(--system-slider-background-color);
  height: 100%;
  width: 300px;
}

.layoutMenu {
  width: 100%;
  border: none;

  :deep() {
    .el-menu-item, .el-sub-menu__title {
      &.is-active {
        background-color: var(--system-primary-color) !important;
        color: var(--system-primary-text-color) !important;
        i {
          color: var(--system-primary-text-color) !important;
        }
        &:hover {
          background-color: var(--system-primary-color) !important;
          color: var(--system-primary-text-color) !important;
        }
      }
      &:hover {
        background-color: var(--system-slider-hover-background) !important;
      }
    }
  }
}
</style>
