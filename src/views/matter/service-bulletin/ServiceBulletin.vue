<template>
  <div>
    <CnPage v-bind="props">
      <template #noticeName="{ row }">
        <el-button type="text" @click="showDialog('detail', row)">{{ row.noticeName }}</el-button>
      </template>
      <template #noticeStatus="{ row }">
        <el-text type="default" v-if="row.noticeStatus === '3'">已下架</el-text>
        <el-text type="success" v-else-if="row.noticeStatus === '2'">发布中</el-text>
        <el-text type="warning" v-else>待发布</el-text>
      </template>
      <template #action="{ row }">
        <div class="link-content">
          <el-link :underline="false" type="primary" @click="showDialog('edit', row)">编辑</el-link>
          <el-link
            :underline="false"
            type="primary"
            @click="showDialog('offShelf', row)"
            v-if="row.noticeStatus === '2' || row.noticeStatus === '1'"
            >下架</el-link
          >
          <!-- <el-link :underline="false" type="primary" @click="showDialog('grounding', row)" v-else
            >上架</el-link
          > -->
          <el-link :underline="false" type="primary" @click="showDialog('delete', row)"
            >删除</el-link
          >
        </div>
      </template>
    </CnPage>
    <CnDialog ref="dialogRef" v-bind="dialogProps">
      <!-- 信息展示期 -->
      <template #startDate>
        <div class="dateRange">
          <el-date-picker
            v-model="dialogProps.formProps!.model.startDate"
            type="datetime"
            placeholder="请选择开始时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY-MM-DD HH:mm"
            time-format="HH:mm"
            :disabled-date="disabledStartDate"
          />
          <div>至</div>
          <el-date-picker
            v-model="dialogProps.formProps!.model.endDate"
            type="datetime"
            placeholder="请选择结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY-MM-DD HH:mm"
            time-format="HH:mm"
            :disabled-date="disabledEndDate"
          />
        </div>
      </template>
      <!-- 公告状态 -->
      <template #noticeStatus>
        <el-text type="default" v-if="noticeStatus === '3'">已下架</el-text>
        <el-text type="success" v-else-if="noticeStatus === '2'">发布中</el-text>
        <el-text type="warning" v-else>待发布</el-text>
      </template>

      <!-- 发布区域 -->
      <template #pushAreaCode>
        <el-cascader
          ref="cascaderRef"
          collapse-tags
          collapse-tags-tooltip
          max-collapse-tags="5"
          v-model="dialogProps.formProps!.model.pushAreaCode"
          :props="cascaderProps.props"
          :options="cascaderProps.options"
        />
      </template>

      <!-- 删除服务公告 -->
      <template #deleteTitle>
        <div class="deleteTitle">
          确定删除服务公告 “{{ serviceBulletinName }}” ，删除后将无法恢复
        </div>
      </template>
      <template v-if="handleType === 'delete'" #footer>
        <div class="btns">
          <el-button type="primary" size="large" @click="deleteServiceNoticeAction">删除</el-button>
        </div>

        <!-- 下架服务公告 -->
      </template>
      <template #offShelf>
        <div class="offShelfTitle">确定下架服务公告 “{{ serviceBulletinName }}”</div>
      </template>
      <template v-if="handleType === 'offShelf'" #footer>
        <div class="btns">
          <el-button type="primary" size="large" @click="pushDownServiceNoticeAction"
            >确定</el-button
          >
        </div>
      </template>
      <!-- 公告内容 -->
      <template #content>
        <div v-html="dialogProps.formProps!.model.content"></div>
      </template>
    </CnDialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, toRaw } from 'vue'
import { ElMessage } from 'element-plus'
import type { ElCascader } from 'element-plus'
import moment from 'moment'
import CnPage from '@/components/cn-page/CnPage.vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'

import searchConfig from './config/search-config'
import getTableConfig from './config/table-config'
import getTollbarConifg from './config/tollbar-config'
import { getDialogConfig } from './config/dialog-config'

import { getDictionary } from '@/api'
import {
  getServiceNoticeList,
  addServiceNotice,
  editServiceNotice,
  deleteServiceNotice,
  pushDownServiceNotice
} from '@/api/matter'
import type { ActionType } from './config/type'
import { handlesysCoverageOptionsTree, stringToArray } from '../utils/index'
import useDictionary from '@/hooks/useDictionary'

const cascaderRef = ref<InstanceType<typeof ElCascader>>()

const serviceBulletinIds = ref('')
const serviceBulletinName = ref('')
const noticeStatus = ref('')
const handleType = ref('')
const dialogRef = ref<InstanceType<typeof CnDialog>>()
const dialogProps = reactive<CnPage.DialogProps>({})

onMounted(async () => {
  const res = await getDictionary(['SYS_COVERAGE'])
  const { data } = res
  cascaderProps.options = handlesysCoverageOptionsTree(data['SYS_COVERAGE']) as any
})

const cascaderProps = reactive({
  options: [],
  props: {
    checkStrictly: false,
    multiple: true,
    emitPath: false,
    label: 'label',
    value: 'value',
    children: 'childen'
  }
})

