<template>
  <div class="tree-wrap">
    <el-checkbox v-if="attrs.showCheckbox" v-model="allCheck" label="全选" />
    <el-tree
      :check-strictly="isCheck"
      v-bind="attrs"
      ref="treeRef"
      :node-key="attrs.nodeKey || 'value'"
    />
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, reactive, nextTick, ref, watch } from 'vue'
import { treeToArray } from '@/utils'

const attrs = getCurrentInstance().attrs
const allCheck = ref(false)
const treeRef = ref()
const isCheck = ref<boolean>(true)

nextTick(() => {
  // 树节点赋值回显
  treeRef.value.setCheckedKeys(attrs.modelValue)
  isCheck.value = false
  if (
    attrs.showCheckbox &&
    treeToArray(attrs.data).length === treeRef.value.getCheckedKeys().length
  ) {
    // 全选的回显
    allCheck.value = true
  }
})

// 全选 反选
watch(allCheck, (val) => {
  if (val) {
    treeRef.value.setCheckedNodes(attrs.data)
  } else {
    treeRef.value.setCheckedNodes([])
  }
})
</script>

<style scoped lang="scss">
.tree-wrap {
  display: flex;
  flex-direction: column;
}
</style>
