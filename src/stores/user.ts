import { ref } from 'vue'
import { defineStore } from 'pinia'
import { clearToken, getToken } from '@/utils/auth'

import type { UserInfo } from '@/api'
import type { Menu } from '@/layout/type'

const storeSetup = () => {
  const token = ref(getToken() || '')
  // 重置token
  const resetToken = () => {
    token.value = ''
    clearToken()
  }

  const userInfo = ref<UserInfo>({})
  function updateUserInfo(info: UserInfo) {
    userInfo.value = info
  }
  function getLoginInfo(info: UserInfo) {
    userInfo.value = info
  }

  const authButtons = ref<Menu[]>([])
  function updateAuthButtions(list: Menu[]) {
    authButtons.value = list
  }

  // 获取用户信息
  const getUserInfo = () => {}

  // 退出
  const logout = async () => {
    token.value = ''
  }
  return { token, userInfo, authButtons, logout, resetToken, updateUserInfo, getLoginInfo, updateAuthButtions }
}

export const useUserStore = defineStore('user', storeSetup, {
  persist: { paths: ['userInfo', 'authButtons'] }
})
export const useLoginStore = defineStore('loginInfo', storeSetup, {
  persist: { paths: ['userInfo'] }
})
