<script setup lang="ts">
import { computed } from 'vue'
import { ElConfigProvider } from 'element-plus'
import { RouterView } from 'vue-router'
import { useHomeStore } from '@/stores'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { queryAreaAll } from '@/hooks/useDivision'

const { updateModules } = useHomeStore()
const local = computed(() => zhCn)

const modules = import.meta.glob('./views/**/*.vue')

const components = Object.keys(modules).reduce<Record<string, any>>((prev, cur) => {
  prev[cur.replace('.', '')] = modules[cur]
  return prev
}, {})

updateModules(components)

queryAreaAll()
</script>

<template>
  <el-config-provider :locale="local">
    <RouterView />
  </el-config-provider>
</template>

<style lang="scss">
@import 'element-plus/theme-chalk/src/message.scss';
@import 'element-plus/theme-chalk/src/message-box.scss';
</style>
