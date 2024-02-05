<template>
  <el-input
    placeholder="请输入"
    v-model="readonPlace"
    readonly
    :suffix-icon="Location"
    @click="open"
  ></el-input>

  <CnDialog title="地址搜索" ref="dialogRef">
    <div class="aMap">
      <div id="container"></div>
      <div class="aMap_box">
        <el-input
          v-model="mapAddress"
          placeholder="请输入关键字"
          id="tipinput"
          style="display: inline"
          @keyup.enter.native="searchKeyWord"
        >
        </el-input>
        <el-button type="primary" @click="searchKeyWord">搜索</el-button>

        <ul class="aMap_box_content" v-if="showResultList">
          <li @click="markerResult(item)" v-for="(item, index) in poiList" :key="index">
            {{ item.name }}
          </li>
        </ul>
      </div>
    </div>

    <template #footer>
      <el-button @click="dialogRef?.close()">取消</el-button>
      <el-button type="primary" @click="handleSubmit()">确定</el-button>
    </template>
  </CnDialog>
</template>

<script lang="ts" setup>
import { ref, onUnmounted, watch } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import { ElMessage } from 'element-plus'
import CnDialog from '@/components/cn-page/CnDialog.vue'
import { Location } from '@element-plus/icons-vue'

let mymap: any = null
let mapModule = ref()
const mapAddress = ref()
const poiList = ref([] as any[])
const showResultList = ref(false)
const address = ref()
const positionInfo = ref({} as any)
const dialogRef = ref()
const readonPlace = ref()

onUnmounted(() => {
  mymap?.destroy()
})

const initAMap = () => {
  AMapLoader.load({
    key: '729ac2afd303f5341d7467ce7aade953', // 申请好的Web端开发者Key，首次调用 load 时必填(这是个人账号)
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [
      'AMap.ToolBar',
      'AMap.Scale',
      'AMap.PlaceSearch', // 地点搜索服务插件，提供某一特定地区的位置查询服务
      'AMap.AutoComplete', // 输入提示插件
      'AMap.Geocoder' // 逆向地理解码插件
    ]
  })
    .then((AMap) => {
      // 保存AMap实例
      mapModule.value = AMap
      mymap = new AMap.Map('container', {
        //设置地图容器id
        viewMode: '3D', //是否为3D地图模式
        zoom: 12 //初始化地图级别
      })
      mymap.addControl(new AMap.Scale()) // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
      mymap.addControl(new AMap.ToolBar()) //在图面添加鹰眼控件，在地图右下角显示地图的缩略图
      // mapSearchInit() //暂时使用自定义的
    })
    .catch((e) => {
      console.log(e)
    })
}

// 输入提示插件Autocomplete
const mapSearchInit = () => {
  const autoOptions = {
    input: 'tipinput'
  }
  const autoComplete = new mapModule.value.Autocomplete(autoOptions)
  autoComplete.on('select', searchKeyWord) // 注册监听，当选中某条记录时会触发
}

//自定义信息窗体
const showInfoWindow = (marker: any) => {
  let infoWindow = new mapModule.value.InfoWindow({
    isCustom: true, //是否自定义信息窗体
    content: `<div style="background-color: white;padding: 5px; border-radius: 5px;border: 1px solid #cccccc;"> 地址：${address.value}</div>`,
    closeWhenClickMap: true,
    zIndex: 999,
    offset: new mapModule.value.Pixel(16, -35)
  })
  infoWindow.open(mymap, marker.getPosition())
}

watch(
  () => mapAddress.value,
  (val: string) => {
    if (val) searchKeyWord()
  }
)

//根据输入内容查询
const searchKeyWord = (e = {}) => {
  if (!mapAddress.value) return

  const placeSearch = new mapModule.value.PlaceSearch()
  placeSearch.search(mapAddress.value, function (status: string, result: any) {
    if (status === 'complete' && result.info === 'OK') {
      showResultList.value = true
      poiList.value = result.poiList.pois
    } else {
      showResultList.value = false
      poiList.value = []
      ElMessage.error('没有查到结果')
    }
  })
}

//选择搜索的内容
const markerResult = (data: any) => {
  const geocoder = new mapModule.value.Geocoder({
    city: '全国', // 地理编码时，设置地址描述所在城市; 默认全国;
    radius: 1000, // 逆地理编码时，以给定坐标为中心点; 默认1000; 取值范围(0-3000)
    extensions: 'all'
  })
  // 调用逆解析方法
  geocoder.getAddress([data.location.lng, data.location.lat], (status: any, result: any) => {
    if (status === 'complete' && result.info === 'OK') {
      address.value = result.regeocode.formattedAddress + '(' + data.name + ')'

      showResultList.value = false
      var marker = new mapModule.value.Marker({
        position: [Number(data.location.lng), Number(data.location.lat)]
      })
      marker.on('click', () => {
        showInfoWindow(marker)
      })
      mymap.clearMap() // 清除所有覆盖物（点标志）
      mymap.add(marker) // 添加点标志
      showInfoWindow(marker)
      setTimeout(() => {
        mymap.setCenter(data.location)
        mymap.setZoom(15)
      }, 50)

      positionInfo.value = {
        address: address.value,
        lng: data.location.lng,
        lat: data.location.lat
      }
    }
  })
}

const open = () => {
  window._AMapSecurityConfig = {
    securityJsCode: 'fe59e0ce4be055a343f20e2b6b4c64a9' // 申请key对应的密钥,如果不搭配密钥使用，搜索将没有结果
  }

  showResultList.value = false
  positionInfo.value = {}
  mapAddress.value = ''
  poiList.value = []

  // 初始化地图
  initAMap()
  dialogRef.value.open()
}
defineExpose({ open })

const emits = defineEmits(['success'])
const handleSubmit = () => {
  if (!address.value) {
    ElMessage.error('请选择地址')
    return
  }

  readonPlace.value = positionInfo.value.address
  emits('success', positionInfo.value)
  dialogRef.value.close()
}
</script>

<style lang="scss" scoped>
#container {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 420px;
}
.aMap {
  position: relative;
  &_box {
    position: absolute;
    top: 20px;
    left: 15px;
    &_content {
      background-color: #fff;
      padding: 0 15px 15px;
      border-radius: 4px;
      width: 237px;
      box-sizing: border-box;
      margin-top: 5px;
      li {
        padding: 5px 0;
        cursor: pointer;
        border-bottom: 1px dashed #e5e5e5;
      }
    }
  }
}
</style>
