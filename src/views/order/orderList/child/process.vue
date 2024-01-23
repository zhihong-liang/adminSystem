<template>
  <el-timeline class="line">
    <el-timeline-item v-for="(item, index) in list" :key="index">
      <div class="line_left">
        <div>{{item.handleUser}}</div>
        <div>{{item.handleDept}}</div>
      </div>
      <el-row class="line_right">
        <el-col :span="18">
          <div class="line_right_tl">{{useDictionary('WORK_AUDIT_TYPE', item.workAuditType)}}</div>
          <div v-if="['3','4','97','99'].includes(item.workAuditType)">{{item.remark}}</div>
          <div v-if="item.workAuditType === '96'">
            <div>态度：<el-rate v-model="item.evaluationAttitude" disabled /></div>
            <div>效率：<el-rate v-model="item.evaluationEfficiency" disabled /></div>
            <div>处理结果：{{item.handleOpion}}</div>
            <div>评价：{{item.remark}}</div>
          </div>
          <div v-if="item.workAuditType ==='99' && item.handleFile">
            <el-image
              v-for="(items, indexs) in item.handleFile.split(',')"
              style="width: 100px; height: 100px; margin-right: 10px"
              :src="items"
              :key="indexs"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="[items]"
              :initial-index="0"
              fit="cover"
            />
          </div>
        </el-col>
        <el-col :span="6" v-if="item.handleTime">
          <div>{{moment(item.handleTime).format('YYYY-MM-DD')}}</div>
          <div>{{moment(item.handleTime).format('HH:mm:ss')}}</div>
        </el-col>
      </el-row>
    </el-timeline-item>
  </el-timeline>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { orderProcess } from '@/api/order'
import useDictionary from '@/hooks/useDictionary'
import moment from 'moment'

const props = defineProps({
  id: {
    type: String,
    default: ''
  }
})

const list = ref()

const value = ref(5)
const srcList = [
  'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
  'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
  'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg'
]

orderProcess(props.id).then((res) => {
  if (res.code === '200') {
    list.value = res.data
  }
})
</script>

<style lang="scss" scoped>
.line {
  padding-left: 30%;
  &_left {
    position: absolute;
    left: -38%;
    width: 220px;
    text-align: right;
    line-height: 26px;
  }
  &_right {
    line-height: 26px;
    &_tl {
      font-weight: bold;
      font-size: 16px;
    }
  }
}
</style>
