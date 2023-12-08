<template>
  <div class="infoBox-root" :style="{ ...finalWidth }">
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
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps(['title', 'width', 'formProps'])

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
}
.header {
  padding: 10px 0px 20px;
  align-items: center;
}
</style>
