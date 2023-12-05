<template>
  <el-cascader
    ref="adRef"
    :clearable="true"
    v-model="current"
    :options="division"
    @change="handleChange"
  />
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { CascaderInstance } from 'element-plus'
import useDivision from '@/hooks/useDivision'

const props = defineProps(['model'])
const current = ref<string[]>([])
watch(() => props.model, (model) => {
  if (!model) return []
  const { provinceCode, cityCode, districtCode, streetCode, villageCode } = model || {}
  current.value = [provinceCode, cityCode, districtCode, streetCode, villageCode].filter(Boolean)
}, { deep: true, immediate: true })

const adRef = ref<CascaderInstance>()
const division = useDivision()

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
