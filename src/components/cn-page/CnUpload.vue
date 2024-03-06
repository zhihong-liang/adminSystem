<template>
  <el-upload
    :file-list="fileList"
    action="/selfHelp/api/file/infra/file/upload"
    :headers="{ Authorization: getToken() }"
    :data="(rawFile: UploadRawFile) => ({ path: rawFile.name })"
    :key="key"
    accept=".png,.jpeg,.jpg,.svg"
    :limit="limit"
    :class="{ limitClass: fileList.length === limit }"
    list-type="picture-card"
    :on-preview="handlePictureCardPreview"
    :on-remove="handleRemove"
    :on-success="handleSuccess"
    :before-upload="handleBeforeUpload"
    :on-error="handleError"
  >
    <el-icon><Plus /></el-icon>
  </el-upload>

  <el-dialog v-model="dialogVisible">
    <img style="width: 100%" w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { getToken } from '@/utils/auth'
import { ElMessage } from 'element-plus'

import type { UploadProps, UploadRawFile, UploadFile, UploadFiles } from 'element-plus'

const props = defineProps(['modelValue', 'limit'])
const emit = defineEmits(['update:modelValue'])

const key = computed(() => fileList.value.map((v) => v.url).toString())

const fileList = computed({
  get() {
    let list = []
    if (Array.isArray(props.modelValue)) {
      list = props.modelValue
    } else if (typeof props.modelValue === 'string') {
      list = props.modelValue ? props.modelValue.split(',') : []
    }
    return list.map((url) => ({ url }))
  },
  set(val) {
    console.log(val)
  }
})

const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handleSuccess = (res: any, File: UploadFile, Files: UploadFiles) => {
  if (res.code === '200') {
    emit(
      'update:modelValue',
      Files.map((v: any) => (v.response ? v.response.data : v.url)).toString()
    )
  }
}

const handleRemove: UploadProps['onRemove'] = (File, Files) => {
  emit('update:modelValue', Files.map((v: any) => v.url).toString())
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

const handleBeforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png' && rawFile.type !== 'image/svg+xml') {
    ElMessage.error('请上传jpg/jpeg/png/svg格式的文件')
    return false
  } else if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error('文件大小不能超过5MB!')
    return false
  }
  return true
}

const handleError = () => {
  ElMessage.error('文件上传失败！')
}
</script>

<style lang="scss" scoped>
.limitClass :deep(.el-upload) {
  display: none;
}
</style>
