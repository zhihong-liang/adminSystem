<template>
  <div class="add" v-loading="loading">
    <CnForm v-bind="formProps" ref="formRefWrapper">
      <template #basicInfo>
        <div class="title">设备接入单位信息</div>
      </template>
      <template #deviceInfo>
        <div class="title">设备信息</div>
      </template>
    </CnForm>
    <CnTable v-bind="flowTableprops"></CnTable>
    <div class="footer">
      <el-button type="primary" size="large">提交</el-button>
      <el-button size="large" @click="() => emits('back')">返回</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import getFormConfig from './form-config'
import flowTableConfig from './flow-table-config'

import { devAccessApplyDetail } from '@/api/device'

import CnForm from '@/components/cn-page/CnForm.vue'
import CnTable from '@/components/cn-page/CnTable.vue'

interface IProps {
  id: string
  unitOptions: CnPage.OptionProps[]
}
const props = defineProps<IProps>()

const emits = defineEmits(['back', 'success'])

const loading = ref(false)
const formRefWrapper = ref<InstanceType<typeof CnForm>>()
const model = ref()

const formProps = reactive<CnPage.FormProps>(getFormConfig(model))
const flowTableprops = reactive<CnPage.TableProps>(flowTableConfig)

onMounted(() => {
  getDevAccessApplyDetailAction()
})

// 获取设备接入申请表详细信息
async function getDevAccessApplyDetailAction() {
  loading.value = true
  try {
    const { data } = await devAccessApplyDetail(props.id)
    data.devAccessUnit = getUnitName(data.devAccessUnit)
    model.value = data
  } catch (err: any) {
    ElMessage.error(err)
  } finally {
    loading.value = false
  }
}

function getUnitName(id: number) {
  if (props.unitOptions) {
    return props.unitOptions.find((v) => v.value === id)?.label ?? id
  } else {
    return id
  }
}
</script>

<style scoped lang="scss">
.deleteTitle {
  width: 100%;
  display: flex;
  font-size: 20px;
  justify-content: center;
  .labelName {
    color: #409eff;
  }
}
.btns {
  width: 100%;
  justify-content: center;
  display: flex;
}

.title {
  font-size: 16px;
  font-weight: bold;
}

:deep(.el-checkbox-group) {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .el-checkbox {
    margin-bottom: 10px;
    .el-checkbox__label {
      width: 300px;
    }
    .label {
      margin-right: 20px;
    }
    .to {
      margin: 0 10px;
    }
  }
}

.footer {
  margin-top: 30px;
}
</style>
