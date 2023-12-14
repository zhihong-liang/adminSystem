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

    <slot name="content">
      <CnForm v-bind="formProps"></CnForm>
    </slot>
    <slot name="footer"></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps(['title', 'width', 'styles', 'formProps'])

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
