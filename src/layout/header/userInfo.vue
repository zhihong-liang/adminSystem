<template>
  <div class="mr-lg flex flex-center">
    <el-dropdown>
      <div class="el-dropdown-link sculpture">
        <el-avatar class="mr-lg" :size="40" :src="avatarImage" />
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-if="roleIdList.length > 1">
            <div class="flex flex-center">
              <el-button :text="true" @click="switchRoles">切换角色</el-button>
            </div>
          </el-dropdown-item>
          <el-dropdown-item>
            <div class="flex flex-center">
              <el-button :text="true" @click="handleLogOut">退出登录</el-button>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <div class="userDetail">
      <span class="userName">{{ store.userInfo.userName }}</span>
    </div>
  </div>
  <CnDialog ref="dialogRef" v-bind="dialogProps">
    <template #footer>
      <el-button type="primary" @click="handleScreen">确定</el-button>
    </template>
  </CnDialog>
  <!-- <div v-if="roleDia"></div> -->
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElAvatar } from 'element-plus'
import { useUserStore, useHomeStore, useLoginStore } from '@/stores'
import { useRouter } from 'vue-router'
import { clearToken } from '@/utils/auth'
import CnDialog from '@/components/cn-page/CnDialog.vue'
import { getRoleList, userRoleSwitch, getSysMenuTree } from '@/api/admin'
import { ElMessage } from 'element-plus'

const roleList: any = ref([])
const [router, store, menuList, loginInfo] = [
  useRouter(),
  useUserStore(),
  useHomeStore(),
  useLoginStore()
]
const roleIdList = loginInfo.$state.userInfo?.roleIdList || []
const useRoleIdList = loginInfo.$state.userInfo?.useRoleIdList || []

const currentRoleId = loginInfo.$state.userInfo?.currentRoleId
const userId = loginInfo.$state.userInfo?.userId
const dialogRef = ref<InstanceType<typeof CnDialog>>()

const avatarImage = computed(() => store.userInfo.headImage)

const dialogProps = reactive<CnPage.DialogProps>({
  title: '角色切换',
  formProps: {
    model: {
      currentRoleId: currentRoleId
    },
    colSpan: 12,
    items: [
      {
        label: '选择角色',
        prop: 'currentRoleId',
        span: 24,
        component: 'radio',
        props: {
          options: roleList
        }
      }
    ]
  }
})

function handleLogOut() {
  clearToken()
  store.updateUserInfo({})
  loginInfo.getLoginInfo({})
  router.push('/login')
}
function switchRoles() {
  const params = {
    obj: {},
    page: 1,
    size: 999
  }
  getRoleList(params).then((res: any) => {
    if (res.code === '200') {
      roleList.value = []
      res.rows.map((item: any) => {
        item.label = item.name
        item.value = item.id
        if (!useRoleIdList.includes(item.id)) {
          item.disabled = true
        }

        for (let index = 0; index < roleIdList.length; index++) {
          const element = roleIdList[index]
          if (item.id === element) {
            roleList.value.push(item)
          }
        }
      })
      dialogRef.value?.open()
    }
  })
}
function handleScreen() {
  if (currentRoleId === dialogProps.formProps!.model.currentRoleId) {
    ElMessage({
      type: 'error',
      message: '您选择的角色为当前登录角色'
    })
  } else {
    const params = {
      id: userId,
      currentRoleId: dialogProps.formProps!.model.currentRoleId
    }
    userRoleSwitch(params).then((res: any) => {
      if (res.code === '200') {
        ElMessage({
          type: 'success',
          message: res.message
        })

        getSysMenuTree({
          currentRoleId: dialogProps.formProps!.model.currentRoleId
        }).then((tree) => {
          menuList.updateMenuList(tree.data)
        })
        loginInfo.getLoginInfo(res.data)
        router.push('/system/usercenter')
        dialogRef.value?.close()
        setTimeout(() => {
          location.reload()
        }, 100)
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.sculpture {
  margin-right: 10px;
  span {
    position: relative;
    left: 10px;
  }
}
.userDetail {
  .userName {
    color: var(--system-primary-text-color);
  }
}
</style>
