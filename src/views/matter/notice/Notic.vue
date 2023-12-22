<template>
  <CnPage v-bind="props">
    <template #matterCode="{ row }">
      <el-button type="text" @click="showDialog('detail', row)">{{ row.matterCode }}</el-button>
    </template>
    <template #status="{ row }">
      <el-text v-if="row.status === '1'" type="success"> 上线 </el-text>
      <el-text v-else> 下线 </el-text>
    </template>
  </CnPage>
  <CnDialog ref="dialogRef" v-bind="dialogProps" :close-on-press-escape="handleType !== 'detail'">
    <!-- 事项名称 -->
    <template #matterInfo>
      <div class="matterInfoCon">
        <el-button
          type="primary"
          plain
          @click="() => matterListDialogRef?.open()"
          v-if="handleType === 'add'"
          >选择</el-button
        >
        <div class="matterInfo" v-if="showMatterInfo">
          <div class="info">
            <div class="label">事项编号</div>
            <div class="value">{{ matterInfo.matterCode }}</div>
          </div>
          <div class="info">
            <div class="label">事项名称</div>
            <div class="value">{{ matterInfo.matterName }}</div>
          </div>
          <div class="info">
            <div class="label">办理类型</div>
            <div class="value">
              {{ matterInfo.handleTypeText }}
            </div>
          </div>
          <div class="info">
            <div class="label">系统覆盖范围</div>
            <div class="value">{{ matterInfo.sysCoverage }}</div>
          </div>
        </div>
      </div>
    </template>
    <!-- 办理材料 -->
    <template #noticeFileList>
      <div class="noticeFileListCon">
        <div class="btnGroup">
          <el-button @click="handleFileSelect" type="primary" plain>选择材料</el-button>
          <el-button type="primary" plain @click="handleUploadClick">+自定义上传</el-button>
        </div>
        <div class="fileList">
          <div class="fileInfo" v-for="(item, index) in fileList" :key="index">
            <el-icon :size="20">
              <CircleCloseFilled color="red" @click="removeFile(index)" />
            </el-icon>
            <div class="title">
              {{ item.fileName }}
            </div>
            <div class="file">
              <el-image :src="item.fileUrl" :preview-src-list="[item.fileUrl]" />
            </div>
          </div>
        </div>
      </div>
    </template>
    <!-- 删除单个办理须知 -->
    <template #deleteTitle v-if="handleType === 'delete'">
      <div class="deleteTitle">
        确定删除 "<span class="matterName"> {{ matterName }} </span>" 的办理须知
      </div>
    </template>
    <template #footer v-if="handleType === 'delete'">
      <div class="btns">
        <el-button type="primary" size="large" @click="removeNoticAction">删除</el-button>
      </div>
    </template>
    <!-- 删除多个办理须知 -->
    <template #deleteTitle v-if="handleType === 'manyDelete'">
      <div class="deleteTitle">
        确定删除 "<span class="matterName"> {{ (matterName as any[]).join('，') }} </span>"
        的办理须知
      </div>
    </template>
    <template #footer v-if="handleType === 'manyDelete'">
      <div class="btns">
        <el-button type="primary" size="large" @click="manyRemoveNoticAction">删除</el-button>
      </div>
    </template>
    <!-- 办理须知详情 -->
    <template #status>
      <el-text type="success" v-if="dialogProps.formProps!.model.status === '1'">上线</el-text>
      <el-text type="default" v-else>下线</el-text>
    </template>
    <template #detailNoticeFileList>
      <div class="detailFileList">
        <div class="fileList">
          <div
            class="fileInfo"
            v-for="(item, index) in dialogProps.formProps!.model.noticeFileList"
            :key="index"
          >
            <div class="title">
              {{ item.fileName }}
            </div>
            <div class="file">
              <el-image :src="item.fileUrl" :preview-src-list="[item.fileUrl]" />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #processingConditions>
      <div v-html="dialogProps.formProps!.model.processingConditions"></div>
    </template>
    <template #footer v-if="handleType === 'detail'">
      <div></div>
    </template>
  </CnDialog>
  <CnDialog ref="matterListDialogRef">
    <CnPage v-bind="matterListProps">
      <template #matterStatus="{ row }">
        <el-text v-if="row.matterStatus === '1'" type="success"> 上线 </el-text>
        <el-text v-else-if="row.matterStatus === '2'"> 下线 </el-text>
        <el-text v-else> 停用 </el-text>
      </template>
      <template #matterCode="{ row }">
        <div class="radioCon">
          <el-radio v-model="matterInfoTemp" :label="row">
            <el-link>{{ row.matterCode }}</el-link>
          </el-radio>
        </div>
      </template>
    </CnPage>
    <template #footer>
      <div class="btnCon">
        <el-button size="large" type="primary" @click="getMatterInfo">确定</el-button>
      </div>
    </template>
  </CnDialog>
  <CnDialog ref="selectFileDialogRef" title="选择材料" :close-on-press-escape="false">
    <el-input
      size="large"
      style="width: 70%"
      placeholder="搜索材料名称"
      :suffix-icon="Search"
      @input="handleFileSelect"
      v-model="fileKeyword"
    ></el-input>
    <div class="selectFileCon">
      <div class="fileList">
        <div class="fileInfo" v-for="(item, index) in files" :key="index">
          <div class="title">
            <el-checkbox v-model="selectFileFlag" :label="item.id">
              <span>{{ item.fileName }}</span></el-checkbox
            >
          </div>
          <div class="file">
            <el-image :src="item.fileUrl" :preview-src-list="[item.fileUrl]" />
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="btnCon">
        <el-button size="large" type="primary" @click="handleFileSubmit">确定</el-button>
        <el-button size="large" @click="handleFileCancel">取消</el-button>
      </div>
    </template>
  </CnDialog>
  <CnDialog ref="selfUploadFileDialogRef" v-bind="uploadFileDialogProps">
    <template #fileUrl>
      <el-upload
        class="avatar-uploader"
        ref="uploadRef"
        action="/selfHelp/api/file/infra/file/upload"
        :data="setUploadData"
        :headers="{ Authorization: getToken() }"
        :limit="1"
        :before-upload="handleBeforeUpload"
        :on-success="handleUploadSuccess"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
      </el-upload>
    </template>
    <template #tips> 需JPG/PNG格式，图片建议尺寸####PX*####PX，大小限5MB以内 </template>
    <template #footer>
      <div class="btnCon">
        <el-button size="large" type="primary" @click="selfUploadSubmit">提交</el-button>
      </div>
    </template>
  </CnDialog>
