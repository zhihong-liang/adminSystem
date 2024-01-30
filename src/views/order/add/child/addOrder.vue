<template>
  <CnDialog :title="`新建${propData?.workTypeName}`" ref="dialogRef">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="first">
        <CnForm v-bind="baseForm" ref="baseRef"></CnForm>
      </el-tab-pane>
      <el-tab-pane label="工作信息" name="second">
        <CnForm v-bind="wordForm" ref="wordRef">
          <template #deviceSlot>
            <CnDict
              v-model="wordForm.model.dfdevCode"
              component="radio"
              :options="numRadio"
              @change=""
            ></CnDict>
            <CnDict
              v-if="wordForm.model.dfdevCode === '2'"
              v-model="wordForm.model.select"
              multiple
              collapse-tags
              collapse-tags-tooltip
              component="select"
              :options="numSelect"
            ></CnDict>
            <CnDict
              v-else
              v-model="wordForm.model.select1"
              component="select"
              :options="numSelect"
            ></CnDict>
          </template>
        </CnForm>
      </el-tab-pane>
    </el-tabs>

    <template #footer>
      <el-button v-if="activeName === 'first'" @click="dialogRef?.close()">取消</el-button>
      <el-button type="primary" v-if="activeName === 'first'" @click="handleNext">下一步</el-button>
      <el-button v-if="activeName === 'second'" @click="activeName = 'first'">上一步</el-button>
      <el-button
        type="primary"
        v-if="activeName === 'second'"
        :loading="submitting"
        @click="handleSubmit()"
        >提交</el-button
      >
    </template>
  </CnDialog>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from 'vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'
import CnForm from '@/components/cn-page/CnForm.vue'
import { ElMessage } from 'element-plus'
import {
  orderAddOperat,
  orderAddConsumable,
  orderAddInstallation,
  orderAddUpgrade,
  getOrderType
} from '@/api/order'
import { devBaseInfoListPage } from '@/api/device'
import { useLoginStore } from '@/stores'
import { isNumber } from '@/utils/pattern'

const { userInfo } = useLoginStore()

const dialogRef = ref()
const baseRef = ref()
const wordRef = ref()

const propData = ref({} as any)
const activeName = ref('first')
const orderList = ref([] as any)
const numSelect = ref([] as any)
const submitting = ref(false)

const numRadio = ref([
  { label: '单个设备', value: '1' },
  { label: '多个设备（批量创建多张工单，最多10台）', value: '2' }
])

const baseForm = reactive({
  model: {},
  items: [
    {
      label: '工单类型',
      prop: 'workTypeId',
      component: 'select',
      props: {
        options: computed(() => orderList.value),
        disabled: true
      }
    },
    { label: '工单来源', prop: 'orderSource', component: 'select', dict: 'ORDER_SOURCE' },
    { label: '提交人', prop: 'submitterName' },
    { label: '提交人电话', prop: 'submitterPhone' },
    { label: '紧急程度', prop: 'urgencyLevel', component: 'select', dict: 'WORK_URGENCY_LEVEL' }
  ],
  labelWidth: 100,
  colSpan: 24,
  rules: {
    workTypeId: [{ required: true, message: '请选择工单类型' }],
    orderSource: [{ required: true, message: '请选择工单来源' }],
    submitterPhone: [{ required: true, message: '请输入提交人电话' }],
    urgencyLevel: [{ required: true, message: '请选择紧急程度' }]
  }
})

