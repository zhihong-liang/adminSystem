<template>
  <div v-if="props.readonly">{{ viewLabel }}</div>

  <div v-else style="width: 100%">
    <el-cascader
      ref="adRef"
      :clearable="true"
      v-bind="$attrs"
      v-model="current"
      :options="division"
      @change="handleChange"
    />
    <el-form-item v-show="false" prop="provinceCode">
      <input v-model="model.provinceCode" type="hidden" />
    </el-form-item>
    <el-form-item v-show="false" prop="cityCode">
      <input v-model="model.cityCode" type="hidden" />
    </el-form-item>
    <el-form-item v-show="false" prop="districtCode">
      <input v-model="model.districtCode" type="hidden" />
    </el-form-item>
    <el-form-item v-show="false" prop="streetCode">
      <input v-model="model.streetCode" type="hidden" />
    </el-form-item>
    <el-form-item v-show="false" prop="villageCode">
      <input v-model="model.villageCode" type="hidden" />
    </el-form-item>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { CascaderInstance } from 'element-plus'
import useDivision from '@/hooks/useDivision'

const props = defineProps(['model', 'readonly'])
const current = ref<string[]>([])
const viewLabel = ref()
watch(
  () => props.model,
  (model) => {
    if (!model) return []
    const { provinceCode, cityCode, districtCode, streetCode, villageCode } = model || {}
    current.value = [provinceCode, cityCode, districtCode, streetCode, villageCode].filter(Boolean)

    // 查看页面展示
    if (props.readonly) {
      const view = []
      for (let i of current.value) {
        const label = useDivision(i).value[0].label
        view.push(label)
      }
      viewLabel.value = view.join('/')
    }
  },
  { deep: true, immediate: true }
)

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
