<script lang="ts" setup>
import { ElIcon } from 'element-plus'

defineProps({
  placeholder: { type: String, default: '请输入' }, // 占位文本
  clearable: { type: Boolean, default: true }, // 默认可清空输入
  slots: { type: Array<any>, default: [] }
})
</script>

<template>
  <el-input :placeholder="placeholder" :clearable="clearable">
    <!-- <template v-for="slot in slots" v-slot:[slot.name]="slotProps" :key="slot.name">
      <el-icon v-if="slot.component === 'icon'"><component :is="slot.label" /></el-icon>
      <el-button v-if="slot.component === 'button'" v-bind="slotProps"></el-button>
    </template> -->
  </el-input>
</template>
