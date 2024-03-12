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
    <template #proDevCode="{ row }">
      <span class="blurtext" @click="handleDetail(row.id)">{{ row.proDevCode }}</span>
    </template>
    <template #region="{ row }">
      <span v-if="row.provinceName">{{ row.provinceName }}</span>
      <span v-if="row.cityName">{{ row.cityName }}</span>
      <span v-if="row.districtName">{{ row.districtName }}</span>
      <span v-if="row.villageName">{{ row.villageName }}</span>
      <span v-if="row.streetName">{{ row.streetName }}</span>
    </template>
    <template #addition>
      <div class="fresh">
        <el-form-item label="刷新频率">
          <el-select v-model="fresh" @change="handleFresh">
            <el-option label="不自动刷新" value="0"></el-option>
            <el-option label="1分钟自动刷新" value="1"></el-option>
            <el-option label="5分钟自动刷新" value="5"></el-option>
            <el-option label="10分钟自动刷新" value="10"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="lasttime">最后更新时间：{{ lastTime }}</div>
      <div class="sum device-sum">
        <div class="title">设备量</div>
        <div class="content">
          <div class="item">
            <span class="label">启用设备量 ：</span>
            <span class="value">
              <span class="num">{{ deviceInfo.enableCount }} </span>
              台
            </span>
          </div>
          <div class="item">
            <span class="label">在线量 ：</span>
            <span class="value">
              <span class="num">
                {{ deviceInfo.onLineCount }}
              </span>
              台
            </span>
            <span class="per" style="background: #67c23a">
              {{ deviceInfo.onLineRate }}
            </span>
            <span class="detail">
              (正常量 {{ deviceInfo.normalCount }} 台，故障量 {{ deviceInfo.failureCount }}台）
            </span>
          </div>
          <div class="item">
            <span class="label">离线量 ：</span>
            <span class="value">
              <span class="num">
                {{ deviceInfo.offLineCount }}
              </span>
              台
            </span>
            <span class="per" style="background: #f56c6c">
              {{ deviceInfo.offLineRate }}
            </span>
          </div>
          <div class="showChart" @click="router.push('/monitor/status/charts')">查看在线趋势图</div>
        </div>
      </div>
      <div class="sum offline-sum">
        <div class="title">
          离线告警
          <el-popover placement="top-start" :width="600" trigger="hover">
            <template #reference>
              <el-icon class="icon"><QuestionFilled /></el-icon>
            </template>

            <div>
              <p>1.设备未通电</p>
              <p>2.网络不通</p>
              <p>3.设备未到正常页面</p>
              <p>
                4.设备某些功能(如:
                刷身份证，人脸识别)异常,不能正常使用设备请各地做好督促，如无特殊原因，村居工作时间应开机为群众提供服务
              </p>
            </div>
          </el-popover>
        </div>
        <div class="content">
          <div class="item">
            <span class="label">超过30天设备：</span>
            <span class="value">
              <span class="num">
                {{ deviceInfo.offLine30DayCount }}
              </span>
              台
            </span>
            <span class="per" style="background: #f56c6c">
              {{ deviceInfo.offLine30DayRate }}
            </span>
          </div>
          <div class="item">
            <span class="label">
              超过7天设备
              <el-popover placement="top-start" :width="600" trigger="hover">
                <template #reference>
                  <el-icon class="icon"><QuestionFilled /></el-icon>
                </template>

                <div>包含离线超过30天设备</div>
              </el-popover>
              ：
            </span>
            <span class="value">
              <span class="num">
                {{ deviceInfo.offLine7DayCount }}
              </span>
              台
            </span>
            <span class="per" style="background: #f56c6c">
              {{ deviceInfo.offLine7DayRate }}
            </span>
          </div>
        </div>
      </div>
      <div class="offline-sum"></div>
    </template>
  </CnPage>
  <Detail ref="detailDialogRef"></Detail>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, onUnmounted } from 'vue'
import {
  monitorHeartStatisticsList as ListRequest,
  monitorCodeExport,
  monitorHeartStatisticsStatusMonitor
} from '@/api'
import moment from 'moment'
import {
  devGroupListUtils,
  getUnitListUtils,
  mattersProgrammeListPageUtils
} from '../../../device/utils/index'
import { QuestionFilled } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import Detail from './dialog/detail.vue'
import { useRouter } from 'vue-router'

const lastTime = ref('')
const updateTime = () => {
  lastTime.value = moment().format('YYYY-MM-DD HH:mm:ss')
}

const router = useRouter()
const supList: any = ref([])
const emit = defineEmits(['changeType'])

