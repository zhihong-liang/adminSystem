<template>
  <CnForm :items="items" :col-span="colSpan" :footer-span="footerSpan || colSpan">
    <template v-for="item in slots" v-slot:[item.prop]="slotProps" :key="item.prop">
      <slot :name="item.prop" v-bind="slotProps" />
    </template>

    <template #footer="{ data, el }">
      <el-button type="primary" @click="handleSearch(data)">搜索</el-button>
      <el-button @click="handleReset(data, el)">重置</el-button>
      <el-button @click="moreFun" v-if="showBtn">
        <span v-if="showMore">
          更多
          <ArrowDown style="width: 15px; height: 15px; margin-right: 8px" />
        </span>
        <span v-else>
          收起
          <ArrowUp style="width: 15px; height: 15px; margin-right: 8px" />
        </span>
      </el-button>
    </template>
  </CnForm>
</template>

<script lang="ts" setup>
import { watchEffect, ref, type PropType, type UnwrapNestedRefs, onMounted } from 'vue'
import type { FormInstance } from 'element-plus'
import CnForm from './CnForm.vue'

const showBtn = ref(false)
const showMore = ref(true)

const props = defineProps({
  colSpan: { type: Number, default: 6 },
  footerSpan: { type: Number, default: 6 },
  items: {
    type: Array as PropType<UnwrapNestedRefs<CnPage.FormItem>[]>,
    default: () => []
  }
})

const emits = defineEmits(['search', 'reset'])
const slots = ref<CnPage.FormItemSlotProps[]>([])

watchEffect(() => {
  if (props) {
    slots.value = props.items.filter((v) => v.component === 'slot') as CnPage.FormItemSlotProps[]
    console.log('slots.value: ', slots.value)
  }
})

onMounted(() => {
  if (props.items.length > 3) {
    showBtn.value = true
    props.items.map((item: any, index: number) => {
      if (index >= 3) {
        item.display = 'none'
        // item.visible = () => false
      }
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
      if (index >= 3) {
        item.display = 'none'
        // item.visible = () => false
      }
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
</script>
