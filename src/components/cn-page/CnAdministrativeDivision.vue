<template>
  <el-cascader ref="adRef" :clearable="true" v-model="current" :options="division" @change="handleChange" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { CascaderInstance } from 'element-plus';
import useDivision from '@/hooks/useDivision'

const props = defineProps(['model'])

const adRef = ref<CascaderInstance>()
const division = useDivision()
const current = ref([])

function handleChange(value: string[]) {
  props.model.provinceCode = undefined
  props.model.cityCode = undefined
  props.model.districtCode = undefined
  props.model.streetCode = undefined
  props.model.villageCode = undefined

  if (value) {
    value.forEach((code) => {
      if (code.length === 2) {
        props.model.provinceCode = code
      } else if (code.length === 4) {
        props.model.cityCode = code
      } else if (code.length === 6) {
        props.model.districtCode = code
      } else if (code.length === 9) {
        props.model.streetCode = code
      } else if (code.length === 12) {
        props.model.villageCode = code
      }
    })
  }
}
</script>