</template>

<script lang="ts" setup>
import { reactive, ref, toRaw } from 'vue'
import { ElMessage, ElUpload } from 'element-plus'
import type { UploadProps } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

import CnPage from '@/components/cn-page/CnPage.vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'

import {
  getHandleNoticeList,
  pushDownNotice,
  getMatterList,
  getFileList,
  addNotice,
  deleteNotice,
  getNoticeDetail,
  editNotice
} from '@/api/matter'

import searchConfig, { matterListSearchConfig } from './config/search-config'
import getTollbarConifg from './config/tollbar-config'
import getTableConfig, { getMatterListTableConfig } from './config/table-config'
import getDialogConfig, { getSelfUploadActionDialogConfig } from './config/dialog-config'

import useDictionary from '@/hooks/useDictionary'
import { getToken } from '@/utils/auth'

import type { ActionType } from './config/type'

const handleType = ref<ActionType>()

const dialogRef = ref<InstanceType<typeof CnDialog>>()
const matterListDialogRef = ref<InstanceType<typeof CnDialog>>()
const selectFileDialogRef = ref<InstanceType<typeof CnDialog>>()
const selfUploadFileDialogRef = ref<InstanceType<typeof CnDialog>>()
const uploadRef = ref<InstanceType<typeof ElUpload>>()

const dialogProps = reactive<CnPage.DialogProps>({})
const uploadFileDialogProps = reactive<CnPage.DialogProps>(getSelfUploadActionDialogConfig())

const matterName = ref<string | any[]>('')
const noticIds = ref<string | any[]>('')

const tableSelection = ref<any[]>()

const matterInfoTemp = ref() // 临时的用于绑定的变量
const matterInfo = ref()
const showMatterInfo = ref(false)

const imageUrl = ref('')
// 选择的材料
const selectFileFlag = ref<any[]>([])

// 关键字
const fileKeyword = ref('')
// 材料列表
const files = ref<any[]>([])
// 上传的材料
const fileList = ref<any[]>([])

const props = reactive<CnPage.Props>({
  refresh: 0,
  params: {},
  action: getHandleNoticeList,
  search: searchConfig,
  toolbar: getTollbarConifg(showDialog),
  table: getTableConfig(showDialog, selectionChange),
  pagination: true
})

const matterListProps = reactive<CnPage.Props>({
  transformRequest: (params: any, page: number) => {
    return { page, size: 6, obj: params }
  },
  refresh: 0,
  params: {},
  action: getMatterList,
  search: matterListSearchConfig,
  table: getMatterListTableConfig(),
  pagination: {
    size: 6
  }
})

