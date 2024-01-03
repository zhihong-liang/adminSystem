<template>
  <CnPage v-bind="props">
    <!-- 搜索 -->
    <template #device_status>
      <div class="device-status">
        <CnDict
          placeholder="状态"
          component="select"
          dict="DEVICE_MONITOR_STATUS"
          v-model="searchParams.status"
        ></CnDict>
        <CnDict
          placeholder="故障类型"
          component="select"
          dict="DEVICE_FAULT_TYPE"
          v-model="searchParams.alarm_code"
        ></CnDict>
        <CnDict
          placeholder="离线时长"
          component="select"
          v-model="searchParams.offlineDuration"
          dict="DEVICE_MONITOR_OFFLINEDAYS"
        ></CnDict>
      </div>
    </template>
    <template #region="{ row }">行政区划</template>
    <template #addition>dfdfdfd</template>
  </CnPage>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { mattersThemeInfoListPage as ListRequest, delMattersThemeInfo as DelRequest } from '@/api'
import {
  devGroupListUtils,
  getUnitListUtils,
  mattersProgrammeListPageUtils
} from '../../../device/utils/index'

import { ElMessageBox, ElMessage } from 'element-plus'
const supList: any = ref([])
const emit = defineEmits(['changeType'])

const dealRef = ref()
const selRef = ref()
const searchParams: any = ref({})
const props: CnPage.Props = reactive({
  params: searchParams,
  action: (params) => ListRequest(params),
  search: {
    items: [
      {
        label: '行政区划',
        prop: 'region',
        component: 'ad',
        props: { props: { checkStrictly: true } }
      },
      { label: '部署场所', prop: 'deploymentLocation', component: 'input' },
      { label: '设备编号', prop: 'proDevCode', component: 'input' },
      { label: '设备接入单位设备编号', prop: 'unitDevCode', component: 'input' },
      {
        label: '设备技术支撑单位',
        prop: 'technicalSupportUnit',
        component: 'select',
        props: { options: supList }
      },
      { label: '设备监控状态', prop: 'device_status', component: 'slot' },
      { label: '设备类型', prop: 'deviceType', component: 'select', dict: 'DEV_TYPE' },
      {
        label: 'IP最近变动时间',
        prop: 'ipLastChange',
        component: 'datepicker',
        props: { type: 'daterange', unlinkPanels: true }
      },
      {
        label: '离线天数',
        prop: 'offlineDays',
        component: 'select',
        dict: 'DEVICE_MONITOR_OFFLINEDAYS'
      }
    ]
  },
  toolbar: {
    items: [
      {
        label: '新增',
        type: 'primary',
        onClick: () => {
          dealRef.value?.open('', 'add')
          // dialogProps.formProps!.model = {}
          // dialogProps.action = () => handleSubmit('add')
        }
      }
    ]
  },
  table: {
    rowKey: 'id',
    columns: [
      { prop: 'proDevCode', label: '设备编号' },
      { slot: 'region', label: '行政区划' },
      { prop: 'address', label: '详细地址' },
      { prop: 'status', label: '设备状态(30分钟）', dict: 'DEVICE_MONITOR_STATUS' },
      { prop: 'dailyOnlineDuration', label: '状态持续时长（小时）' },
      { prop: 'lastOnlineTime', label: '最近在线时间' },
      { prop: 'ipLastChangeTime', label: 'IP最近变动时间' }
    ],
    treeProps: { children: 'childList' }
  },
  pagination: true,
  refresh: new Date().getTime()
  // transformResponse: () => {}
})

onMounted(async () => {
  supList.value = await getUnitListUtils().then((res) => {
    return res
  })
})
</script>

<style scoped lang="scss">
:deep(.启用) {
  color: #67c23a;
}
:deep(.停用) {
  color: #f56c6c;
}

.device-status {
  display: flex;
  gap: 5px;
}
</style>
