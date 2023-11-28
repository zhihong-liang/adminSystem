<script setup lang="ts">
import { computed } from 'vue'
import { ElConfigProvider } from 'element-plus'
import { RouterView } from 'vue-router'

import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const local = computed(() => zhCn)
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
