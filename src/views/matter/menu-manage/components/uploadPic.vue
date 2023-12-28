<template>
  <el-upload
    :limit="1"
    ref="uploadRef"
    :disabled="disabled"
    class="avatar-uploader"
    v-model:file-list="fileList"
    :headers="{ Authorization: getToken() }"
    accept="image/png, image/jpeg, image/svg"
    action="/selfHelp/api/file/infra/file/upload"
    :data="(rawFile: any) => ({ path: rawFile.name })"
    :on-remove="handleUploadRemove"
    :on-success="handleUploadSuccess"
    :before-upload="handleBeforeUpload"
  >
    <img v-if="!!imageUrl" :src="imageUrl" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { getToken } from '@/utils/auth'

import { ElMessage, type UploadProps } from 'element-plus'

const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['update:value'])

const uploadRef = ref()
const imageUrl = ref(props.value)

const fileList = computed(() => {
  if (props.value && props.value.includes('http')) {
    return [{ name: '图片1', url: props.value }]
  }
})

// 上传文件
async function handleBeforeUpload(rawFile: any) {
  const { size, type } = rawFile
  if (size / 1024 / 1024 > 5) {
    ElMessage.warning('文件大小不能超过5MB')
    return false
  }
  if (type === 'image/jpeg' || type === 'image/png' || type === 'image/svg') {
    return true
  } else {
    ElMessage.warning('材料需JPG/PNG/SVG格式')
    return false
  }
}

// 上传成功
const handleUploadSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  if (response.code === '200') {
    emits('update:value', response.data)
    imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  } else {
    uploadRef.value?.clearFiles()
    ElMessage.error(response.message)
  }
}

function handleUploadRemove() {
  imageUrl.value = ''
  emits('update:value', '')
}
</script>

<style lang="scss" scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
