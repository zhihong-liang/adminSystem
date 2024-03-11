<template>
  <CnForm :items="items" :col-span="6" :footer-span="footerSpan || 6">
    <template v-for="item in slots" v-slot:[item.prop]="slotProps" :key="item.prop">
      <slot :name="item.prop" v-bind="slotProps" />
    </template>

    <template #footer="{ data, el }">
      <el-button type="primary" :icon="Search" @click="handleSearch(data)"></el-button>
      <el-button :icon="RefreshLeft" @click="handleReset(data, el)"></el-button>
      <el-button @click="moreFun" v-if="showBtn">
        <span v-if="showMore">
          <el-icon><DArrowRight /></el-icon>
        </span>
        <span v-else>
          <el-icon><DArrowLeft /></el-icon>
        </span>
      </el-button>
      <el-button v-if="!props.internal" :icon="Setting" @click="handleSet"></el-button>
    </template>
  </CnForm>
</template>

<script lang="ts" setup>
import { Search, RefreshLeft, Setting } from '@element-plus/icons-vue'
import { watchEffect, ref, type PropType, type UnwrapNestedRefs, onMounted } from 'vue'
import type { FormInstance } from 'element-plus'
import CnForm from './CnForm.vue'

const showBtn = ref(false)
const showMore = ref(true)

const props = defineProps({
  colSpan: { type: Number, default: 6 }, // 弃用，本属性不支持自定义配置
  footerSpan: { type: Number, default: 6 },
  items: {
    type: Array as PropType<UnwrapNestedRefs<CnPage.FormItem>[]>,
    default: () => []
  },
  internal: Boolean
})

const emits = defineEmits(['search', 'reset', 'tableSet'])
const slots = ref<CnPage.FormItemSlotProps[]>([])

watchEffect(() => {
  if (props) {
    slots.value = props.items.filter((v) => v.component === 'slot') as CnPage.FormItemSlotProps[]
  }
})

onMounted(() => {
  if (props.items.length > 3) {
    showBtn.value = true
    props.items.map((item: any, index: number) => {
      if (props.items[0].component === 'subtitle') {
        if (index > 3) item.display = 'none'
      } else if (index >= 3) item.display = 'none'
    })
  }
})

function handleSearch(data: unknown) {
  emits('search', data)
}

function handleReset(data: unknown, el?: FormInstance) {
  el?.resetFields()
  emits('reset', data, el)
}

function moreFun() {
  showMore.value = !showMore.value
  if (showMore.value) {
    props.items.map((item: any, index: number) => {
      if (props.items[0].component === 'subtitle') {
        if (index > 3) item.display = 'none'
      } else if (index >= 3) item.display = 'none'
    })
  } else {
    props.items.map((item: any) => {
      // if (item.visible = () => false) {
      //   item.visible = () => true
      // }
      if (item.display === 'none') {
        item.display = 'block'
      }
    })
  }
}

function handleSet() {
  emits('tableSet')
}
</script>

<style lang="scss" scoped>
:deep(.el-icon) {
  font-size: 18px;
}
</style>
