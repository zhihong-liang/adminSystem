<template>
  <div class="userCenter-root flex" v-loading="loading">
    <InfoBox class="mr-lg" v-bind="userFileData" :width="280">
      <template #center>
        <div class="userinfo flex flex-column flex-center mb-lg">
          <!-- <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          > -->
          <el-avatar
            class="mb-lg"
            :size="100"
            :src="userFileData.formProps.model.headImage"
            @error="() => !!userFileData.formProps.model.headImage"
          >
            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
          </el-avatar>
          <!-- </el-upload> -->

          <div class="flex flex-column flex-center">
            <h2>{{ userFileData.formProps.model.userName || '--' }}</h2>
            <p>{{ userFileData.formProps.model.postName || '--' }}</p>
          </div>
        </div>
      </template>

      <div>
        <el-divider />

        <div class="button-groud">
          <div class="infoItem active">基本信息</div>
          <div class="infoItem">授权信息</div>
        </div>
      </div>
    </InfoBox>

    <div class="rightPane-root">
      <InfoBox class="mb-lg" v-bind="baseInfoData">
        <template #right>
          <el-button :type="baseInfoData.edit ? 'info' : 'primary'" @click="handleEdit">{{
            baseInfoData.edit ? '取消' : '编辑'
          }}</el-button>
          <el-button
            v-show="baseInfoData.edit"
            type="primary"
            @click="() => handleUpdataUserInfo(baseInfoData.formProps.model)"
            >保存</el-button
          >
        </template>
      </InfoBox>

      <InfoBox v-bind="authorizeInfoData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onUnmounted, reactive, ref } from 'vue'
import { useHomeStore, useUserStore } from '@/stores'
import { updateUserInfo as queryUpdateUserInfo, queryUserInfo, type UserInfo } from '@/api'
import { storeToRefs } from 'pinia'

import InfoBox from './infoBox.vue'

import type { InfoBoxProps } from './infoBox.vue'

const [homeStore, userStore] = [useHomeStore(), useUserStore()]
const { userInfo } = storeToRefs(userStore)

const { updateContainerStyle } = homeStore
const { updateUserInfo } = userStore

const loading = ref(false)

const userFormPropsModel = computed(() => {
  return {
    userName: userInfo.value.userName,
    postName: userInfo.value.postName,
    headImage: userInfo.value.headImage,
    unitType: userInfo.value.unitType,
    unitName: userInfo.value.unitName
  }
})
const userFileData = reactive<InfoBoxProps>({
  formProps: {
    model: userFormPropsModel.value,
    items: [
      { label: '单位类型', prop: 'unitType', span: 24 },
      { label: '单位名称', prop: 'unitName', span: 24 }
    ]
  }
})

const baseFormPropsModel = computed(() => {
  return {
    userNo: userInfo.value.userNo,
    phone: userInfo.value.phone,
    email: userInfo.value.email,
    unitType: userInfo.value.unitType,
    telephone: userInfo.value.telephone,
    status: userInfo.value.status
  }
})
const baseInfoData = reactive<InfoBoxProps>({
  title: '基础信息',
  edit: false,
  formProps: {
    prevModel: {},
    model: { ...baseFormPropsModel.value },
    items: [
      { label: '用户编号', prop: 'userNo', component: undefined, span: 8 },
      {
        label: '登录手机号',
        prop: 'phone',
        component: undefined,
        span: 8
      },
      {
        label: '用户名称',
        prop: 'unitType',
        component: undefined,
        span: 8
      },
      { label: '联系电话', prop: 'telephone', component: 'input', span: 8 },
      { label: '电子邮箱', prop: 'email', component: 'input', span: 8 },
      {
        label: '状态',
        prop: 'status',
        component: undefined,
        span: 8,
        dict: 'MENU_STATUS'
      }
    ],
    rules: {
      telephone: [{ required: true, message: '请输入联系电话' }]
    }
  }
})

const authFormPropsModel = computed(() => {
  return {
    unitType: userInfo.value.unitType,
    roleName: '系统管理员',
    postName: '管理员',
    unitName: '天河区政务服务中心',
    data: '天河区（本单位、本级同类、下级同类）',
    feature:
      '首页、个人中心、设备管理、菜单管理、用户管理、角色管理、首页、个人中心、设备管理、菜单管理、用户管理、角色管理、首页、个人中心、设备管理、菜单管理、用户管理、角色管理、首页、个人中心、设备管理、菜单管理、用户管理、角色管理、首页、个人中心、设备管理、菜单管理、用户管理、角色管理、首页、个人中心、设备管理、菜单管理、用户管理、角色管理、'
  }
})
const authorizeInfoData = reactive<InfoBoxProps>({
  title: '授权信息',
  formProps: {
    model: authFormPropsModel.value,
    items: [
      { label: '单位类型', prop: 'unitType', span: 8 },
      { label: '角色', prop: 'roleName', span: 8 },
      { label: '岗位', prop: 'postName', span: 8 },
      { label: '单位', prop: 'unitName', span: 8 },
      { label: '数据权限', prop: 'data', span: 8 },
      { label: '功能权限', prop: 'feature', span: 24 }
    ]
  }
})

function handleEdit() {
  baseInfoData.edit = !baseInfoData.edit

  const { prevModel, model } = baseInfoData.formProps as any

  if (baseInfoData.edit) {
    baseInfoData.formProps.prevModel = { ...model }
  } else {
    baseInfoData.formProps.model = { ...prevModel }
  }
}

function handleUpdataUserInfo(params: UserInfo) {
  const _params = {
    id: userInfo.value.id,
    phone: params.phone,
    email: params.email
  }
  queryUpdateUserInfo(_params).then((res) => {
    const { code } = res

    if (code === '200') {
      baseInfoData.edit = false
      getUserDetail(_params.id as number)
    }
  })
}

function getUserDetail(id: number) {
  loading.value = true

  queryUserInfo(id)
    .then((res) => {
      const { code, data } = res

      if (code === '200') {
        updateUserInfo(data)
      }
    })
    .finally(() => (loading.value = false))
}

onBeforeMount(() => {
  updateContainerStyle({
    'background-color': 'var(--system-container-background)',
    padding: '0px'
  })

  getUserDetail(Number(userInfo.value.id))
})

onUnmounted(() => {
  updateContainerStyle({})
})
</script>

<style lang="scss" scoped>
.userCenter-root {
  height: 100%;

  .rightPane-root {
    flex: 1;
  }
}
:deep(.el-mail) {
  display: block !important;
}

.infoItem {
  line-height: 35px;
  padding-left: 20px;
  color: black;
  border-radius: 5px;
}

.active {
  background-color: #2974d8;
  color: #fff;
}
</style>