// 弹窗确定按钮的点击
function dialogSubmitSuccess() {
  props.refresh = new Date().getTime()
}

// 表格选中项发生改变
function selectionChange(selection: any[]) {
  tableSelection.value = selection
}

// 获取事项信息
function getMatterInfo() {
  if (matterInfoTemp.value) {
    matterInfo.value = { ...matterInfoTemp.value }
    matterInfo.value.handleTypeText = useDictionary('HANDLE_TYPE', matterInfo.value.handleType)
    dialogProps.formProps!.model.matterInfo = toRaw(matterInfo.value)
    showMatterInfo.value = true
    matterListDialogRef.value?.close()
  }
}

// 图片选择确定
function handleFileSubmit() {
  const fileListIds = fileList.value.map((i) => i.id)
  fileList.value.push(
    ...files.value.filter((v) => !fileListIds.includes(v.id) && selectFileFlag.value.includes(v.id))
  )
  selectFileDialogRef.value?.close()
}

// 取消图片选择
function handleFileCancel() {
  selectFileFlag.value = []
  selectFileDialogRef.value?.close()
}

// 删除图片
function removeFile(index: number) {
  fileList.value.splice(index, 1)
  selectFileFlag.value.splice(index, 1)
}

// 自定义上传提交
function selfUploadSubmit() {
  selfUploadFileDialogRef.value?.handleSubmit()
}

//  选择材料
async function handleFileSelect() {
  const res = await getFileList({ obj: { fileName: fileKeyword.value } })
  files.value = res.rows
  selectFileDialogRef.value?.open()
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

// 上传成功
const handleUploadSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  if (response.code === '200') {
    uploadFileDialogProps.formProps!.model.fileUrl = response.data
    imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  } else {
    uploadRef.value?.clearFiles()
    ElMessage.error(response.message)
  }
}

// 删除单个办理须知
async function removeNoticAction() {
  await deleteNotice(noticIds.value as string)
  dialogRef.value?.close()
  props.refresh = new Date().getTime()
  ElMessage.success('操作成功')
}

// 删除多个办理须知
async function manyRemoveNoticAction() {
  for (const ids of noticIds.value) {
    await deleteNotice(ids)
  }
  dialogRef.value?.close()
  props.refresh = new Date().getTime()
  ElMessage.success('操作成功')
}

// 上下线
async function pushDownNoticeAction(handle: ActionType) {
  const status = handle === 'online' ? '1' : '0'
  for (const noticeInfo of tableSelection.value!) {
    const data = { ...noticeInfo, status }
    await pushDownNotice(data)
  }
  props.refresh = new Date().getTime()
  ElMessage.success('操作成功')
}

// 新增办理须知
function addNoticAction() {
  const model = dialogProps.formProps?.model || {}
  const data = {
    matterCode: model.matterInfo.matterCode,
    matterName: model.matterInfo.matterName,
    mattersId: model.matterInfo.id,
    noticeFileList: fileList.value.map((i) => ({
      fileName: i.fileName,
      fileUrl: i.fileUrl,
      handleFilesId: i.id ?? '',
      id: i.id ?? '',
      status: '1',
      fileSouce: i.fileSouce ? i.fileSouce : i.id ? '1' : '2'
    })),
    status: '1',
    processingConditions: model.processingConditions
  }
  return addNotice(data)
}

// 修改办理须知
function editNoticeAction() {
  const model = dialogProps.formProps?.model || {}
  const data = {
    matterCode: model.matterInfo.matterCode,
    matterName: model.matterInfo.matterName,
    mattersId: model.matterInfo.id,
    noticeFileList: fileList.value.map((i) => ({
      fileName: i.fileName,
      fileUrl: i.fileUrl,
      handleFilesId: i.id ?? '',
      id: i.id ?? '',
      status: '1',
      fileSouce: i.fileSouce ? i.fileSouce : i.id ? '1' : '2'
    })),
    processingConditions: model.processingConditions
  }
  delete model.matterInfo
  return editNotice({ ...model, ...data })
}

// 新增自定义材料
function addSelfUploadFileAction() {
  const model = uploadFileDialogProps.formProps?.model || {}
  fileList.value.push({ fileName: model.fileName, fileUrl: model.fileUrl })
  return Promise.resolve('操作成功')
}

