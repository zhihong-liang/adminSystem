<template>
  <el-upload
    :class="{ disabled: uploadDisabled }"
    :limit="1"
    list-type="picture-card"
    accept=".png,.jpeg,.svg"
    action="/selfHelp/api/file/infra/file/upload"
    :headers="{ Authorization: getToken() }"
    :data="(rawFile: any) => ({ path: rawFile.name })"
    :file-list="fileList"
    :disabled="disabled"
    :on-success="handleUploadSuccess"
    :before-upload="handleBeforeUpload"
    :on-remove="handleUploadRemove"
    :on-preview="handleUploadPreView"
  >
    <el-icon><Plus /></el-icon>
  </el-upload>

  <CnDialog ref="dialogRef">
    <div class="flex flex-center">
      <el-image style="width: 400px; height: 400px;" :src="dialogImageUrl" alt="" />
    </div>

    <template #footer>
      <el-button @click="() => dialogRef.close()">关闭</el-button>
    </template>
  </CnDialog>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { getToken } from '@/utils/auth'

import { ElMessage, type UploadFile, type UploadProps } from 'element-plus'

const emits = defineEmits(['update:value'])
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

const dialogRef = ref()
const dialogImageUrl = ref()

const fileList = ref([]) as any

const uploadDisabled = computed(() => fileList.value.length >= 1)

// 上传文件
async function handleBeforeUpload(rawFile: any) {
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

// 上传成功
const handleUploadSuccess: UploadProps['onSuccess'] = (response, uploadFiles) => {
  if (response.code === '200') {
    emits('update:value', response.data)
    fileList.value.push({ url: response.data })
  } else {
    ElMessage.error(response.message)
  }
}

function handleUploadRemove() {
  emits('update:value', '')
  fileList.value = []
}

function handleUploadPreView(uploadFile: UploadFile) {
  dialogImageUrl.value = uploadFile.url
  dialogRef.value.open()
}

onBeforeMount(() => {
  if (props.value) {
    fileList.value = [{ url: props.value }]
  }
})
</script>

<style lang="scss" scoped>
.disabled {
  :deep(.el-upload--picture-card) {
    display: none;
  }
}
</style>
