<template>
  <div>
    <CnPage v-bind="props">
      <template #action="{ row }">
        <div class="btns">
          <el-button text type="primary" @click="showDialog('edit', row)">编辑</el-button>
          <el-button
            v-if="row.status === '1'"
            text
            type="primary"
            @click="enableMatterLabelAction('deactivate', row)"
            >停用</el-button
          >
          <el-button v-else text type="primary" @click="enableMatterLabelAction('enable', row)"
            >启用</el-button
          >
          <el-button text type="primary" @click="showDialog('delete', row)">删除</el-button>
        </div>
      </template>
      <template #lableName="{ row }">
        <el-button text type="primary" @click="showDialog('detail', row)">{{ row.lableName }}</el-button>
      </template>
      <template #status="{ row }">
        <span>{{ row.id }}</span>
      </template>
    </CnPage>
    <CnDialog ref="dialogRef" v-bind="dialogProps">
      <template #deleteTitle v-if="handleType === 'delete'">
        <div class="deleteTitle">
          确定删除 "<span class="labelName"> {{ labelName }} </span>" 标签
        </div>
      </template>
      <!-- 上传图标 -->
      <template #lableIcon>
        <el-upload
          class="uploader"
          ref="uploadRef"
          action="/selfHelp/api/file/infra/file/upload"
          :file-list="fileList"
          :data="setUploadData"
          :headers="{ Authorization: getToken() }"
          :before-upload="handleBeforeUpload"
          :on-success="handleUploadSuccess"
          :before-remove="handleUploadRemove"
          :show-file-list="false"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="uploader-icon"><Plus /></el-icon>
        </el-upload>
      </template>
      <!-- 显示图标 -->
      <!-- <template #showLableIcon>
        <img
          v-if="dialogProps.formProps?.model.lableIcon"
          :src="dialogProps.formProps?.model.lableIcon"
          class="avatar"
        />
        <div v-else>--</div>
      </template> -->

      <template #footer>
        <!-- 新建标签 -->
        <div class="btns" v-if="handleType === 'add' || handleType === 'edit'">
          <el-button
            type="primary"
            size="large"
            @click="() => (handleType === 'add' ? addMatterLabelAction() : editMatterLabelAction())"
            >确定</el-button
          >
        </div>
        <!-- 删除单个标签 -->
        <div class="btns" v-if="handleType === 'delete'">
          <el-button type="primary" size="large" @click="removeMatterLabelAction">删除</el-button>
        </div>
        <!-- 删除多个标签 -->
        <div class="btns" v-if="handleType === 'manyDelete'">
          <el-button type="primary" size="large" @click="removeManyMatterLabelAction"
            >删除</el-button
          >
        </div>
        <div class="btns" v-if="handleType === 'detail'"></div>
      </template>
    </CnDialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, toRaw } from 'vue'
import { ElMessage, ElUpload } from 'element-plus'
import type { UploadProps, UploadFile, UploadFiles, UploadUserFile } from 'element-plus'

import CnPage from '@/components/cn-page/CnPage.vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'

import searchConfig from './config/search-config'
import getTableConfig from './config/table-config'
import getTollbarConifg from './config/tollbar-config'
import { getDialogConfig } from './config/dialog-config'

import { getToken } from '@/utils/auth'

import type { ActionType } from './config/type'

import {
  getMatterLabelList,
  addMatterLabel,
  removeMatterLabel,
  editMatterLabel,
  enableMatterLabel
} from '@/api/matter'

const handleType = ref<ActionType>()

// 标题名称
const labelName = ref<string | any[]>('')
const labelIds = ref<string | any[]>('')

const tableSelection = ref<any[]>()

const fileList = ref<UploadUserFile[]>([])
const uploadRef = ref<InstanceType<typeof ElUpload>>()
const imageUrl = ref('')

const dialogRef = ref<InstanceType<typeof CnDialog>>()
const dialogProps = reactive<CnPage.DialogProps>({})

const props = reactive<CnPage.Props>({
  refresh: 0,
  init: undefined,
  params: {
    page: 1,
    size: 10
  },
  action: getMatterLabelList,
  search: searchConfig,
  toolbar: getTollbarConifg(showDialog),
  table: getTableConfig(showDialog, selectionChange),
  pagination: {
    page: 1,
    size: 10
  }
})

// 弹窗确定按钮的点击
function dialogSubmitSuccess() {
  props.refresh = new Date().getTime()
}

function selectionChange(selection: any[]) {
  tableSelection.value = selection
}

// 弹窗关闭
function handleDialogClose() {
  dialogProps.formProps!.model.lableIcon = ''
  imageUrl.value = ''
  fileList.value = []
}

// 上传参数
function setUploadData(rawFile: any) {
  return {
    path: rawFile.name
  }
}