const props = reactive<CnPage.Props>({
  refresh: 0,
  params: {
    page: 1,
    size: 10
  },
  action: getServiceNoticeList,
  search: searchConfig,
  toolbar: getTollbarConifg(showDialog),
  table: getTableConfig(),
  pagination: {
    page: 1,
    size: 10
  }
})

// 日期禁用
function disabledStartDate(date: Date) {
  if (dialogProps.formProps?.model.endDate) {
    const startDate = moment(date).valueOf()
    const endData = moment(dialogProps.formProps.model.endDate, 'YYYY-MM-DD').valueOf()
    return startDate >= endData
  }
}
function disabledEndDate(date: Date) {
  if (dialogProps.formProps?.model.startDate) {
    const startDate = moment(dialogProps.formProps.model.startDate).valueOf()
    const endData = moment(date).valueOf()
    return endData <= startDate
  }
}

// 弹窗确定按钮的点击
function dialogSubmitSuccess() {
  props.refresh = new Date().getTime()
}

// 新建服务公告
function addServiceNoticeAction() {
  const { userInfo } = JSON.parse(localStorage.getItem('user')!)
  const model = dialogProps.formProps?.model || {}
  model.startDate = model.startDate
  model.endDate = model.endDate
  model.pushAreaCode = model.pushAreaCode.join(',')
  model.deviceType = model.deviceType.join(',')
  model.createUser = userInfo.name
  let nodesInfo = cascaderRef.value?.getCheckedNodes(true)
  const labelList = nodesInfo?.map((item) => item.label)
  model.pushAreaName = labelList?.join(',')
  delete model.date
  return addServiceNotice(model)
}

// 编辑服务公告
function editServiceNoticeAction() {
  const model = dialogProps.formProps?.model || {}
  model.startDate = model.startDate
  model.endDate = model.endDate
  model.pushAreaCode = model.pushAreaCode.join(',')
  model.deviceType = model.deviceType.join(',')
  let nodesInfo = cascaderRef.value?.getCheckedNodes(true)
  const labelList = nodesInfo?.map((item) => item.label)
  model.pushAreaName = labelList?.join(',')
  delete model.date
  return editServiceNotice(model)
}

// 删除服务公告
function deleteServiceNoticeAction() {
  deleteServiceNotice(serviceBulletinIds.value)
  setTimeout(() => {
    dialogRef.value?.close()
    props.refresh = new Date().getTime()
    ElMessage.success('操作成功')
  }, 1000)
}

// 发布-下架服务公告
function pushDownServiceNoticeAction() {
  pushDownServiceNotice({ id: serviceBulletinIds.value, noticeStatus: '3' })
  setTimeout(() => {
    dialogRef.value?.close()
    props.refresh = new Date().getTime()
    ElMessage.success('操作成功')
  }, 1000)
}

async function showDialog(handle: ActionType, row?: any) {
  handleType.value = handle
  if (handle === 'add' || handle === 'edit') {
    // 新建/编辑
    const model = handle === 'edit' ? { ...window.structuredClone(toRaw(row)) } : {}
    if (handle === 'edit') {
      // 编辑
      model.pushAreaCode = model.pushAreaCode.split(',')
      model.deviceType = model.deviceType.split(',')
    } else {
      model.startDate = moment().format('YYYY-MM-DD HH:mm:ss')
    }
    const dialogConfig = getDialogConfig(handle)({
      handle,
      model,
      dialogSubmitSuccess
    })
    for (const key of Object.keys(dialogConfig)) {
      dialogProps[key] = dialogConfig[key]
    }
    dialogProps.action = () =>
      handle === 'add' ? addServiceNoticeAction() : editServiceNoticeAction()
  } else if (handle === 'delete' || handle === 'offShelf') {
    // 删除/下架
    const model = window.structuredClone(toRaw(row))
    serviceBulletinIds.value = model.id
    serviceBulletinName.value = model.noticeName
    const dialogConfig = getDialogConfig(handle)({})
    for (const key of Object.keys(dialogConfig)) {
      dialogProps[key] = dialogConfig[key]
    }
  } else {
    // 查看详情
    let model = window.structuredClone(toRaw(row))
    model.date =
      moment(model.startDate, 'YYYY-MM-DD HH:mm:ss').format('YYYY年MM月DD日HH时mm分') +
      ' 至 ' +
      moment(model.endDate, 'YYYY-MM-DD HH:mm:ss').format('YYYY年MM月DD日HH时mm分')
    noticeStatus.value = model.noticeStatus
    model.deviceType = stringToArray(model.deviceType)
    const dialogConfig = getDialogConfig(handle)({ model })
    for (const key of Object.keys(dialogConfig)) {
      dialogProps[key] = dialogConfig[key]
    }
  }
  dialogRef.value?.open()
}
</script>

<style scoped lang="scss">
.deleteTitle,
.offShelfTitle {
  width: 100%;
  display: flex;
  font-size: 20px;
  justify-content: center;
  .labelName {
    color: #409eff;
  }
}
.link-content {
  display: flex;
  justify-content: space-between;
}

.btns {
  width: 100%;
  justify-content: center;
  display: flex;
}

.dateRange {
  width: 100%;
  display: flex;
  :deep(.el-date-editor) {
    flex: 1;
  }
}
</style>
