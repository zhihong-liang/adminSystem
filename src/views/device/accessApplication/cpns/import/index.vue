<template>
  <div class="export">
    <div class="header">
      <el-upload
        class="upload-demo"
        ref="uploadRef"
        v-model:file-list="fileList"
        action="/selfHelp/api/device/devBaseInfoHis/importAnalyExcel"
        :data="setUploadData"
        :headers="{ Authorization: getToken() }"
        :limit="1"
        :before-upload="handleBeforeUpload"
        :on-success="handleUploadSuccess"
      >
        <el-button type="primary" size="large">导入</el-button>
      </el-upload>
      <div class="desc">
        <div class="download">请先<a @click="downloadFile">下载模板</a></div>
        <div>仅支持 .xls / .xlsx文件格式 ，文件大小不能超过 10.0 MB</div>
      </div>
    </div>

    <CnSearch v-bind="searchProps"></CnSearch>
    <el-button size="large" @click="deleteDevice('mulDelete')">删除</el-button>
    <CnTable v-bind="importTableProps" :data="showTableList">
      <template #devUnit="{ row }">
        {{ getUnitName(row.devUnit) }}
      </template>
    </CnTable>
    <!-- <CnPagination v-bind="pagination" :total="importTableData.length" @update="handleQuery" /> -->
  </div>
  <CnDialog ref="dialogRef" v-bind="dialogProps">
    <template #deleteTitle>
      <div class="deleteTitle">
        确定删除设备 "<span class="labelName"> {{ deleteDeviceNames!.join(',') }} </span>"?
      </div>
    </template>
    <template #footer>
      <div class="btns">
        <el-button type="primary" size="large" @click="deleteAction">删除</el-button>
      </div>
    </template>
  </CnDialog>
  <div class="footer">
    <el-button type="primary" size="large" @click="addDevAccessApply">提交</el-button>
    <el-button size="large" @click="emits('cancel')">取消</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadProps, ElUpload } from 'element-plus'
import moment from 'moment'

import CnSearch from '@/components/cn-page/CnSearch.vue'
import CnTable from '@/components/cn-page/CnTable.vue'
// import CnPagination from '@/components/cn-page/CnPagination.vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'

import getTableConfig from './import-table-config'
import getSearchConfig from './import-search-config'
import getDeleteActionDialogConfig from './import-dialog-config'

import { getToken } from '@/utils/auth'
import type CnPage from '@/components/cn-page/cn-page'

import { devAccessApply } from '@/api/device'

interface Props {
  unitOptions: CnPage.OptionProps[]
}
const props = defineProps<Props>()

const fileList = ref<any[]>([])
const uploadRef = ref<InstanceType<typeof ElUpload>>()
const tableSelection = ref<any[]>()
const deleteDeviceNames = ref<string[]>()

const emits = defineEmits(['cancel', 'success'])

const importTableProps = reactive<CnPage.TableProps>(getTableConfig(deleteDevice, selectionChange))
const importTableData = ref([])
const showTableList = ref([])
// const pagination = reactive({
//   page: 1,
//   size: 10
// })
const searchProps = reactive<CnPage.SearchProps>(
  getSearchConfig(handleQuery, () => {
    showTableList.value = importTableData.value
  })
)

const dialogRef = ref<InstanceType<typeof CnDialog>>()
const dialogProps = reactive<CnPage.DialogProps>(getDeleteActionDialogConfig())

// 下载模板
function downloadFile() {
  const link = document.createElement('a')
  link.href = '/accessApplication.xlsx'
  link.download = 'accessApplication.xlsx'
  link.click()
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
  if (size / 1024 / 1024 > 10) {
    ElMessage.warning('文件大小不能超过10MB')
    return false
  }
  if (
    type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    type === 'application/vnd.ms-excel'
  ) {
    return true
  } else {
    ElMessage.warning('仅支持 .xls / .xlsx文件格式')
    return false
  }
}

// 上传成功
const handleUploadSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  if (response.code === '200') {
    const { list } = response.data
    importTableData.value = list
    showTableList.value = list
  } else {
    uploadRef.value?.clearFiles()
    ElMessage.error(response.message)
  }
}

// 删除
function deleteAction() {
  importTableData.value = importTableData.value.filter(
    (v: any) => !deleteDeviceNames.value?.includes(v.unitDevCode)
  )
  showTableList.value = importTableData.value
  dialogRef.value?.close()
}

// 删除设备
function deleteDevice(action: string, row?: any) {
  if (action === 'delete') {
    deleteDeviceNames.value = [row.unitDevCode]
  } else {
    if (!tableSelection.value || !tableSelection.value.length)
      return ElMessage.warning('请先勾选设备')
    deleteDeviceNames.value = tableSelection.value.map((i) => i.unitDevCode)
  }
  dialogRef.value?.open()
}

// 筛选数据
function handleQuery(data: any) {
  const {
    cityCode,
    devType,
    districtCode,
    provinceCode,
    siteName,
    streetCode,
    villageCode,
    unitDevCode
  } = data
  showTableList.value = importTableData.value.filter((v: any) => {
    const checkCiityCode = cityCode ? v.cityCode === cityCode : true
    const checkDevType = devType ? v.devType === devType : true
    const checkDistrictCode = districtCode ? v.districtCode === districtCode : true
    const checkProvinceCode = provinceCode ? v.provinceCode === provinceCode : true
    const checkStreetCode = streetCode ? v.streetCode === streetCode : true
    const checkVillageCode = villageCode ? v.villageCode === villageCode : true
    const checkSiteName = siteName ? v.siteName.includes(siteName) : true
    const checkUnitDevCode = unitDevCode ? v.unitDevCode.includes(unitDevCode) : true
    if (
      checkCiityCode &&
      checkDevType &&
      checkDistrictCode &&
      checkProvinceCode &&
      checkSiteName &&
      checkStreetCode &&
      checkVillageCode &&
      checkUnitDevCode
    )
      return v
  })
}

function selectionChange(selection: any[]) {
  tableSelection.value = selection
}

// 新增申请
async function addDevAccessApply() {
  if (!importTableData.value.length) return ElMessage.warning('请先导入设备信息')
  try {
    const { userInfo } = JSON.parse(localStorage.getItem('user')!)
    const data = {
      applyFile: '',
      applyPerson: userInfo.name,
      applyTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      auditCurrentStep: '',
      auditEndTime: '',
      auditStatus: '',
      batchNo: '',
      createTime: '',
      createUser: '',
      dataUnits: [],
      details: importTableData.value,
      devAccessUnit: '',
      devNum: importTableData.value.length,
      id: '',
      params: {},
      updateTime: '',
      updateUser: ''
    }
    const res = await devAccessApply(data)
    ElMessage.success('操作成功')
    emits('success')
  } catch (err: any) {}
}

// 获取单位名称
function getUnitName(id: number) {
  if (props.unitOptions) {
    return props.unitOptions.find((v) => v.value == id)?.label ?? id
  } else {
    return id
  }
}
</script>

<style scoped lang="scss">
.header {
  display: flex;
  .desc {
    margin-left: 10px;
    .download {
      > a {
        color: #3399ff;
        cursor: pointer;
      }
    }
  }
}

.footer {
  margin-top: 30px;
}

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
  justify-content: center;
  display: flex;
}
</style>
