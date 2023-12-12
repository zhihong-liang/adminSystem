import { ref } from 'vue'
import { defineStore } from 'pinia'
import { clearToken, getToken } from '@/utils/auth'
import type { UserInfo } from '@/api'

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

  // 获取用户信息
  const getUserInfo = async () => {
    //  const res = await getUserInfoApi()
  }

  // 退出
  const logout = async () => {
    token.value = ''
  }
  return { token, userInfo, logout, resetToken, updateUserInfo }
}

export const useUserStore = defineStore('user', storeSetup, {
  persist: { paths: ['userInfo'] }
})
