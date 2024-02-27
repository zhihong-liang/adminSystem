<template>
  <div class="login">
    <el-row class="login-box">
      <el-col :xs="0" :sm="12" :md="15">
        <div class="login-left">
          <img class="login-img" src="@/assets/svgs/login-img.svg" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="9">
        <div class="login-right">
          <el-form
            ref="FormRef"
            :model="form"
            :rules="rules"
            :style="{ width: '84%' }"
            :label-col-style="{ display: 'none' }"
            :wrapper-col-style="{ flex: 1 }"
          >
            <h3 class="login-form-title">
              <img class="logo" src="../../assets/images/logo.png" /><span>自助政务服务平台</span>
            </h3>
            <el-form-item prop="username">
              <el-input v-model="form.username" placeholder="账号" clearable>
                <template #prefix>
                  <el-icon class="el-input__icon"><User /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="form.password"
                placeholder="密码"
                type="password"
                show-password
                clearable
              >
                <template #prefix>
                  <el-icon class="el-input__icon"><Lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <div class="checked_password">
                <el-checkbox v-model="form.remember">记住密码</el-checkbox>
                <a>忘记密码</a>
              </div>
            </el-form-item>
            <el-row>
              <el-col :span="24">
                <el-button type="primary" @click="handleLogin" class="full-btn">登录</el-button>
              </el-col>
              <el-col :span="24">
                <el-button text="plain" class="full-btn register-btn">注册账号</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-col>
    </el-row>

    <LoginBg></LoginBg>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
// import { useLoading } from '@/hooks'
import { ElMessage as Message } from 'element-plus'
import LoginBg from './components/LoginBg/index.vue'
import { setToken } from '@/utils/auth'
import { useLoginStore, useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
import CryptoJS from 'crypto-js'
import { login } from '@/api'
import { queryAreaAll } from '@/hooks/useDivision'

const [router, userStore, loginInfo] = [useRouter(), useUserStore(), useLoginStore()]

const { updateUserInfo } = userStore
const { getLoginInfo } = loginInfo

const form = reactive({
  username: localStorage.getItem('userName') || '',
  password: localStorage.getItem('password') || '',
  remember: Boolean(localStorage.getItem('remember')) || false
})

const rules = reactive({
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

// 登录加载
// const { loading, setLoading } = useLoading()
const errorMessage = ref('')
const FormRef = ref<any>()
// 点击登录
const handleLogin = async () => {
  const key = CryptoJS.enc.Utf8.parse('nanshagrid1@3456')
  const password = CryptoJS.AES.encrypt(form.password, key, {
    iv: key,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString()
  FormRef.value.validate((valid: boolean) => {
    if (valid) {
      login({
        userName: form.username,
        password: password
      }).then(async (res) => {
        if (res.data.isAuth === '1') {
          setToken(res.data.accessToken)
          updateUserInfo(res.data)
          getLoginInfo(res.data)
          // localStorage.setItem('userInfo', JSON.stringify(res.data))
          if (form.remember) {
            localStorage.setItem('userName', form.username)
            localStorage.setItem('password', form.password)
            localStorage.setItem('remember', form.remember ? '1' : '0')
          } else {
            localStorage.removeItem('username')
            localStorage.removeItem('password')
            localStorage.removeItem('remember')
          }
          Message.success('登录成功')
          queryAreaAll()

          router.push('/system/usercenter') // 默认跳到个人中心
        } else if (res.data.isAuth === '0') {
          router.push('/noauth?a=' + form.username)
        }
      })
    }
  })
}
</script>

<style lang="scss" scoped>
.register-btn,
.register-btn:hover {
  color: var(--color-text-2);
}

.login-form-title {
  color: var(--color-text-1);
  font-weight: 500;
  font-size: 20px;
  line-height: 32px;
  margin-bottom: 20px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  .logo {
    width: 32px;
    height: 32px;
    margin-right: 6px;
  }
}

.theme-btn {
  position: fixed;
  top: 20px;
  left: 30px;
  z-index: 9999;
}

.login {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  &-box {
    width: 86%;
    max-width: 720px;
    height: 380px;
    display: flex;
    z-index: 999;
    box-shadow: 0 2px 4px 2px rgba(0, 0, 0, 0.08);
  }
}

.login-left {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(60deg, rgb(22, 93, 255), rgb(148, 191, 255));
  .login-img {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    transition: all 0.3s;
    object-fit: cover;
  }
}

.login-right {
  width: 100%;
  height: 100%;
  background: var(232, 243, 255);
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 30px;
  box-sizing: border-box;
}

.checked_password {
  width: 100%;
  display: flex;
  justify-content: space-between;
  a {
    color: #409eff;
  }
}

.full-btn {
  width: 100%;
}
</style>
