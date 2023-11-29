<template>
  <router-link :to="value.path">
    <div :class="['tab-item-root', active ? 'active' : '']">
      <div class="tab-item-title mr-md truncated">{{ value.title }}</div>
      <el-icon size="12px"><Close /></el-icon>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import type { TabItem } from '@/layout/tabs/type'

const props = defineProps<{
  value: TabItem,
  active: boolean
}>()

const handleTabClick = () => {}
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
