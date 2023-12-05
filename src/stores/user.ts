import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import { setToken, clearToken, getToken } from '@/utils/auth'

const storeSetup = () => {

  const token = ref(getToken() || '')
  const userInfo = ref({})

  // 重置token
  const resetToken = () => {
    token.value = ''
    clearToken()
  }

  // 获取用户信息
  const getUserInfo = async () => {
    //  const res = await getUserInfoApi()
  }

  // 退出
  const logout = async () => {
    token.value = ''
  }
  return { token, logout, resetToken }
}



export const useUserStore = defineStore('user', storeSetup, {
  persist: { paths: ['token'], storage: localStorage }
})