// 打开自定义上传窗口
function handleUploadClick() {
  imageUrl.value = ''
  uploadFileDialogProps.action = () => addSelfUploadFileAction()
  selfUploadFileDialogRef.value?.open()
}

async function showDialog(handle: ActionType, row?: any) {
  handleType.value = handle
  const model = window.structuredClone(toRaw(row))
  if (handle === 'delete') {
    matterName.value = model.matterName
    noticIds.value = model.id
    const dialogConfig = getDialogConfig(handle)({})
    for (const key of Object.keys(dialogConfig)) {
      dialogProps[key] = dialogConfig[key]
    }
  } else if (handle === 'manyDelete') {
    if (!tableSelection.value?.length) return
    matterName.value = tableSelection.value.map((i) => i.matterName)
    noticIds.value = tableSelection.value.map((i) => i.id)
    const dialogConfig = getDialogConfig(handle)({})
    for (const key of Object.keys(dialogConfig)) {
      dialogProps[key] = dialogConfig[key]
    }
  } else if (handle === 'online' || handle === 'Offline') {
    if (!tableSelection.value?.length) return
    return pushDownNoticeAction(handle)
  } else if (handle === 'add') {
    if (handle === 'add') {
      matterInfo.value = {}
      fileList.value = []
      selectFileFlag.value = []
      showMatterInfo.value = false
    }
    const dialogConfig = getDialogConfig(handle)({ dialogSubmitSuccess })
    for (const key of Object.keys(dialogConfig)) {
      dialogProps[key] = dialogConfig[key]
    }
    dialogProps.action = () => addNoticAction()
  } else if (handle === 'detail') {
    const { id } = window.structuredClone(toRaw(row))
    const res = await getNoticeDetail(id)
    const model = res.data
    const dialogConfig = getDialogConfig(handle)({ model })
    for (const key of Object.keys(dialogConfig)) {
      dialogProps[key] = dialogConfig[key]
    }
    dialogProps.action = () => addNoticAction()
  } else {
    const { id } = window.structuredClone(toRaw(row))
    const res = await getNoticeDetail(id)
    const model = res.data
    matterInfo.value = {
      matterCode: model.matterCode,
      matterName: model.matterName,
      matterAlias: model.matterAlias,
      sysCoverage: model.sysCoverage,
      handleType: model.handleType,
      id: model.mattersId
    }
    matterInfo.value.handleTypeText = useDictionary('HANDLE_TYPE', matterInfo.value.handleType)
    model.matterInfo = toRaw(matterInfo.value)
    showMatterInfo.value = true
    fileList.value = model.noticeFileList
    // selectFileFlag.value = model.noticeFileList.map((v: any) => {
    //   if (v.handleFilesId) return v.handleFilesId
    // })
    const dialogConfig = getDialogConfig(handle)({ dialogSubmitSuccess, model })
    for (const key of Object.keys(dialogConfig)) {
      dialogProps[key] = dialogConfig[key]
    }
    dialogProps.action = () => editNoticeAction()
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
  .matterName {
    color: #409eff;
  }
}
.btns {
  width: 100%;
  justify-content: center;
  display: flex;
}

.matterInfoCon {
  .el-button {
    margin-bottom: 20px;
  }
  .matterInfo {
    display: flex;

    border: 1px solid rgb(242, 242, 242);
    .info {
      width: 150px;
      display: flex;
      align-items: center;
      flex-direction: column;
      .label {
        width: 100%;
        padding: 5px;
        box-sizing: border-box;
        background: rgb(242, 242, 242);
        text-align: center;
      }
      .value {
        display: flex;
        width: 100%;
        padding: 5px;
        text-align: center;
        justify-content: center;
        box-sizing: border-box;
        word-break: break-all;
      }
    }
  }
}

.selectFileCon,
.detailFileList,
.noticeFileListCon {
  .fileList {
    display: flex;
    margin-top: 30px;
    .fileInfo {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 15px;
      background-color: rgb(242, 242, 242);
      padding: 0 8px 0px 8px;
      border-radius: 5px;

      .file {
        width: 110px;
        img {
          width: 100%;
        }
      }
    }
  }
}

.noticeFileListCon {
  .fileList {
    margin-top: 15px;
    .fileInfo {
      position: relative;
      .el-icon {
        position: absolute;
        top: 0px;
        right: 0px;
      }
    }
  }
}

.detailFileList {
  .fileList {
    margin-top: 0px;
  }
}

.btnCon {
  widows: 100%;
  text-align: center;
}

.radioCon {
  display: flex;
  .el-radio {
    margin-right: 5px;
  }
}

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
