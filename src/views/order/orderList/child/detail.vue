<template>
  <CnDialog v-bind="dialogProps" ref="dialogRef">
    <el-tabs v-if="!batchType" v-model="activeName">
      <el-tab-pane label="基本信息" name="first">
        <base-infor :data="baseData" />
        <!-- 可以和工单信息合并 -->
      </el-tab-pane>
      <el-tab-pane label="工单信息" name="second">
        <order-infor :data="baseData" />
      </el-tab-pane>
      <el-tab-pane label="工单流程" name="third">
        <process :id="homeData.id" />
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
      <el-button
        v-if="hdType !== 'Look'"
        type="primary"
        :loading="submitting"
        @click="handleSubmit()"
        >提交</el-button
      >
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
import { orderBaseDetail, orderAudit, orderRepulse } from '@/api/order'
import { useLoginStore } from '@/stores'
import { ElMessage } from 'element-plus'
import useDictionary from '@/hooks/useDictionary'

const emits = defineEmits(['success'])
const dialogRef = ref()
const activeName = ref('first')
const hdType = ref('Look')
const batchType = ref()
const detailformRef = ref()
const homeData = ref()

provide(
  'btnType',
  computed(() => hdType.value)
)

provide(
  'homeData',
  computed(() => baseData.value)
)

const { userInfo } = useLoginStore()

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
  Visit: '回访',
  Repulse: '打回工单'
} as Record<string, string>)

const dialogProps = reactive<CnPage.DialogProps>({
  title: '查看'
})

const submitting = ref(false)
const baseData = ref()
const workAuditType = ref()

const open = (type: string, data: any, AuditType: string, batch: boolean) => {
  activeName.value = 'first'
  homeData.value = data
  hdType.value = type
  workAuditType.value = AuditType
  batchType.value = batch
  dialogProps.title = titleName[type]
  queryDetail(data.id)
}
defineExpose({ open })

// 查询基本信息和工单信息
const queryDetail = (id: string) => {
  orderBaseDetail(id)
    .then((res) => {
      if (res.code === '200') {
        baseData.value = {
          ...res.data,
          ...res.data.detail,
        }
      }
    })
    .finally(() => {
      dialogRef.value.open()
    })
}

const handleSubmit = () => {
  const valid = detailformRef.value.formRef.formRef.validate()
  valid.then(() => {
    if (hdType.value === 'Repulse') {
      // 打回工单
      const params = {
        ...baseData.value,
        relationOrderNumber: baseData.value.workOrderNumber,
        relationOrderId: baseData.value.id,
        remark:
          useDictionary('WORK_ORDER_REPULSE', detailformRef.value.model.dfResult).value +
          detailformRef.value.model.remark
      }
      delete params.id, delete params.workOrderNumber

      submitting.value = true
      orderRepulse(params)
        .then((res) => {
          if (res.code === '200') {
            dialogRef.value.close()
            ElMessage.success(res.message)
            emits('success')
          }
        })
        .finally(() => {
          submitting.value = false
        })
    } else {
      const params = {
        ...detailformRef.value.model,
        bpmInstId: homeData.value.bpmInstId,
        bpmNodeCode: homeData.value.bpmNodeCode,
        defId: homeData.value.defId,
        taskId: homeData.value.taskId,
        workOrderId: homeData.value.id,
        workAuditType: workAuditType.value,
        handleUser: userInfo.name, // 处理人姓名
        handleUserId: userInfo.userId,
        handleUserPhone: userInfo.telephone,
        handleDept: userInfo.unitName,
        handleDeptId: userInfo.unitId
      }

      // 完成、退回、关闭、评价，原因和备注拼在一起
      switch (hdType.value) {
        case 'Finish':
          params.remark =
            '完成原因：' +
            useDictionary('WORK_ORDER_END_TYPE', params.dfEcresult).value +
            '\n' +
            params.remark
          break
        case 'Back':
          params.remark =
            '退回原因：' +
            useDictionary('WORK_ORDER_REPULSE_TYPE', params.dfThresult).value +
            '\n' +
            params.remark
          break
        case 'Close':
          params.remark =
            '关闭原因：' +
            useDictionary('WORK_ORDER_CLOSE_TYPE', params.dfGbresult).value +
            '\n' +
            params.remark
          break
        case 'Evaluate':
          params.remark =
            '处理结果：' +
            useDictionary('WORK_ORDER_RESULT', params.dfClesult).value +
            '\n' +
            params.remark
          break
        case 'Transfer':
          if (String(params.operationPersonId) === userInfo.userId) {
            ElMessage.error('不能转派给当前运维人员！')
            return
          } else if (!params.operationPersonId) {
            ElMessage.error('请选择运维人员！')
            return
          }
          break
        case 'Dispatch':
          if (!params.operationPersonId) {
            ElMessage.error('请选择运维人员！')
            return
          }
          break
      }

      submitting.value = true
      orderAudit(params)
        .then((res) => {
          if (res.code === '200') {
            dialogRef.value.close()
            ElMessage.success(res.message)
            emits('success')
          }
        })
        .finally(() => {
          submitting.value = false
        })
    }
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
