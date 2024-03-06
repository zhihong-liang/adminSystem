<template>
  <CnDialog v-bind="{ title: '选择图标' }" ref="iconDialogRef">
    <el-scrollbar>
      <div class="iconDialog-root">
        <div
          v-for="icon in ElIcons"
          :class="[
            'icon-item',
            'flex',
            'flex-column',
            'flex-center',
            'flex-around',
            active(icon.name) ? 'active' : ''
          ]"
          :key="icon.name"
          @click="handleClick(icon)"
        >
          <CnIcon :html="icon.name" size="20px" />
          <el-text size="small">{{ icon.name }}</el-text>
        </div>
      </div>
    </el-scrollbar>

    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </CnDialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import * as ElIcons from '@element-plus/icons-vue'
import CnIcon from '@/components/cn-page/CnIcon.vue'

import CnDialog from '@/components/cn-page/CnDialog.vue'

const props = defineProps({
  value: {
    type: String,
    default: ''
  }
})
const emits = defineEmits(['update:value'])

const iconDialogRef = ref<InstanceType<typeof CnDialog>>()

const icon = ref(props.value)

function active(name: string = '') {
  return icon.value === name
}

function open() {
  iconDialogRef.value!.open()
  icon.value = props.value
}

function handleClick(item: any) {
  icon.value = item.name
}

function handleSubmit() {
  emits('update:value', icon.value)
  iconDialogRef.value?.close()
}

function handleCancel() {
  iconDialogRef.value?.close()
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
.iconDialog-root {
  display: grid;
  justify-content: space-between;
  grid-template-columns: repeat(auto-fill, 120px);
  grid-gap: 10px;
  max-height: 500px;

  .icon-item {
    align-items: center;
    text-align: center;
    height: 80px;
    width: 100px;
    font-size: 13px;
    border: 1px solid #f8f8f8;
    box-sizing: border-box;
    cursor: pointer;
    &.active {
      background-color: var(--system-primary-color);
      color: var(--system-primary-text-color);

      .el-text {
        color: var(--system-primary-text-color);
      }
    }

    &:hover {
      background-color: var(--system-primary-color);
      color: var(--system-primary-text-color);

      .el-text {
        color: var(--system-primary-text-color);
      }
    }
  }
}
</style>
