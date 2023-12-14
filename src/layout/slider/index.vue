<template>
  <div class="home_slider">
    <el-scrollbar>
      <el-menu
        class="layoutMenu"
        :default-active="activeMenuItem"
        background-color="var(--system-slider-background)"
        text-color="var(--system-slider-text-color)"
        active-color="var(--system-primary-color)"
        :collapse="collapse"
        :collapse-transition="false"
        :unique-opened="true"
        :router="true"
      >
        <MenuItem v-for="menuItem in menuList" :menu-item="menuItem" />
      </el-menu>
    </el-scrollbar>

    <div class="collapse" @click="updateCollapse">
      <CnIcon :class="collapse ? 'icon_left' : 'icon_right'" html="DArrowLeft" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHomeStore } from '@/stores/home'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import MenuItem from './menuItem.vue'
import CnIcon from '@/components/cn-page/CnIcon.vue'

const [route, store] = [useRoute(), useHomeStore()]

const { collapse, menuList } = storeToRefs(store)


const { updateCollapse } = store

const activeMenuItem = computed(() => route.path as string)
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
