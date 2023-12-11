<template>
  <div class="tree-wrap">
    <el-checkbox v-if="attrs.showCheckbox" v-model="allCheck" label="全选" />
    <el-tree
      v-bind="attrs"
      ref="treeRef"
      :node-key="attrs.nodeKey || 'value'"
      :default-checked-keys="attrs.modelValue"
    />
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, reactive, nextTick, ref, watch } from 'vue'
import { treeToArray, getLastLevelNodes } from '@/utils'

const attrs = getCurrentInstance().attrs
const allCheck = ref(false)
const treeRef = ref()
const isCheck = ref<boolean>(false)
const allsubs = []
const subnodes = getLastLevelNodes(attrs.data)

function getLastLevelNodes(tree) {
  let lastLevelNodes = []
  function traverse(node) {
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        traverse(child)
      })
    } else {
      allsubs.push(node[attrs.nodeKey])
      if (attrs.modelValue.includes(node[attrs.nodeKey])) {
        lastLevelNodes.push(node[attrs.nodeKey])
      }
    }
  }
  tree.forEach((item) => {
    traverse(item)
  })

  return lastLevelNodes
}

const reset = () => {
  nextTick(() => {
    // 树节点赋值回显
    treeRef.value.setCheckedKeys(subnodes, false)
    if (allsubs.length === subnodes.length) {
      // 全选的回显
      allCheck.value = true
    }
  })
}
reset()

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
