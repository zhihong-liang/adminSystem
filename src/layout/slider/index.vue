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
        <MenuItem v-for="menuItem in menuList" :menu-item="menuItem" @onClick="handleItemClick" />
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
import { getMenuList } from '@/api'

import MenuItem from './menuItem.vue'
import { ElMenu, ElScrollbar } from 'element-plus'

import type { MenuItemProps } from './type'

const [route, store] = [useRoute(), useHomeStore()]

const { collapse, menuList, tabList } = storeToRefs(store)

const { updateCollapse, updateMenuList, addTabToList } = store

const loading = ref(false)

const activeMenuItem = computed(() => route.path)

const handleItemClick = (item: MenuItemProps) => {
  const { title, path } = item
  const { name = '' } = route
  const tab = { name: name as string, title, path }
  addTabToList(tab)
}

// tab 组件初始化
const tabListInit = () => {
  const { addTabToList } = store
  const { path = '', name = '' } = route  // 先获取当前路由的tab

  const tabExit = !!tabList.value.find(t => t.path === path)

  // TODO tabList、menuList都不存在该路由的数据，则显示404或跳回首页
  if (!tabExit) {
    const exitInMenu = menuList.value.find(item => item.path === path)
    !!exitInMenu && addTabToList({ title: exitInMenu.title, name: name as string, path})
  }
}

const init = () => {
  loading.value = true

  getMenuList({ name: 'admin' })
    .then((res) => {
      res.data.length && updateMenuList(res.data)

      tabListInit()
    })
    .finally(() => (loading.value = false))
}

onBeforeMount(() => !menuList.value.length ? init() : tabListInit())
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
