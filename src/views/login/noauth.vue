<template>
  <div class="wrap">
    <div class="row1" v-if="account">登录账号：{{ account || '' }}</div>
    <div class="row2">
      <el-icon class="icon"><SuccessFilled /></el-icon>登录成功
    </div>
    <div class="row3">您的账号目前还没有任何权限，需要申请权限才可以使用对应的功能</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SuccessFilled } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const account: any = ref('')
account.value = route.query.a
</script>

<style scoped lang="scss">
.row1 {
  margin-top: 30vh;
}
.row2 {
  margin: 30px;
  font-weight: bold;
  .icon {
    color: #67c23a;
    margin-right: 10px;
    position: relative;
    top: 3px;
    font-size: 18px;
  }
}
.wrap {
  width: 100%;
  height: 100vh;
  text-align: center;
}
</style>
