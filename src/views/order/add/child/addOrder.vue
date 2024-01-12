<template>
  <CnDialog :title="`新建${propData?.workTypeName}`" ref="dialogRef">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="first">
        <CnForm v-bind="baseForm"></CnForm>
      </el-tab-pane>
      <el-tab-pane label="工作信息" name="second">
        <CnForm v-bind="wordForm">
          <template #deviceSlot>
            <CnDict
              v-model="wordForm.model.devCode"
              component="radio"
              :options="numRadio"
              @change=""
            ></CnDict>
            <CnDict
              v-if="wordForm.model.devCode === '2'"
              v-model="wordForm.model.select"
              multiple
              collapse-tags
              collapse-tags-tooltip
              component="select"
              :options="numSelect"
              @change="changeDict"
            ></CnDict>
            <CnDict
              v-else
              v-model="wordForm.model.select1"
              component="select"
              :options="numSelect"
              @change="changeDict"
            ></CnDict>
          </template>
        </CnForm>
      </el-tab-pane>
    </el-tabs>

    <template #footer>
      <el-button @click="dialogRef?.close()">取消</el-button>
      <el-button type="primary" @click="handleSubmit()">提交</el-button>
    </template>
  </CnDialog>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from 'vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'
import CnForm from '@/components/cn-page/CnForm.vue'
import { getOrderType, orderAddOperat } from '@/api/order'
import { devBaseInfoListPage } from '@/api/device'
import { useLoginStore } from '@/stores'

console.log('useLoginStore', useLoginStore())
const dialogRef = ref()
const propData = ref()
const activeName = ref('first')
const orderList = ref([] as any)
const numSelect = ref([] as any)

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
        options: computed(() => orderList.value)
      }
    },
    { label: '工单来源', prop: 'orderSource', component: 'select', dict: 'ORDER_SOURCE' },
    { label: '提交人', prop: 'submitterName', component: 'input' },
    { label: '提交人电话', prop: 'submitterPhone', component: 'input' },
    { label: '紧急程度', prop: 'urgencyLevel', component: 'select', dict: 'WORK_URGENCY_LEVEL' }
  ],
  labelWidth: 100,
  colSpan: 24,
  rules: {}
})

const wordForm = reactive({
  model: {} as any,
  items: [
    { label: '设备编号', prop: 'deviceSlot', component: 'slot' },
    { label: '情况描述', prop: 'description', component: 'select', dict: 'WORK_DESCIPTION' },
    { label: '备注', prop: 'remark', component: 'input', props: { type: 'textarea' } },
    { label: '附件', prop: 'imagePath', component: 'upload' }
  ],
  labelWidth: 100,
  colSpan: 24,
  rules: {}
})

const open = (data: any) => {
  propData.value = data
  queryOrderType()
  queryDevNum()
  dialogRef.value.open()
}
defineExpose({ open })

const handleSubmit = () => {
  let workOrderBaseList: any[] = []
  const list = numSelect.value.filter((v: any) => v.id === wordForm.model.select1)
  workOrderBaseList = list.map((v: any) => ({
    address: v.regionDetail,
    devId: v.id,
    cityCode: v.cityCode,
    districtCode: v.districtCode,
    streetCode: v.streetCode,
    villageCode: v.villageCode,
    manufacturer: v.manufacturer,
    provinceCode: v.provinceCode,
    defId: propData.value.defId,
    devType: propData.value.devType,
    orderSourceOs: '1',
    createUnitId: '',
    createUnit: '',
    ...baseForm.model,
    ...wordForm.model,
  }))
  const params = {
    ...baseForm.model,
    ...wordForm.model,
    workOrderBaseList: workOrderBaseList
  }
  orderAddOperat(params).then((res: any) => {
    console.log('提交', res)
  })
}

const changeDict = (val) => {
  console.log(val)
  console.log('val', numSelect.value.filter((v) => v.id === val)[0])
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
