<template>
  <div>
    <div v-for="(item, index) in timeOptions" :key="index" class="time_item">
      <el-checkbox
        v-model="item.checked"
        :label="item.label"
        size="large"
      />
      <el-time-select
        v-model="item.startTime"
        :max-time="item.endTime"
        placeholder="开始时间"
        start="00:00"
        step="00:15"
        end="23:45"
        style="width: 43%"
        @change="handleChange"
      />
      <el-time-select
        v-model="item.endTime"
        :min-time="item.startTime"
        placeholder="结束时间"
        start="00:00"
        step="00:15"
        end="23:45"
        style="width: 43%"
        @change="handleChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, type PropType, watch } from 'vue';

interface Props {
  businessHours1?: string
  businessHours2?: string
  businessHours3?: string
  businessHours4?: string
  businessHours5?: string
  businessHours6?: string
  businessHours7?: string
}

const props = defineProps({
  modelValue: Object as PropType<Props>
})
watch(() => props.modelValue, (val) => {
  const { businessHours1, businessHours2, businessHours3, businessHours4, businessHours5, businessHours6, businessHours7 } = val || {}
  ;[businessHours1, businessHours2, businessHours3, businessHours4, businessHours5, businessHours6, businessHours7].forEach((hours, index) => {
    const [startTime, endTime] = (hours || '').split(' - ')
    timeOptions[index].checked = !!startTime
    timeOptions[index].startTime = startTime
    timeOptions[index].endTime = endTime
  })
})

const emits = defineEmits(['update:model-value'])

const timeOptions = reactive([
  { checked: true, startTime: "09:00", endTime: "17:00", label: "周一" },
  { checked: true, startTime: "09:00", endTime: "17:00", label: "周二" },
  { checked: true, startTime: "09:00", endTime: "17:00", label: "周三" },
  { checked: true, startTime: "09:00", endTime: "17:00", label: "周四" },
  { checked: true, startTime: "09:00", endTime: "17:00", label: "周五" },
  { checked: false, startTime: "", endTime: "", label: "周六" },
  { checked: false, startTime: "", endTime: "", label: "周日" }
]);
function handleChange() {
  const hours = timeOptions.reduce((acc, cur, index) => {
    const key = `businessHours${index + 1}` as keyof Props
    acc[key] = [cur.startTime, cur.endTime].filter(Boolean).join(' - ')
    return acc
  }, {} as Props)
  emits('update:model-value', hours)
}
</script>

<style lang="scss" scoped>
.time_item {
  align-items: center;
  display: flex;

  .el-checkbox {
    margin-right: 10px;
  }
}
</style>
