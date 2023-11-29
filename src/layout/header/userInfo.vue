<template>
  <div class="mr-lg flex flex-center">
    <el-avatar class="mr-lg" :size="40" :src="circleUrl" />

    <div class="userDetail">
        <span class="userName">Admin</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const circleUrl = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

import { ElAvatar } from 'element-plus'
</script>

<style lang="scss" scoped>
.userDetail {
    .userName {
        color: var(--system-primary-text-color)
    }
}
</style>
