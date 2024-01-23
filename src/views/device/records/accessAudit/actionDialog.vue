<template>
  <CnDialog v-bind="dialogProps" ref="dialogRef" @close="handleClose">
    <div :class="[isAgreeModel ? 'flex flex-column flex-center' : '']">
      <el-form
        ref="formRef"
        :model="formModel"
        :rules="rules"
        label-width="100"
        v-bind="useAttrs()"
      >
        <template v-if="isAgreeModel">
          <h3 class="mb-lg">确认同意通过本次设备接入申请{{ dataBase.id }} 吗？</h3>
          <el-form-item label="有效期" prop="expirationDate">
            <CnDatePicker v-model="formModel.expirationDate" />
          </el-form-item>
        </template>

        <template v-else>
          <el-form-item label="审核结果" required>
            <span>拒绝</span>
          </el-form-item>
          <el-form-item label="审核备注" prop="handleOpinion">
            <el-input
              v-model="formModel.handleOpinion"
              :rows="2"
              type="textarea"
              placeholder="Please input"
            />
          </el-form-item>
        </template>
      </el-form>
    </div>

    <template #footer>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </CnDialog>
</template>

<script setup lang="ts">
import { ref, reactive, useAttrs, computed } from 'vue'
import { useLoginStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { queryDevAccessApplyAgreeOrReject, type DevAccessAgreeOrReject } from '@/api/device'

import { ElMessage } from 'element-plus'
import CnDialog from '@/components/cn-page/CnDialog.vue'
import CnDatePicker from '@/components/cn-page/CnDatePicker.vue'

const emits = defineEmits(['onSuccess'])

const loginStore = useLoginStore()
const { userInfo } = storeToRefs(loginStore)

const dataBase = ref<any>({})

const dialogRef = ref()
const dialogProps: CnPage.DialogProps = reactive({
  title: '审核',
  width: '30%',
  action: () => Promise.resolve()
})

const formModel = ref({
  expirationDate: '',
  handleOpinion: ''
})

const isAgreeModel = computed(() => dataBase.value.action === 'agree')

const rules = computed(() => {
  if (isAgreeModel.value) {
    return { expirationDate: [{ required: true, message: '请选择有效期' }] }
  } else {
    return { handleOpinion: [{ required: true, message: '请输入审核备注' }] }
  }
})

function handleSubmit() {
  const params: DevAccessAgreeOrReject = {
    id: dataBase.value.id,
    handleUser: userInfo.value.username,
    handleDept: userInfo.value.unitId as string
  }

  if (isAgreeModel) {
    params.expirationDate = formModel.value.expirationDate
  } else {
    params.handleOpinion = formModel.value.handleOpinion
  }

  queryDevAccessApplyAgreeOrReject(params, dataBase.value.action).then((res) => {
    if (res.code === '200') {
      dialogRef.value.close()
      ElMessage({type: "success", message: '操作成功'})
      emits('onSuccess')
    }
  })
}

function handleSuccess() {}

function handleClose() {}

function open(data: any) {
  dialogRef.value.open()
  dataBase.value = { action: data.action, ...data.row }
}

defineExpose({ open })
</script>

<style scoped></style>
