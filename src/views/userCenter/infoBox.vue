<template>
  <div class="infoBox-root" :style="styles">
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
defineProps(['title', 'styles', 'formProps'])
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
