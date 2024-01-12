<template>
  <InfoBox class="mr-lg" v-bind="userFileData">
    <template #center>
      <div class="userinfo flex flex-column flex-center mb-lg">
        <el-upload
          class="avatar-uploader"
          accept=".png,.jpeg,.svg"
          action="/selfHelp/api/file/infra/file/upload"
          :headers="{ Authorization: getToken() }"
          :data="(rawFile: any) => ({ path: rawFile.name })"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <el-avatar
            class="mb-lg"
            :size="100"
            :src="userFileData.formProps.model.headImage"
            @error="() => !!userFileData.formProps.model.headImage"
          >
            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
          </el-avatar>
        </el-upload>

        <div class="flex flex-column flex-center">
          <h2>{{ userFileData.formProps.model?.userName || '--' }}</h2>
          <p>{{ userFileData.formProps.model?.postName || '--' }}</p>
        </div>
      </div>
    </template>

    <!-- <template #footer>
      <div>
        <el-divider />

        <div class="button-groud">
          <div class="infoItem active">基本信息</div>
          <div class="infoItem">授权信息</div>
        </div>
      </div>
    </template> -->
  </InfoBox>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useUserStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { getToken } from '@/utils/auth'
import { updateUserInfo as queryUpdateUserInfo, queryUserInfo, type UserInfo } from '@/api'

import InfoBox from './infoBox.vue'

import { ElMessage, type UploadProps } from 'element-plus'

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const { updateUserInfo } = userStore

/**
 * 左侧数据
 */
const userFormPropsModel = computed(() => {
  return {
    userName: userInfo.value.userName,
    postName: userInfo.value.postName,
    headImage: userInfo.value.headImage,
    unitType: userInfo.value.unitType,
    unitName: userInfo.value.unitName
  }
})
const userFileData = reactive({
  width: 280,
  formProps: {
    model: userFormPropsModel,
    items: [
      { label: '单位类型', prop: 'unitType', span: 24 },
      { label: '单位名称', prop: 'unitName', span: 24 }
    ]
  }
})

const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  const { code, data, message } = response

  if (code === '200') {
    const params = {
      id: userInfo.value.id,
      headImage: data
    }
    queryUpdateUserInfo(params)
      .then(() => {
        // 更新个人信息
        queryUserInfo(userInfo.value.id as number).then(
          (res) => res.code === '200' && updateUserInfo(res.data)
        )
      })
      .catch(() => ElMessage.warning('个人信息更新失败，请重试'))
  } else {
    ElMessage.error(message)
  }
}

async function beforeAvatarUpload(rawFile: any) {
  const { size, type } = rawFile
  if (size / 1024 / 1024 > 5) {
    ElMessage.warning('文件大小不能超过5MB')
    return false
  }
  if (type === 'image/jpeg' || type === 'image/png' || type === 'image/svg+xml') {
    return true
  } else {
    ElMessage.warning('材料需JPEG/PNG/SVG格式')
    return false
  }
}
</script>

<style scoped>
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
