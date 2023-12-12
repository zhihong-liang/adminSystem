<template>
  <div class="mr-lg flex flex-center">
    <el-popover
      placement="bottom"
      trigger="hover"
    >
      <template #reference>
        <el-avatar class="mr-lg" :size="40" :src="circleUrl" />
      </template>

      <div class="flex flex-center">
        <el-button :text="true" @click="handleLogOut">退出登录</el-button>
      </div>
    </el-popover>

    <div class="userDetail">
      <span class="userName">{{ store.userInfo.userName }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const circleUrl = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

import { ElAvatar } from 'element-plus'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
import { clearToken } from '@/utils/auth'

const [router, store] = [useRouter(), useUserStore()]

function handleLogOut() {
  clearToken()
  store.updateUserInfo({})
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.userDetail {
  .userName {
    color: var(--system-primary-text-color);
  }
}
</style>
