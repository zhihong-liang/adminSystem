<template>
  <InfoBox class="mb-lg" v-bind="baseInfoData">
    <template #right>
      <el-button :type="edit ? 'info' : 'primary'" @click="handleEdit">{{
        edit ? '取消' : '编辑'
      }}</el-button>
      <el-button
        v-show="edit"
        type="primary"
        @click="() => handleUpdataUserInfo(baseInfoData.formProps.model)"
        >保存</el-button
      >
    </template>
  </InfoBox>
</template>

<script setup lang="ts">
import { computed, reactive, onBeforeMount, ref, watch } from 'vue'
import { useUserStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { updateUserInfo as queryUpdateUserInfo, queryUserInfo, type UserInfo } from '@/api'
import { cloneDeep } from 'lodash-es'

import InfoBox from './infoBox.vue'

const DEFAULT_ITEMS = [
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
]

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const { updateUserInfo } = userStore

const edit = ref(false)

/**
 * 基本信息
 */
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
const baseInfoData = reactive({
  title: '基础信息',
  formProps: {
    prevModel: {},
    model: { ...baseFormPropsModel.value },
    items: cloneDeep(DEFAULT_ITEMS),
    rules: {
      telephone: [{ required: edit, message: '请输入联系电话' }]
    }
  }
})

watch(
  () => edit.value,
  () => {
    transformComponent()
  },
  { immediate: true }
)

function handleEdit() {
  edit.value = !edit.value

  const { prevModel, model } = baseInfoData.formProps as any

  if (edit.value) {
    baseInfoData.formProps.prevModel = { ...model }
  } else {
    baseInfoData.formProps.model = { ...prevModel }
  }
}

function transformComponent() {
  baseInfoData.formProps.items.forEach((item: any, index: number) => {
    if (edit.value) {
      item.component = DEFAULT_ITEMS[index].component
    } else {
      item.component = undefined
    }
  })
}

function handleUpdataUserInfo(params: UserInfo) {
  const _params = {
    id: userInfo.value.id,
    telephone: params.telephone,
    email: params.email
  }
  queryUpdateUserInfo(_params).then((res) => {
    const { code } = res

    if (code === '200') {
      edit.value = false
      getUserDetail(_params.id as number)
    }
  })
}

function getUserDetail(id: number) {
  queryUserInfo(id).then((res) => {
    const { code, data } = res

    if (code === '200') {
      baseInfoData.formProps.model = {
        userNo: data.userNo,
        phone: data.phone,
        email: data.email,
        unitType: data.unitType,
        telephone: data.telephone,
        status: data.status
      }
      updateUserInfo(data)
    }
  })
}

onBeforeMount(async () => {
  await getUserDetail(Number(userInfo.value.id))
})
</script>

<style scoped></style>
