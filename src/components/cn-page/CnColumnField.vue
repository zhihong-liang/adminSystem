<template>
  <el-dialog v-model="dialogRef" title="表格字段选择">
    <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange"
      >全选</el-checkbox
    >
    <el-checkbox-group v-model="checkList" @change="handleCheckedTableChange" class="expCheck">
      <el-checkbox v-for="(item, index) in fieldList" :key="index" :label="item.prop">{{
        item.label
      }}</el-checkbox>
    </el-checkbox-group>

    <template #footer>
      <el-button @click="dialogRef = false">关闭</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, defineExpose, defineEmits } from 'vue'
import { ElMessage } from 'element-plus'

interface fieldTs {
  prop: string
  label: string
}

const dialogRef = ref(false)
const checkAll = ref(true)
const isIndeterminate = ref(false)

const checkList = ref<string[]>([])

const fieldList = ref<fieldTs[]>([])
const fieldKeyList = ref<string[]>([])
const emitsList = ref<string[]>([])

const open = (data: fieldTs[]) => {
  fieldList.value = data
  fieldKeyList.value = data.map((v) => v.prop)
  checkList.value = emitsList.value.length === 0 ? fieldKeyList.value : emitsList.value
  isIndeterminate.value =
    emitsList.value.length === fieldKeyList.value.length || emitsList.value.length === 0
      ? false
      : true
  checkAll.value =
    emitsList.value.length === fieldKeyList.value.length || emitsList.value.length === 0

  dialogRef.value = true
}
defineExpose({ open })

const handleCheckAllChange = (val: boolean) => {
  checkList.value = val ? fieldKeyList.value : []
  isIndeterminate.value = false
}

const handleCheckedTableChange = (value: string[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === fieldKeyList.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < fieldKeyList.value.length
}

const emits = defineEmits(['sumbit'])
const handleSubmit = () => {
  if (checkList.value.length === 0) {
    ElMessage.warning('请选择表格字段')
    return
  }
  emitsList.value = checkList.value
  emits('sumbit', checkList.value)
  dialogRef.value = false
}
</script>

<style lang="scss" scoped>
.expCheck {
  font-size: inherit;
}
</style>
