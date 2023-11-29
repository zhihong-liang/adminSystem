<template>
  <router-link :to="value.path">
    <div :class="['tab-item-root', isActive ? 'active' : '']">
      <div class="tab-item-title mr-md truncated">{{ value.title }}</div>
      <el-icon size="12px" @click.prevent="handleCloseTab"><Close /></el-icon>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useHomeStore } from '@/stores/home';
import { storeToRefs } from 'pinia'
import { last } from 'lodash-es'
import { useRouter } from 'vue-router'

import type { TabItem } from '@/layout/tabs/type'

const props = defineProps<{
  value: TabItem,
}>()

const [router, store] = [useRouter(), useHomeStore()]
const { tabList, getActiveTab } = storeToRefs(store)
const { updateTabList } = store

const isActive = computed(() => getActiveTab.value === props.value.path)

const handleCloseTab = () => {
  if (tabList.value.length <= 1) return

  const list: TabItem[] = tabList.value.filter(t => t.path !== props.value.path)
  const lastTab = last(list) as TabItem
  router.push({path: lastTab.path})

  updateTabList(list)
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

  &.active {
    color: var(--system-primary-color);
  }
  .tab-item-title {
    font-size: 14px;

    // overflow: hidden;
    // white-space: nowrap;
    // text-overflow: ellipsis;
  }
}
</style>
