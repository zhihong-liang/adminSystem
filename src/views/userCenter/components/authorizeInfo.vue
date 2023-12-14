<template>
  <InfoBox title="授权信息">
    <template #content>
      <el-tabs v-if="!isSingle" v-model="activeName" class="demo-tabs">
        <el-tab-pane
          v-for="(item, index) in formData"
          :label="`授权${index + 1}`"
          :name="`${activePrefix + (index + 1)}`"
        >
          <CnForm v-bind="item as any" />
        </el-tab-pane>
      </el-tabs>

      <CnForm v-else v-bind="formData" />
    </template>
  </InfoBox>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores'
import { storeToRefs } from 'pinia'
import useDictionary from '@/hooks/useDictionary'
import useDivision from '@/hooks/useDivision'

import InfoBox from './infoBox.vue'

import type { RoleAuthList } from '@/api'

const activePrefix = 'auth_'
const DEFAULT_ITEMS = [
  { label: '单位类型', prop: 'unitType', span: 8, dict: 'UNIT_TYPE' },
  { label: '角色', prop: 'roleName', span: 8 },
  { label: '岗位', prop: 'postName', span: 8 },
  { label: '单位', prop: 'unitName', span: 8 },
  { label: '数据权限', prop: 'digital', span: 8 },
  { label: '功能权限', prop: 'feature', span: 24 }
]

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const activeName = ref(activePrefix + 1)

const isSingle = computed(() => {
  if (userInfo.value.roleAuthList) {
    return userInfo.value.roleAuthList.length <= 1
  } else {
    true
  }
  return true
})

const formData = computed(() => {
  if (userInfo.value.roleAuthList) {
    if (userInfo.value.roleAuthList!.length > 1) {
      return userInfo.value.roleAuthList.map((item: any) => ({
        model: formatData(item),
        items: [...DEFAULT_ITEMS]
      }))
    } else {
      return {
        model: formatData(userInfo.value.roleAuthList[0]),
        items: [...DEFAULT_ITEMS]
      }
    }
  } else {
    return {
      model: {
        unitType: '',
        roleName: '',
        postName: '',
        unitName: '',
        digital: '',
        feature: ''
      },
      items: [...DEFAULT_ITEMS]
    }
  }
})

// 递归取出menulist中的names
function recursion(names: any, list: any) {
  list.forEach((item: any) => {
    names.push(item.name)
    if (item.childList.length) {
      recursion(names, item.childList)
    }
  })
  return names
}

function formatData(value: RoleAuthList) {
  const { unitType, unitName, roleName, postName, userAuthDataList, menuList } = value

  // 功能权限
  let _menuList = ''
  if (menuList && menuList.length) {
    _menuList = recursion([], menuList).join('、')
  }

  // 数据权限
  let _authData = ''
  if (userAuthDataList && userAuthDataList.length) {
    _authData = userAuthDataList
      .map((item) => {
        const premission =
          useDictionary('DATA_PERMISSION_POLICY', (item.dataPermissionPolicy || '').split(','))
            .value || ''
        const region = useDivision(item.regionCode).value || []

        let text = '（' + premission + '）'
        return region.length ? region[0].label + text : '--' + text
      })
      .join('、')
  }

  return {
    unitType,
    unitName,
    postName,
    roleName,
    feature: _menuList,
    digital: _authData
  }
}
</script>

<style scoped></style>
