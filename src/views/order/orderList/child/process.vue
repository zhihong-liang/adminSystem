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
            <CnImage :modelValue = item.handleFile />
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
import CnImage from '@/components/cn-page/CnImage.vue'

const props = defineProps({
  id: {
    type: String,
    default: ''
  }
})

const list = ref()

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