const wordForm = reactive({
  model: {} as any,
  items: [
    {
      label: '设备编号',
      prop: 'deviceSlot',
      component: 'slot',
      visible: () => propData.value.id !== '3'
    },
    {
      label: '安装设备数',
      prop: 'installationCount',
      component: 'input',
      visible: () => propData.value.id === '3'
    },
    {
      label: '行政区域',
      prop: 'ad',
      component: 'ad',
      props: { props: { checkStrictly: true } },
      visible: () => propData.value.id === '3'
    },
    { label: '情况描述', prop: 'description', component: 'select', dict: 'WORK_DESCIPTION' },
    { label: '备注', prop: 'remark', component: 'input', props: { type: 'textarea' } },
    { label: '附件', prop: 'imagePath', component: 'upload', props: { limit: 8 } }
  ],
  labelWidth: 100,
  colSpan: 24,
  rules: {
    installationCount: [
      { required: true, message: '请输入安装设备数' },
      { pattern: isNumber, message: '请输入正整数' }
    ],
    // ad: [{ required: true, message: '请选择行政区域' }],
    description: [{ required: true, message: '请选择情况描述' }]
  }
})

const open = (data: any) => {
  activeName.value = 'first'
  baseForm.model = {}
  wordForm.model = {}
  propData.value = data
  baseForm.model.workTypeId = data.id
  baseForm.model.submitterName = userInfo.name
  baseForm.model.submitterPhone = userInfo.telephone
  baseForm.model.urgencyLevel = '1'
  queryOrderType()
  queryDevNum()
  dialogRef.value.open()
}
defineExpose({ open })

const handleNext = () => {
  baseRef.value.formRef.validate((valid: boolean) => {
    if (valid) {
      activeName.value = 'second'
    }
  })
}

const handleSubmit = () => {
  const action: Record<string, any> = {
    1: orderAddOperat, // 新增运维接口
    2: orderAddConsumable, // 耗材
    3: orderAddInstallation, // 安装
    4: orderAddUpgrade // 升级
  }

  baseRef.value.formRef.validate((valid: boolean) => {
    if (!valid) {
      activeName.value = 'first'
    }
  })

  const valid1 = baseRef.value.formRef.validate()
  const valid2 = wordRef.value.formRef.validate()
  Promise.all([valid1, valid2]).then(() => {
    let workOrderBaseList: any[] = []
    let list = []
    if (propData.value.id === '3') {
      // 安装工单
      workOrderBaseList.push({
        defId: propData.value.defId,
        orderSourceOs: '1',
        createUnitId: userInfo.unitId,
        createUnit: userInfo.unitName,
        ...baseForm.model,
        ...wordForm.model
      })
    } else {
      if (wordForm.model.dfdevCode === '2') {
        list = numSelect.value.filter((v: any) => wordForm.model.select.includes(v.id))
      } else {
        list = numSelect.value.filter((v: any) => v.id === wordForm.model.select1)
      }

      workOrderBaseList = list.map((v: any) => ({
        address: v.regionDetail + v.detailAddress,
        devId: v.id,
        cityCode: v.cityCode,
        districtCode: v.districtCode,
        streetCode: v.streetCode,
        villageCode: v.villageCode,
        manufacturer: v.manufacturer,
        provinceCode: v.provinceCode,
        devType: v.devType,
        devCode: v.proDevCode,
        defId: propData.value.defId,
        orderSourceOs: '1',
        createUnitId: userInfo.unitId,
        createUnit: userInfo.unitName,
        ...baseForm.model,
        ...wordForm.model
      }))
    }

    const params = {
      ...baseForm.model,
      ...wordForm.model,
      workOrderBaseList: workOrderBaseList
    }

    submitting.value = true
    action[propData.value.id](params)
      .then((res: any) => {
        if (res.code === '200') {
          dialogRef.value.close()
          ElMessage.success(res.message)
        }
      })
      .finally(() => {
        submitting.value = false
      })
  })
}

const queryOrderType = () => {
  getOrderType({
    page: 1,
    size: 1000,
    obj: {}
  }).then((res) => {
    if (res.code === '200') {
      orderList.value = res.rows.map((v) => ({
        label: v.workTypeName,
        value: v.id
      }))
    }
  })
}

const queryDevNum = () => {
  devBaseInfoListPage({
    page: 1,
    size: 1000,
    obj: {}
  }).then((res: any) => {
    if (res.code === '200') {
      numSelect.value = res.rows.map((v: any) => ({
        label: v.proDevCode,
        value: v.id,
        ...v
      }))
    }
  })
}
</script>
