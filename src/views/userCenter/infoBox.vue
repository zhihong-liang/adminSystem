<template>
  <div class="infoBox-root" :style="{ ...finalWidth, ...finalStyle }">
    <div class="header flex flex-between">
      <div class="left">
        <slot name="left">
          <h2 v-if="title">{{ title }}</h2>
        </slot>
      </div>
      <div class="center">
        <slot name="center"></slot>
      </div>
      <div class="right">
        <slot name="right"></slot>
      </div>
    </div>

    <CnForm v-bind="formProps"></CnForm>

    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import type CnPage from '@/components/cn-page/cn-page'

export interface InfoBoxProps {
  title?: string
  width?: number
  styles?: Object
  edit?: boolean
  formProps: CnPage.FormProps
}

const props = defineProps(['title', 'width', 'styles', 'edit', 'formProps'])
const preComponentType = ref(props.formProps.items.map((c: any) => c.component))

watchEffect(() => {
  transformComponent(props.edit, props.formProps.items)
})

const finalStyle = computed(() => {
  return props.styles ?? {}
})

const finalWidth = computed(() => {
  if (props.width) {
    return {
      width: props.width + 'px',
      'min-width': props.width - 20 + 'px',
      'max-width': props.width + 40 + 'px'
    }
  } else {
    return {}
  }
})

function transformComponent(status: boolean, items: any) {
  if (status === undefined || (items && !items.length)) return

  items.forEach((item: any, index: number) => {
    if (status) {
      item.component = preComponentType.value[index]
    } else {
      item.component = undefined
    }
  })
}
</script>

<style lang="scss" scoped>
.infoBox-root {
  background-color: #fff;
  padding: 15px;
  border-radius: 10px;

  :deep(.el-form) {
    .el-form-item__label {
      margin-bottom: 0px;
      color: #999;
    }
  }
}
.header {
  padding: 10px 0px 20px;
  align-items: center;
}
</style>