const dealRef = ref()
const selRef = ref()
const searchParams: any = ref({})
const props: CnPage.Props = reactive({
  params: searchParams,
  action: (params) => {
    // 地区搜索
    if (params.obj.provinceCode) {
      params.obj.province = params.obj.provinceCode
      delete params.obj.provinceCode
    }
    if (params.obj.cityCode) {
      params.obj.city = params.obj.cityCode
      delete params.obj.cityCode
    }
    if (params.obj.districtCode) {
      params.obj.district = params.obj.districtCode
      delete params.obj.districtCode
    }
    if (params.obj.streetCode) {
      params.obj.street = params.obj.streetCode
      delete params.obj.streetCode
    }
    if (params.obj.villageCode) {
      params.obj.village = params.obj.villageCode
      delete params.obj.villageCode
    }

    // ip最近变动时间
    if (params.obj.ipLastChange) {
      params.obj.ipLastChangeStartTime = params.obj.ipLastChange[0]
      params.obj.ipLastChangeEndTime = params.obj.ipLastChange[1]
      delete params.obj.ipLastChange
    }

    getDeviceInfoAndOffline()
    updateTime()
    return ListRequest(params)
  },
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
        prop: 'technicalSupportUnitList',
        component: 'select',
        props: { options: supList, multiple: true }
      },
      {
        label: '设备监控状态',
        prop: 'device_status',
        component: 'slot'
      },
      {
        label: '设备类型',
        prop: 'devTypeList',
        component: 'select',
        dict: 'DEV_TYPE',
        props: { multiple: true }
      },
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
        label: '导出',
        type: 'warning',
        onClick: () => {
          monitorCodeExport(searchParams.value).then((res: any) => {
            let blob = new Blob([res.data], {
              type: res.headers['content-type'] || 'application/vnd.ms-excel'
            })
            let href = window.URL.createObjectURL(blob)
            let downloadElement = document.createElement('a')
            downloadElement.href = href
            downloadElement.download = '设备状态监控.xlsx'
            document.body.appendChild(downloadElement)
            downloadElement.click() //点击下载
            document.body.removeChild(downloadElement) //下载完成移除元素
          })
        }
      }
    ]
  },
  table: {
    rowKey: 'id',
    columns: [
      { slot: 'proDevCode', label: '设备编号' },
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
// 设备量和离线警告
const deviceInfo: any = ref({})
const getDeviceInfoAndOffline = () => {
  monitorHeartStatisticsStatusMonitor(searchParams.value).then((res) => {
    deviceInfo.value = res.data
  })
}

// 刷新
const fresh = ref<string>(localStorage.getItem('device_status_fresh') || '0')
let timer: any = null
const handleFresh = (val: string) => {
  if (val == '0') {
    timer && window.clearInterval(timer)
  } else if (val == '1') {
    timer && window.clearInterval(timer)
    timer = setInterval(() => {
      props.refresh = new Date().getTime()
    }, 60 * 1000)
  } else if (val == '5') {
    timer && window.clearInterval(timer)
    timer = setInterval(
      () => {
        props.refresh = new Date().getTime()
      },
      5 * 60 * 1000
    )
  } else if (val == '10') {
    timer && window.clearInterval(timer)
    timer = setInterval(
      () => {
        props.refresh = new Date().getTime()
      },
      10 * 60 * 1000
    )
  }
  localStorage.setItem('device_status_fresh', val)
}
handleFresh(fresh.value)

onMounted(async () => {
  supList.value = await getUnitListUtils().then((res) => {
    return res
  })
})

onUnmounted(() => {
  timer && window.clearInterval(timer)
})

// 查看详情
const detailDialogRef = ref()
const handleDetail = (code: string) => {
  detailDialogRef.value.open(code)
}
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

.fresh {
  display: flex;
  justify-content: flex-end;
  position: relative;
  top: -30px;
}
.lasttime {
  text-align: right;
  padding: 10px 10px;
  color: #909399;
  font-size: 0.9em;
}
.sum {
  height: 60px;
  border: 1px solid #ebeef5;
  display: flex;
  font-size: 14px;
  margin-bottom: 10px;
  .title {
    padding: 0 10px;
    line-height: 60px;
    font-weight: bold;
    font-size: 1.3em;
    width: 100px;
    background: #f1efef;
  }
  .content {
    flex: 1;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    line-height: 30px;
    gap: 30px;
    padding: 0 20px;
  }
  .num {
    font-weight: bold;
    font-size: 1.2em;
  }
  .per {
    display: inline-block;
    padding: 0 5px;
    background: #ccc;
    border-radius: 6px;
    line-height: 20px;
    margin-left: 5px;
    margin-right: 5px;
    color: #fff;
  }
  .showChart {
    margin-left: auto;
    color: #409eff;
    cursor: pointer;
  }
  .icon {
    color: #b6b3b3;
    position: relative;
    top: 2px;
    font-size: 16px;
  }
}

.device-sum {
  .title {
    background: #d9ecff;
    color: #409eff;
  }
}

.offline-sum {
  .title {
    background: #faecd8;
    color: #e6a23c;
  }
}
</style>
