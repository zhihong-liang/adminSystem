<template>
  <div :class="['tab-item-root', isActive ? 'active' : '']">
    <router-link :to="value.path" @click.prevent="handleTabClick">
      <div class="tab-item-title mr-md truncated">{{ value.name }}</div>
    </router-link>
    <el-icon size="12px" @click.stop="handleCloseTab"><Close /></el-icon>
  </div>
</template>

<script setup lang="ts">
import { useHomeStore } from '@/stores/home'
import { storeToRefs } from 'pinia'
import { last } from 'lodash-es'
import { useRouter } from 'vue-router'

import type { TabItem } from '@/layout/tabs/type'

const props = defineProps<{
  value: TabItem,
  isActive: boolean
}>()

const emits = defineEmits(['close'])

const [router, store] = [useRouter(), useHomeStore()]
const { tabList } = storeToRefs(store)
const { updateTabList, updateActiveTab } = store

const handleTabClick = () => {
  props.value.id && updateActiveTab(props.value.id)
}

const handleCloseTab = () => {
  if (tabList.value.length <= 1) return

  const list: TabItem[] = tabList.value.filter((t) => t.path !== props.value.path)
  const { id, path } = last(list) as TabItem

  updateTabList(list)
  updateActiveTab(id as number)

  router.push({ path })
}
</script>

<style lang="scss" scoped>
.tab-item-root {
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0 20px;
  max-width: 150px;
  line-height: 40px;
  border-right: 1px solid #e7eaef;
  background-color: #fff;

  cursor: pointer;

  &:hover {
    color: var(--system-primary-color);
  }
  & a:hover {
    color: var(--system-primary-color);
  }

  &.active {
    color: var(--system-primary-color);

    & a {
      color: var(--system-primary-color);
    }
  }
  .tab-item-title {
    font-size: 14px;

    // overflow: hidden;
    // white-space: nowrap;
    // text-overflow: ellipsis;
  }
}
</style>
