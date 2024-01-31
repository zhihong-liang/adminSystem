<template>
  <CnForm v-bind="baseForm" />
  <div
    class="nodeTag"
    :class="{
      tagBlue: Number(props.data.bpmNodeCode) > 1100 && Number(props.data.bpmNodeCode) <= 1300,
      tagGreen: Number(props.data.bpmNodeCode) > 1300
    }"
  >
    {{ bpmNodeCode }}
  </div>
</template>

<script lang="ts" setup>
import CnForm from '@/components/cn-page/CnForm.vue'
import { reactive } from 'vue'
import useDictionary from '@/hooks/useDictionary'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const bpmNodeCode = useDictionary('WORK_BPM_NODE_CODE', props.data.bpmNodeCode).value

const baseForm = reactive({
  model: props.data,
  items: [
    { label: '工单编号', prop: 'workOrderNumber' },
    { label: '关联工单', prop: 'relationOrderNumber' },
    { label: '工单来源系统', prop: 'orderSourceOs', dict: 'ORDER_SOURCE_OS' },
    { label: '工单来源', prop: 'orderSource', dict: 'ORDER_SOURCE' },
    { label: '提交人姓名', prop: 'submitterName' },
    { label: '提交人手机号码', prop: 'submitterPhone' },
    { label: '派单员姓名', prop: 'dispatcher' },
    { label: '派单员手机号码', prop: 'dispatcherPhone' }
  ],
  labelWidth: 100,
  colSpan: 24,
  rules: {}
})
</script>

<style lang="scss" scoped>
.nodeTag {
  position: absolute;
  right: 15%;
  top: 20%;
  border: 1px solid #f59a23;
  border-radius: 50%;
  width: 130px;
  text-align: center;
  line-height: 130px;
  font-size: 22px;
  font-weight: bold;
  color: #f59a23;
}
.tagBlue {
  color: #02a7f0;
  border: 1px solid #02a7f0;
}
.tagGreen {
  color: #02d77d;
  border: 1px solid #02d77d;
}
</style>
