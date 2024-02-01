<template>
  <div class="htime">
    <div class="htime_time">共耗时：<span>{{props.data.takeUpTime}}</span></div>
    <div>耗时计算规则：从创建工单到完成处理，计算工单耗时时长，精确到分钟</div>
  </div>
  <el-timeline class="line">
    <el-timeline-item v-for="(item, index) in list" :key="index">
      <div class="line_left">
        <div>{{ item.handleUser }}</div>
        <div>{{ item.handleDept }}</div>
      </div>
      <el-row class="line_right">
        <el-col :span="18">
          <div class="line_right_tl">
            {{ useDictionary('WORK_AUDIT_TYPE', item.workAuditType) }}
          </div>
          <!-- 运维、耗材工单的运维方式 -->
          <div
            v-if="
              item.workAuditType === '6' &&
              (props.data.workTypeId === '1' || props.data.workTypeId === '2')
            "
          >{{ item.remark }}</div>

          <div v-if="item.workAuditType === '8'">描述：{{ item.remark }}</div>
          <div v-if="item.workAuditType === '97'">回访记录：{{ item.remark }}</div>

          <div
            v-if="['3', '4'].includes(item.workAuditType)"
            style="white-space: pre-line"
          >
            {{ item.remark }}
          </div>
          <div v-if="item.workAuditType === '96'">
            <div>态度：<el-rate v-model="item.evaluationAttitude" disabled /></div>
            <div>效率：<el-rate v-model="item.evaluationEfficiency" disabled /></div>
            <div>{{ item.remark.split('\n')[0] }}</div>
            <div style="white-space: pre-line">评价：{{ remarkFilter(item.remark) }}</div>
          </div>
          <div v-if="item.workAuditType === '8' && item.handleFile">
            <CnImage :modelValue="item.handleFile" />
          </div>
        </el-col>
        <el-col :span="6" v-if="item.handleTime">
          <div>{{ moment(item.handleTime).format('YYYY-MM-DD') }}</div>
          <div>{{ moment(item.handleTime).format('HH:mm:ss') }}</div>
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
  data: {
    type: Object,
    default: () => ({})
  }
})

const list = ref()

orderProcess(props.data.id).then((res) => {
  if (res.code === '200') {
    list.value = res.data
  }
})

const remarkFilter = (str: string) => {
  if (!str) return '--'
  const [, ...result] = str.split('\n')
  return result.join('\n')
}

</script>

<style lang="scss" scoped>
.line {
  padding-left: 30%;
  &_left {
    position: absolute;
    left: -237px;
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

.htime {
  margin: 0 0 30px 30px;
  &_time {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }
}

:deep(.el-timeline-item__node) {
  background-color: #006eff;
}
</style>
