<template>
  <div class="search">
    <CnSearch
      v-bind="search"
      :model="search.params"
      @search="handleQuery()"
      @reset="handleQuery()"
    />
    <div class="toolbar">
      <el-button>导出</el-button>
      <el-select v-model="paramTime" @change="handleChangeTime">
        <el-option label="近1天" value="1"></el-option>
        <el-option label="近7天" value="2"></el-option>
        <el-option label="近30天" value="3"></el-option>
      </el-select>
    </div>
    <div class="chart">
      <CnChart :option="chartOption"></CnChart>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onUnmounted, onBeforeMount, onMounted } from 'vue'
import {
  devGroupListUtils,
  getUnitListUtils,
  mattersProgrammeListPageUtils
} from '../../../device/utils/index'
import { monitorHeartStatisticsTrendChart } from '@/api'

import * as echarts from 'echarts'
const supList: any = ref([])
const devList: any = ref([])
const searchParams: any = ref({})

const search = reactive({
  items: [
    {
      label: '行政区划',
      prop: 'region',
      component: 'ad',
      props: { props: { checkStrictly: true } }
    },
    {
      label: '设备类型',
      prop: 'devTypeList',
      component: 'select',
      dict: 'DEV_TYPE',
      props: { multiple: true }
    },
    {
      label: '部署场所类型',
      prop: 'deploymentLocationTypeList',
      component: 'select',
      dict: 'DEV_SITE_TYPE',
      props: { multiple: true }
    },
    {
      label: '设备接入单位',
      prop: 'deviceAccessUnitList',
      component: 'select',
      props: { options: devList, multiple: true }
    },
    {
      label: '设备技术支撑单位',
      prop: 'technicalSupportUnitList',
      component: 'select',
      props: { options: supList, multiple: true }
    }
  ],
  params: searchParams
})

const handleQuery = () => {
  // 地区搜索
  if (searchParams.value.provinceCode) {
    searchParams.value.province = searchParams.value.provinceCode
    delete searchParams.value.provinceCode
  }
  if (searchParams.value.cityCode) {
    searchParams.value.city = searchParams.value.cityCode
    delete searchParams.value.cityCode
  }
  if (searchParams.value.districtCode) {
    searchParams.value.district = searchParams.value.districtCode
    delete searchParams.value.districtCode
  }
  if (searchParams.value.streetCode) {
    searchParams.value.street = searchParams.value.streetCode
    delete searchParams.value.streetCode
  }
  if (searchParams.value.villageCode) {
    searchParams.value.village = searchParams.value.villageCode
    delete searchParams.value.villageCode
  }
  getChartData()
}

onMounted(async () => {
  supList.value = await getUnitListUtils().then((res) => {
    return res
  })
  devList.value = await getUnitListUtils({ unitType: '5' }).then((res) => {
    return res
  })
})
const chartOption: any = ref(null)
const chartData: any = ref({
  time: [],
  sData: [
    {
      name: '在线量',
      data: []
    },
    {
      name: '离线量',
      data: []
    }
  ]
})

const update = () => {
  chartOption.value = {
    title: {
      text: '',
      subtext: ''
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      icon: 'circle',
      left: 'center',
      top: '5',
      show: true
    },

    grid: {
      show: true, //是否显示图表背景网格
      left: '2%', //图表距离容器左侧多少距离
      right: '2%', //图表距离容器右侧侧多少距离
      bottom: '3%', //图表距离容器上面多少距离
      top: '10%', //图表距离容器下面多少距离
      containLabel: true //防止标签溢出
    },
    xAxis: {
      type: 'category',

      data: chartData.value.time
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '在线量',
        type: 'bar',
        barWidth: 30,
        stack: '数量',
        data: chartData.value.sData[0]?.data,
        itemStyle: {
          normal: {
            //颜色渐变
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#FC915A'
              },
              {
                offset: 1,
                color: '#FBDD76'
              }
            ])
          }
        }
      },
      {
        name: '离线量',
        type: 'bar',
        barWidth: 30,
        stack: '数量',
        data: chartData.value.sData[1]?.data,
        itemStyle: {
          normal: {
            //颜色渐变
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#317EEA'
              },
              {
                offset: 1,
                color: '#4DB9F6'
              }
            ])
          }
        }
      }
    ]
  }
}
const paramTime = ref('1')
const handleChangeTime = () => {
  getChartData()
}
const getChartData = () => {
  monitorHeartStatisticsTrendChart({
    ...searchParams.value,
    trendChartTimeType: paramTime.value
  }).then((res) => {
    console.log('res: ', res)
    chartData.value = {
      time: res.data.map((item: any) => item.time),
      sData: [
        {
          name: '在线量',
          data: res.data.map((item: any) => item.onLineCount)
        },
        {
          name: '离线量',
          data: res.data.map((item: any) => item.offLineCount)
        }
      ]
    }
    update()
  })
}

getChartData()
</script>

<style scoped lang="scss">
.chart {
  width: 100%;
  height: 600px;
  box-sizing: border-box;
}

.toolbar {
  display: flex;
  justify-content: space-between;
}
</style>
