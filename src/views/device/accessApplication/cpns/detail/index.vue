<template>
  <div class="detail" v-loading="loading">
    <el-radio-group v-model="activeName" class="tab-con">
      <el-radio-button label="basicInfo">基本信息</el-radio-button>
      <el-radio-button label="nodeInfo">流程信息</el-radio-button>
    </el-radio-group>
    <CnForm v-bind="formProps" ref="formRefWrapper" v-show="activeName === 'basicInfo'">
      <template #basicInfo>
        <div class="title">设备接入单位信息</div>
      </template>
      <template #deviceInfo>
        <div class="title">设备信息</div>
      </template>
    </CnForm>
    <CnPage v-bind="flowProps" v-show="activeName === 'basicInfo'">
      <template #devUnit="{ row }">
        {{ getUnitName(row.devUnit) }}
      </template>
    </CnPage>

    <CnTable v-bind="nodeTableProps" :data="nodeTableData" v-show="activeName === 'nodeInfo'">
      <template #devUnit="{ row }">
        {{ getUnitName(row.handleDept) }}
      </template>
    </CnTable>

    <div class="footer">
      <el-button
        type="primary"
        size="large"
        v-if="model?.auditCurrentStep === '100'"
        @click="revokeAction"
        >撤回</el-button
      >
      <el-button size="large" @click="() => emits('back')">返回</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

import getFormConfig from './form-config'
import flowTableConfig from './flow-table-config'
import getSearchConfig from './flow-search-config'
import nodeTableConfig from './node-table-config'

import { useLoginStore } from '@/stores'

import {
  devAccessApplyDetail,
  devBaseInfoHisList,
  revokeDevApply,
  getDevAccessApplyHis
} from '@/api/device'

import CnForm from '@/components/cn-page/CnForm.vue'
import CnTable from '@/components/cn-page/CnTable.vue'
import CnPage from '@/components/cn-page/CnPage.vue'

interface Props {
  id: string
  unitOptions: CnPage.OptionProps[]
}
const props = defineProps<Props>()

const emits = defineEmits(['back', 'success'])

const userStore = useLoginStore()

const loading = ref(false)
const formRefWrapper = ref<InstanceType<typeof CnForm>>()
const model = ref()
const nodeTableData = ref([])
const activeName = ref('basicInfo')

// 配置
const formProps = reactive<CnPage.FormProps>(getFormConfig(model))
const nodeTableProps = reactive<CnPage.TableProps>(nodeTableConfig)
const flowProps = reactive<CnPage.Props>({
  refresh: 0,
  transformRequest: (params: any, page: number, size: number) => {
    const obj = { ...params, flowId: props.id }
    return { page, size, obj }
  },
  init: undefined,
  params: {
    page: 1,
    size: 10
  },
  action: devBaseInfoHisList,
  search: getSearchConfig(),
  table: flowTableConfig,
  pagination: {
    page: 1,
    size: 10
  }
})

onMounted(() => {
  getDevAccessApplyDetailAction()
  getDevAccessApplyHisAction()
})

async function revokeAction() {
  try {
    const { userId, unitId } = userStore.userInfo
    const data = {
      handleDept: unitId + '',
      handleUser: userId
    }
    await revokeDevApply(props.id, data)
    ElMessage.success('操作成功')
    emits('back')
  } catch (err) {}
}

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

// 获取设备接入流程信息
async function getDevAccessApplyHisAction() {
  try {
    const { data } = await getDevAccessApplyHis(props.id)
    nodeTableData.value = data
  } catch (err: any) {
    ElMessage.error(err)
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
.tab-con {
  margin-bottom: 30px;
}

.title {
  font-size: 16px;
  font-weight: bold;
}

.footer {
  margin-top: 30px;
}
</style>