// 上传文件
async function handleBeforeUpload(rawFile: any) {
  const { size, type } = rawFile
  if (size / 1024 / 1024 > 5) {
    ElMessage.warning('文件大小不能超过5MB')
    return false
  }
  if (type === 'image/jpeg' || type === 'image/png') {
    return true
  } else {
    ElMessage.warning('材料需JPG/PNG格式')
    return false
  }
}

function handleUploadRemove(uploadFile: UploadFile, uploadFiles: UploadFiles): any {
  dialogProps.formProps!.model.lableIcon = ''
  imageUrl.value = ''
}

// 上传成功
const handleUploadSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  if (response.code === '200') {
    dialogProps.formProps!.model.lableIcon = response.data
    imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  } else {
    uploadRef.value?.clearFiles()
    ElMessage.error(response.message)
  }
}

// 新建标签
async function addMatterLabelAction() {
  const model = dialogProps.formProps?.model || {}
  const { userInfo } = JSON.parse(localStorage.getItem('user')!)
  model.createUser = userInfo.name
  await addMatterLabel(model)
  dialogRef.value?.close()
  props.refresh = new Date().getTime()
  ElMessage.success('操作成功')
  imageUrl.value = ''
}

// 修改标签
async function editMatterLabelAction() {
  const model = dialogProps.formProps?.model || {}
  await editMatterLabel(model)
  dialogRef.value?.close()
  props.refresh = new Date().getTime()
  ElMessage.success('操作成功')
}

// 删除标签
async function removeMatterLabelAction() {
  await removeMatterLabel(labelIds.value as string)
  dialogRef.value?.close()
  props.refresh = new Date().getTime()
  ElMessage.success('操作成功')
}

// 删除多个标签
async function removeManyMatterLabelAction() {
  for (const ids of labelIds.value) {
    await removeMatterLabel(ids)
  }
  dialogRef.value?.close()
  props.refresh = new Date().getTime()
  ElMessage.success('操作成功')
}

// 停用-启用
async function enableMatterLabelAction(handle: ActionType, row: any) {
  try {
    row.status = handle === 'enable' ? '1' : '0'
    await enableMatterLabel(row)
    props.refresh = new Date().getTime()
    ElMessage.success('操作成功')
  } catch (err: any) {
    ElMessage.error(err)
  }
}

// 显示添加/删除/标签弹窗
function showDialog(handle: ActionType, row?: any) {
  handleType.value = handle
  if (handle === 'add' || handle === 'edit') {
    const model = handle === 'edit' ? window.structuredClone(toRaw(row)) : undefined
    if (handle === 'edit' && model.lableIcon) {
      fileList.value.push({ url: model.lableIcon, status: 'success', name: model.lableName })
      imageUrl.value = model.lableIcon
    }
    const dialogConfig = getDialogConfig(handle)({
      dialogSubmitSuccess,
      model,
      onClose: handleDialogClose
    })
    for (const key of Object.keys(dialogConfig)) {
      dialogProps[key] = dialogConfig[key]
    }
  } else if (handle === 'delete' || handle === 'manyDelete') {
    if (handle === 'delete') {
      const model = window.structuredClone(toRaw(row))
      if (model.mattersCount)
        return ElMessage.warning(`${model.lableName}，存在使用事项数，无法删除。`)
      labelName.value = model.lableName
      labelIds.value = model.id
    } else {
      if (!tableSelection.value?.length) return ElMessage.warning('请选择需要删除的标签')
      // 存在使用事项数，无法删除
      const hasMattersCountList = tableSelection.value.filter((item) => item.mattersCount)
      if (hasMattersCountList.length) {
        const labelNames = hasMattersCountList.map((i: any) => i.lableName).join('，')
        return ElMessage.warning(`${labelNames}，存在使用事项数，无法删除。`)
      }
      labelName.value = tableSelection.value.map((item) => item.lableName)
      labelIds.value = tableSelection.value.map((item) => item.id)
    }
    const dialogConfig = getDialogConfig(handle)({})
    for (const key of Object.keys(dialogConfig)) {
      dialogProps[key] = dialogConfig[key]
    }
  } else {
    const model = window.structuredClone(toRaw(row))
    const obj = {
      status: model.status === '1' ? '有效' : '无效'
    }
    const dialogConfig = getDialogConfig(handle)({
      model: { ...model, ...obj }
    })
    for (const key of Object.keys(dialogConfig)) {
      dialogProps[key] = dialogConfig[key]
    }
  }
  dialogRef.value?.open()
}
</script>

<style scoped lang="scss">
.deleteTitle {
  width: 100%;
  display: flex;
  font-size: 20px;
  justify-content: center;
  .labelName {
    color: #409eff;
  }
}
.btns {
  width: 100%;
  display: flex;
  /* justify-content: center; */
}
</style>

<style>
.uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
