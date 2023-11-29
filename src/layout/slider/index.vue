<template>
  <div class="home_slider" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
    <el-scrollbar>
      <el-menu
        class="layoutMenu"
        :default-active="activeMenuItem"
        background-color="var(--system-slider-background)"
        text-color="var(--system-slider-text-color)"
        active-color="var(--system-primary-color)"
        :collapse-transition="false"
        :collapse="collapse"
      >
        <MenuItem v-for="menuItem in menuList" :menu-item="menuItem" />
      </el-menu>
    </el-scrollbar>

    <div class="collapse" @click="updateCollapse">
      <el-icon>
        <DArrowLeft :class="collapse ? 'icon_left' : 'icon_right'" />
      </el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import { useHomeStore } from '@/stores/home'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import MenuItem from './item.vue'
import { ElMenu, ElScrollbar } from 'element-plus'

import type { MenuItemProps } from './type'

const [route, store] = [useRoute(), useHomeStore()]

const { collapse, menuList } = storeToRefs(store)

const { updateCollapse, updateMenuList } = store

const loading = ref(false)

const activeMenuItem = computed<string>(() => route.path)

const init = () => {
  loading.value = true

  const list: MenuItemProps[] = [
    {
      id: 1,
      parentId: -1,
      children: [],
      icon: 'HomeFilled',
      title: '首页',
      url: '/screenRules',
      path: '/home',
      type: 'menu',
      description: '',
      orderNumber: 1
    },
    {
      id: 110,
      parentId: -1,
      children: [],
      icon: 'Histogram',
      title: '区划管理',
      url: '/division',
      path: '/division',
      type: 'menu',
      description: '区划管理',
      orderNumber: 2
    },
    {
      id: 111,
      parentId: -1,
      children: [],
      icon: 'Histogram',
      title: '日志管理',
      url: '/logManage',
      path: '/log',
      type: 'menu',
      description: '日志管理',
      orderNumber: 3
    }
  ]
  setTimeout(() => {
    updateMenuList(list)
    loading.value = false
  }, 1000)
}

onBeforeMount(() => init())
</script>

<style lang="scss" scoped>
.home_slider {
  background-color: var(--system-slider-background-color);
  height: 100%;

  position: relative;
}

.layoutMenu {
  width: 100%;
  border: none;

  :deep() {
    .el-menu-item,
    .el-sub-menu__title {
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

.collapse {
  position: absolute;
  bottom: 100px;
  right: 0px;

  width: 35px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  border-top-left-radius: 18px;
  border-bottom-left-radius: 18px;
  cursor: pointer;
  color: var(--system-primary-text-color);
  background-color: var(--system-primary-color);

  .icon_left {
    transform: rotate(180deg);
    transition: all 0.5s;
  }
  .icon_right {
    transform: rotate(360deg);
    transition: all 0.5s;
  }
}
</style>
