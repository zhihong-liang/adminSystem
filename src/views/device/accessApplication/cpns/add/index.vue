<template>
  <div class="add">
    <CnForm v-bind="formProps" ref="formRefWrapper">
      <template #basicInfo>
        <div class="title">基本信息</div>
      </template>
      <template #site>
        <div class="title">部署场所</div>
      </template>
      <template #unitInfo>
        <div class="title">管理单位、技术支持单位</div>
      </template>
      <template #timeSlot v-if="formProps.model!.businessHours === '3'">
        <el-checkbox-group v-model="formProps.model!.timeSlot" @change="handleTimeChange">
          <el-checkbox
            :label="index"
            v-for="(item, index) in formProps.model!.businessHoursList"
            :key="index"
          >
            <span class="label">{{ item.label }}</span>
            <el-time-select
              v-model="item.startTime"
              :max-time="item.endTime"
              placeholder="开始时间"
              start="00:00"
              step="00:15"
              end="23:45" />
            <span class="to">至</span>
            <el-time-select
              v-model="item.endTime"
              :min-time="item.startTime"
              placeholder="结束时间"
              start="00:00"
              step="00:15"
              end="23:45"
          /></el-checkbox>
        </el-checkbox-group>
      </template>
      <!-- 设备终端管理员 -->
      <template #managePersonId>
        <el-autocomplete
          v-model="formProps!.model.managePersonId"
          :fetch-suggestions="querySearch"
          value-key="label"
          clearable
          placeholder="请输入自助终端管理员"
          style="width: 100%"
        />
      </template>
    </CnForm>
    <div class="footer">
      <el-button type="primary" size="large" @click="handleSubmit">提交</el-button>
      <el-button size="large" @click="handleCancel">取消</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import moment from 'moment'

import getFormConfig from './form-config'

import CnForm from '@/components/cn-page/CnForm.vue'

import { getManagePersonList, devAccessApply } from '@/api/device'

const emits = defineEmits(['cancel', 'success'])

const managePersonList = ref<any[]>()

const formRefWrapper = ref<InstanceType<typeof CnForm>>()

const props = defineProps({
  unitOptions: { type: Array, default: () => [] }
})

const formProps = reactive<CnPage.FormProps>(
  getFormConfig(
    computed(() => props.unitOptions),
    managePersonValidator
  )
)

watch(formProps.model?.businessHours, () => {})

// 模糊搜索设备终端管理员
async function querySearch(queryString: string, cb: any) {
  if (!queryString) return []
  try {
    const unitList = await getManagePersonList({
      page: 1,
      size: 1000,
      obj: { currentRoleId: '24', name: queryString, status: '1' }
    })
    const results = unitList.rows.map((i: any) => ({
      value: i.id,
      label: i.name + '' + i.unitName,
      telephone: i.telephone
    }))
    managePersonList.value = results
    return results
  } catch (err) {
    return []
  }
}

// 自助终端管理员校验
function managePersonValidator(rule: any, value: any, callback: any) {
  if (!value) callback()
  if (!managePersonList.value?.find((v) => v.label === value)) {
    callback(new Error('请填写正确的自助终端管理员'))
  } else {
    formProps.model.managePersonContact = managePersonList.value?.find((v) => v.label === value)?.[
      'telephone'
    ]
    callback()
  }
}

function handleTimeChange(val: number) {
  console.log(val)
}

async function addDevAccessApply() {
  try {
    const { userInfo } = JSON.parse(localStorage.getItem('user')!)
    formProps.model.hardware = formProps.model.hardware.join(',')
    formProps.model.networkPolicy = formProps.model.networkPolicy.join(',')
    formProps.model.comeTime = formProps.model.comeTime + ' 00:00:00'
    formProps.model.managePersonId = managePersonList.value?.find(
      (v) => v.label === formProps.model.managePersonId
    )?.['id']
    formProps.model.devUnit = parseInt(formProps.model.devUnit)
    formProps.model.devManageUnit = parseInt(formProps.model.devManageUnit)
    const businessHoursInfo = handleBusinessHoursInfo()
    const point = formProps.model.point.split(',')
    formProps.model.pointLatLng = point[0]
    formProps.model.pointLat = point[1]
    delete formProps.model.businessHoursList
    delete formProps.model.timeSlot
    const data = {
      applyFile: '',
      applyPerson: userInfo.name,
      applyTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      auditCurrentStep: '',
      auditEndTime: '',
      auditStatus: '',
      batchNo: '',
      createTime: '',
      createUser: '',
      dataUnits: [],
      details: [
        {
          ...formProps.model,
          ...businessHoursInfo
        }
      ],
      devAccessUnit: formProps.model.devUnit,
      devNum: 1,
      id: '',
      params: {},
      updateTime: '',
      updateUser: ''
    }

    await devAccessApply(data)
    ElMessage.success('操作成功')
    emits('success')
  } catch (err) {
    formProps.model = {
      businessHours: '2',
      timeSlot: [],
      businessHoursList: [
        { label: '周一', startTime: '', endTime: '' },
        { label: '周二', startTime: '', endTime: '' },
        { label: '周三', startTime: '', endTime: '' },
        { label: '周四', startTime: '', endTime: '' },
        { label: '周五', startTime: '', endTime: '' },
        { label: '周六', startTime: '', endTime: '' },
        { label: '周日', startTime: '', endTime: '' }
      ]
    }
  }
}

function handleSubmit() {
  formRefWrapper.value?.formRef?.validate().then(() => {
    addDevAccessApply()
  })
}

function handleBusinessHoursInfo() {
  const { businessHours, timeSlot, businessHoursList } = formProps.model
  const businessHoursInfo: any = {
    businessHours1: '',
    businessHours2: '',
    businessHours3: '',
    businessHours4: '',
    businessHours5: '',
    businessHours6: '',
    businessHours7: ''
  }
  if (businessHours === '2') {
    businessHoursInfo.businessHours1 = '09:00 - 17:00'
    businessHoursInfo.businessHours2 = '09:00 - 17:00'
    businessHoursInfo.businessHours3 = '09:00 - 17:00'
    businessHoursInfo.businessHours4 = '09:00 - 17:00'
    businessHoursInfo.businessHours5 = '09:00 - 17:00'
    businessHoursInfo.businessHours6 = ''
    businessHoursInfo.businessHours7 = ''
  } else if (businessHours === '1') {
    businessHoursInfo.businessHours1 = '00:00 - 23:45'
    businessHoursInfo.businessHours2 = '00:00 - 23:45'
    businessHoursInfo.businessHours3 = '00:00 - 23:45'
    businessHoursInfo.businessHours4 = '00:00 - 23:45'
    businessHoursInfo.businessHours5 = '00:00 - 23:45'
    businessHoursInfo.businessHours6 = '00:00 - 23:45'
    businessHoursInfo.businessHours7 = '00:00 - 23:45'
  } else {
    for (const index of timeSlot) {
      console.log(businessHoursList[index])
      businessHoursInfo[`businessHours${index + 1}`] =
        businessHoursList[index].startTime + ' - ' + businessHoursList[index].endTime
    }
  }
  return businessHoursInfo
}

function handleCancel() {
  emits('cancel')
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
