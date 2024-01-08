<template>
  <CnDialog v-bind="dialogProps" ref="dialogRef">
    <el-tabs v-if="!batchType" v-model="activeName">
      <el-tab-pane label="基本信息" name="first">
        <base-infor />
        <!-- 可以和工单信息合并 -->
      </el-tab-pane>
      <el-tab-pane label="工单信息" name="second">
        <order-infor />
      </el-tab-pane>
      <el-tab-pane label="工单流程" name="third">
        <process />
      </el-tab-pane>
    </el-tabs>

    <!-- 分割线 -->
    <el-divider v-if="!batchType && hdType !== 'Look'" content-position="left" class="divider">{{
      titleName[hdType]
    }}</el-divider>

    <!-- 工单操作组件 -->
    <orderForm v-if="hdType !== 'Look'" ref="detailformRef" />

    <template #footer>
      <el-button @click="dialogRef?.close()">{{ hdType === 'Look' ? '关闭' : '取消' }}</el-button>
      <el-button v-if="hdType !== 'Look'" type="primary" @click="handleSubmit()">提交</el-button>
    </template>
  </CnDialog>
</template>

<script lang="ts" setup>
import { reactive, ref, provide, computed } from 'vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'
import baseInfor from './baseInfor.vue'
import orderInfor from './orderInfor.vue'
import process from './process.vue'
import orderForm from './orderForm.vue'

const emits = defineEmits(['success'])
const dialogRef = ref()
const activeName = ref('first')
const hdType = ref('Look')
const batchType = ref()
const detailformRef = ref()

provide(
  'titleType',
  computed(() => hdType.value)
)

const titleName = reactive({
  Look: '查看',
  Supply: '补充',
  Allocation: '分拨',
  Dispatch: '派单',
  Transfer: '转派',
  Handle: '处理',
  FinishDeal: '完成处理',
  Back: '退回工单',
  Close: '关闭工单',
  Finish: '完成',
  Evaluate: '评价',
  Visit: '回访'
} as Record<string, string>)

const dialogProps = reactive<CnPage.DialogProps>({
  title: '查看'
})

const open = (type: string, batch: boolean) => {
  hdType.value = type
  batchType.value = batch
  dialogProps.title = titleName[type]

  dialogRef.value.open()
}
defineExpose({ open })

const handleSubmit = () => {
  const valid = detailformRef.value.formRef.formRef.validate()
  valid.then(() => {
    console.log('1', detailformRef.value.model)
  })
}
</script>

<style lang="scss" scoped>
.divider {
  margin-bottom: 40px;
  :deep(.el-divider__text) {
    font-size: 18px;
    font-weight: bold;
  }
}
</style>
