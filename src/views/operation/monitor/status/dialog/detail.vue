<template>
  <CnDialog ref="dialogRef" width="800px" title="详情">
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="基本信息" name="1"> </el-tab-pane>
      <el-tab-pane label="硬件信息" name="2"> </el-tab-pane>
      <el-tab-pane label="部署场所" name="3"> </el-tab-pane>
      <el-tab-pane label="配置信息" name="4"> </el-tab-pane>
    </el-tabs>

    <template #footer>
      <el-button @click="handleCancel">关闭</el-button>
    </template>
  </CnDialog>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick, watch, onMounted, computed } from 'vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'
import { monitorHeartStatisticsGet } from '@/api'
const activeName = ref('1')
const dialogRef = ref()
let devCode = ''
const open = (id) => {
  devCode = id
  dialogRef.value.open()
  getDetail()
}

const handleCancel = () => {
  dialogRef.value.close()
}

defineExpose({ open })

const getDetail = () => {
  monitorHeartStatisticsGet(devCode).then((res: any) => {
    console.log('res: ', res)
  })
}
</script>

<style scoped lang="scss">
.menu {
  display: flex;
  flex-direction: column;
}
</style>
