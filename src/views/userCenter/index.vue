<template>
  <div class="userCenter-root flex">
    <InfoBox class="mr-lg" v-bind="userFileData">
      <template #center>
        <div class="userinfo flex flex-column flex-center mb-lg">
          <el-avatar class="mb-lg" :size="100">user</el-avatar>

          <div class="flex flex-column flex-center">
            <h2>{{ userFileData.formProps.model.name || '--' }}</h2>
            <p>{{  userFileData.formProps.model.job || '--' }}</p>
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
          <el-button :type="editStatus ? 'info' : 'primary'" @click="handleEdit">{{
            editStatus ? '取消' : '编辑'
          }}</el-button>
          <el-button v-show="editStatus" type="primary" @click="handleSave">保存</el-button>
        </template>
      </InfoBox>

      <InfoBox v-bind="authorizeInfoData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onUnmounted, reactive, ref } from 'vue'
import { useHomeStore } from '@/stores/home'
import { updateUserInfo, type UserInfo } from '@/api'

import InfoBox from './infoBox.vue'

const { updateContainerStyle } = useHomeStore()

const userFileData = reactive<any>({
  width: 280,
  formProps: {
    model: {},
    items: [
      { label: '单位类型', prop: 'unitType', component: 'text', span: 24 },
      { label: '单位名称', prop: 'unitName', component: 'text', span: 24 }
    ]
  }
})

// 基本信息按钮状态
const editStatus = ref(false)

const baseInfoData = reactive({
  title: '基础信息',
  formProps: {
    prevModel: {},
    model: {},
    items: [
      { label: '用户编号', prop: 'name', component: '', span: 8 },
      {
        label: '登录手机号',
        prop: 'loginPhone',
        component: '',
        span: 8
      },
      { label: '电子邮箱', prop: 'email', component: '', span: 8 },
      {
        label: '用户名称',
        prop: 'unitType',
        component: '',
        span: 8
      },
      { label: '联系电话', prop: 'phone', component: '', span: 8 },
      {
        label: '状态',
        prop: 'status',
        component: '',
        span: 8,
        dict: 'MENU_STATUS'
      }
    ]
  }
})

const authorizeInfoData = reactive({
  title: '授权信息',
  formProps: {
    model: {},
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

function handleEdit() {
  editStatus.value = !editStatus.value

  baseInfoData.formProps.items.forEach((item) => {
    if (editStatus.value) {
      item.component = 'input'
      if (item.prop === 'name') item.component = ''
      if (item.prop === 'status') item.component = 'select'
    } else {
      item.component = ''
    }
  })

  const { prevModel, model } = baseInfoData.formProps

  if (editStatus.value) {
    baseInfoData.formProps.prevModel = { ...model }
  } else {
    baseInfoData.formProps.model = { ...prevModel }
  }
}

function handleUpdataUserInfo(params: UserInfo) {
  const _params = { ...params }

  updateUserInfo(_params).then((res) => {
    console.log('res : ', res)
  })
}

function handleSave() {
  handleUpdataUserInfo(baseInfoData.formProps.model)
}

onBeforeMount(() => {
  updateContainerStyle({
    'background-color': 'var(--system-container-background)',
    padding: '0px'
  })

  userFileData.formProps.model = {
    name: '张上上',
    job: '管理员',
    unitType: '运营中心',
    unitName: '天河区政务服务中心'
  }

  baseInfoData.formProps.model = {
    name: '运营中心',
    loginPhone: '系统管理员',
    email: 'asijoiwmxc@email.com',
    unitType: '天河区政务服务中心',
    phone: '天河区（本单位、本级同类、下级同类）',
    status: '0'
  }

  authorizeInfoData.formProps.model = {
    unitType: '运营中心',
    role: '系统管理员',
    job: '管理员',
    unitName: '天河区政务服务中心',
    data: '天河区（本单位、本级同类、下级同类）',
    feature:
      '首页、个人中心、设备管理、菜单管理、用户管理、角色管理、首页、个人中心、设备管理、菜单管理、用户管理、角色管理、首页、个人中心、设备管理、菜单管理、用户管理、角色管理、首页、个人中心、设备管理、菜单管理、用户管理、角色管理、首页、个人中心、设备管理、菜单管理、用户管理、角色管理、首页、个人中心、设备管理、菜单管理、用户管理、角色管理、'
  }
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
