<template>
  <div class="userCenter-root flex">
    <InfoBox class="mr-lg" v-bind="userFileData">
      <template #center>
        <div class="userinfo flex flex-column flex-center mb-lg">
          <el-avatar class="mb-lg" :size="100">user</el-avatar>

          <div class="flex flex-column flex-center">
            <h2>张珊珊</h2>
            <p>管理员</p>
          </div>
        </div>
      </template>

      <div>
        <el-divider />

        <div class="button-groud">
          <el-button type="primary">基本信息</el-button>
          <el-button type="primary">授权信息</el-button>
        </div>
      </div>
    </InfoBox>

    <div class="info-root">
      <InfoBox class="mb-lg" v-bind="baseInfoData">
        <template #right>
          <el-button type="primary">编辑</el-button>
        </template>
      </InfoBox>

      <InfoBox v-bind="authorizeInfoData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onUnmounted, reactive } from 'vue'
import { useHomeStore } from '@/stores/home'

import InfoBox from './infoBox.vue'

const { updateContainerStyle } = useHomeStore()

const userFileData = reactive({
  styles: {
    'width': '280px',
    'min-width':  '260px',
    'max-width': '320px'
  },
  formProps: {
    model: {
      unitType: '运营中心',
      unitName: '天河区政务服务中心'
    },
    items: [
      { label: '单位类型', prop: 'unitType', component: 'text', span: 24 },
      { label: '单位名称', prop: 'unitName', component: 'text', span: 24 }
    ]
  }
})

const baseInfoData = reactive({
  title: '基础信息',
  formProps: {
    model: {
      name: '运营中心',
      loginPhone: '系统管理员',
      email: 'asijoiwmxc@email.com',
      unitType: '天河区政务服务中心',
      phone: '天河区（本单位、本级同类、下级同类）',
      status: '启用'
    },
    items: [
      { label: '用户编号', prop: 'name', component: 'text', span: 8 },
      { label: '登录手机号', prop: 'loginPhone', component: 'text', span: 8 },
      { label: '电子邮箱', prop: 'email', component: 'text', span: 8 },
      { label: '用户名称', prop: 'unitType', component: 'text', span: 8 },
      { label: '联系电话', prop: 'phone', component: 'text', span: 8 },
      { label: '状态', prop: 'status', component: 'text', span: 8 }
    ]
  }
})

const authorizeInfoData = reactive({
  title: '授权信息',
  formProps: {
    model: {
      unitType: '运营中心',
      role: '系统管理员',
      job: '管理员',
      unitName: '天河区政务服务中心',
      data: '天河区（本单位、本级同类、下级同类）',
      feature:
        '首页、个人中心、设备管理、菜单管理、用户管理、角色管理、首页、个人中心、设备管理、菜单管理、用户管理、角色管理、首页、个人中心、设备管理、菜单管理、用户管理、角色管理、首页、个人中心、设备管理、菜单管理、用户管理、角色管理、首页、个人中心、设备管理、菜单管理、用户管理、角色管理、首页、个人中心、设备管理、菜单管理、用户管理、角色管理、'
    },
    items: [
      { label: '单位类型', prop: 'unitType', component: 'text', span: 8 },
      { label: '角色', prop: 'role', component: 'text', span: 8 },
      { label: '岗位', prop: 'job', component: 'text', span: 8 },
      { label: '单位', prop: 'unitName', component: 'text', span: 8 },
      { label: '数据权限', prop: 'data', component: 'text', span: 8 },
      { label: '功能权限', prop: 'feature', component: 'text', span: 24 }
    ]
  }
})

onBeforeMount(() => {
  updateContainerStyle({
    'background-color': 'var(--system-container-background)',
    padding: '0px'
  })
})

onUnmounted(() => {
  updateContainerStyle({})
})
</script>

<style lang="scss" scoped>
.userCenter-root {
  height: 100%;

  .info-root {
    flex: 1;
  }
}
:deep(.el-mail) {
  display: block !important;
}
</style>
