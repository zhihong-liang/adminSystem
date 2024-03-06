<template>
  <CnForm v-bind="baseForm" ref="formRef">
    <template #paidan>
      <CnPage v-bind="pdPage" style="width: 100%" />
      <div class="chost">
        <span v-if="choisePerson?.name"
          >已选运维人员<el-tag class="chost_tag"
            >{{ choisePerson?.name }} {{ choisePerson?.phone }}</el-tag
          ></span
        >
      </div>
    </template>

    <template #handlSlot>
      <div style="color: red">注：如需修改上门服务时间，请与客户联系后再进行修改</div>
    </template>

    <template #eveaSlot>
      <div style="margin-right: 30px">
        <div>态度：<el-rate v-model="baseForm.model.evaluationAttitude" /></div>
        <div>效率：<el-rate v-model="baseForm.model.evaluationEfficiency" /></div>
      </div>
    </template>

    <template #amap>
      <Amap @success="handleAddress" />
    </template>
  </CnForm>
</template>

<script lang="ts" setup>
import CnForm from '@/components/cn-page/CnForm.vue'
import { reactive, ref, inject, computed } from 'vue'
import CnPage from '@/components/cn-page/CnPage.vue'
import { getUnitList, getUserList } from '@/api/admin'
import { useLoginStore } from '@/stores'
import Amap from './amap.vue'

const { userInfo } = useLoginStore()

const btnType = ref(inject('btnType') as string)
const homeData = ref(inject('homeData') as Record<string, unknown>)

const formRef = ref()
const unitList = ref()
const userList = ref()

const choisePerson = ref()

const allForm: any = reactive({
  Supply: [{ label: '补充说明', prop: 'remark', component: 'input', props: { type: 'textarea' } }],
  Allocation: [
    {
      label: '运维单位',
      prop: 'operationUnitId',
      component: 'select',
      props: { options: computed(() => unitList.value), onChange: (val: string) => changeUnit(val) }
    },
    {
      label: '运维人员',
      prop: 'operationPersonId',
      component: 'select',
      props: {
        options: computed(() => userList.value),
        onChange: (val: string) => {
          baseForm.model.operationPersonContact = userList.value.find(
            (v: { id: string }) => val === v.id
          ).telephone
        }
      }
    },
    { label: '手机号码', prop: 'operationPersonContact' }
  ],
  Dispatch: [{ component: 'slot', prop: 'paidan' }],
  Transfer: [
    { component: 'slot', prop: 'paidan' },
    { label: '转单原因', component: 'input', prop: 'remark' }
  ],
  Handle: [
    { label: '运维人员姓名', prop: 'operationPersonName' },
    { label: '运维人员手机号码', prop: 'operationPersonContact' },
    { component: 'slot', prop: 'handlSlot' },
    {
      label: '运维方式',
      prop: 'repairType',
      component: 'select',
      dict: 'WORK_ORDER_REAIR_TYPE',
      props: {
        onChange: () => {
          baseForm.model.position = ''
        }
      }
    },
    {
      label: '到达现场',
      prop: 'amap',
      component: 'slot',
      visible: () => baseForm.model?.repairType === '2'
    },
    {
      label: '到达现场时间',
      prop: 'positionTime',
      component: 'datepicker',
      visible: () => baseForm.model?.repairType === '2',
      props: {
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm',
        dateFormat: 'MMM DD, YYYY',
        timeFormat: 'HH:mm'
      }
    }
  ],
  FinishDeal: [
    { label: '运维人员姓名', prop: 'operationPersonName' },
    { label: '运维人员手机号码', prop: 'operationPersonContact' },
    { label: '运维方式', prop: 'repairType', dict: 'WORK_ORDER_REAIR_TYPE' },
    { label: '运维说明', prop: 'remark', component: 'input', props: { type: 'textarea' } },
    { label: '图片(上传签收单)', prop: 'handleFile', component: 'upload' }
  ],
  Back: [
    { label: '退回原因', prop: 'dfThresult', component: 'select', dict: 'WORK_ORDER_REPULSE_TYPE' },
    { label: '备注', prop: 'name', component: 'input', props: { type: 'textarea' } }
  ],
  Close: [
    { label: '关闭原因', prop: 'dfGbresult', component: 'select', dict: 'WORK_ORDER_CLOSE_TYPE' },
    { label: '备注', prop: 'remark', component: 'input', props: { type: 'textarea' } }
  ],
  Finish: [
    {
      label: '完成原因',
      prop: 'dfEcresult',
      component: 'select',
      dict: 'WORK_ORDER_END_TYPE'
    },
    { label: '备注', prop: 'remark', component: 'input', props: { type: 'textarea' } }
  ],
  Evaluate: [
    { label: '评价', prop: 'eveaSlot', component: 'slot' },
    { label: '处理结果', prop: 'dfClesult', component: 'radio', dict: 'WORK_ORDER_RESULT' },
    { label: '评价内容', prop: 'remark', component: 'input', props: { type: 'textarea' } }
  ],
  Visit: [
    { label: '是否满意', prop: 'followUp', component: 'radio', dict: 'WORK_ORDER_SATISFACTION' },
    { label: '回访记录', prop: 'remark', component: 'input', props: { type: 'textarea' } }
  ],
  Repulse: [
    { label: '打回原因', prop: 'dfResult', component: 'select', dict: 'WORK_ORDER_REPULSE' },
    { label: '备注', prop: 'remark', component: 'input', props: { type: 'textarea' } }
  ]
} as Record<string, unknown>)

const baseForm = reactive<CnPage.DialogProps>({
  model: {},
  items: allForm[btnType.value],
  labelWidth: 100,
  colSpan: 24,
  rules: {
    operationUnitId: [{ required: true, message: '请选择运维单位' }],
    operationPersonId: [{ required: true, message: '请选择运维人员' }],
    dfThresult: [{ required: true, message: '请选择退回原因' }],
    dfGbresult: [{ required: true, message: '请选择关闭原因' }],
    dfEcresult: [{ required: true, message: '请选择完成原因' }],
    dfClesult: [{ required: true, message: '请选择处理结果' }],
    followUp: [{ required: true, message: '请选择是否满意' }],
    dfResult: [{ required: true, message: '请选择打回原因' }],
    repairType: [{ required: btnType.value === 'Handle', message: '请选择运维方式' }],
    handleFile: [{ required: true, message: '请上传签收单' }],
    amap: [
      {
        required: true,
        validator: (rule: any, value: any, callback: any) => {
          if (!baseForm.model.position) {
            callback(new Error('不能为空'))
          } else {
            callback()
          }
        }
      }
    ],
    eveaSlot: [
      {
        required: true,
        validator: (rule: any, value: any, callback: any) => {
          if (baseForm.model.evaluationAttitude && baseForm.model.evaluationEfficiency) {
            callback()
          } else {
            callback(new Error('请为态度和效率打分'))
          }
        }
      }
    ],
    remark: [
      {
        required: ['Supply', 'Transfer', 'FinishDeal'].includes(btnType.value),
        message: '不能为空'
      }
    ]
  }
})

switch (btnType.value) {
  case 'Handle':
    baseForm.model.operationPersonName = homeData.value.operationPersonName
    baseForm.model.operationPersonContact = homeData.value.operationPersonContact
    break
  case 'FinishDeal':
    baseForm.model.operationPersonName = homeData.value.operationPersonName
    baseForm.model.operationPersonContact = homeData.value.operationPersonContact
    baseForm.model.repairType = homeData.value.repairType
    break
}

defineExpose({ formRef: formRef, model: baseForm.model })

const pdPage: CnPage.Props = reactive({
  params: { status: '1', currentRoleId: '23', unitId: userInfo.unitId },
  action: getUserList,
  internal: true,
  search: {
    items: [
      // { label: '行政区划', prop: 'regionName', component: 'input' },
      { label: '运维人员', prop: 'name', component: 'input' }
    ]
  },
  table: {
    columns: [
      { prop: 'regionName', label: '行政区域' },
      { prop: 'name', label: '运维人员' },
      { prop: 'phone', label: '手机号码' }
    ],
    highlightCurrentRow: true,
    onCurrentChange: (data) => {
      choisePerson.value = data
      baseForm.model.operationPersonId = data.id
      baseForm.model.operationPersonName = data.name
      baseForm.model.operationPersonContact = data.phone
    }
  }
})

// 查询运维单位
const queryUnitList = () => {
  if (btnType.value === 'Allocation') {
    getUnitList({
      page: 1,
      size: 1000,
      obj: { unitType: '2' }
    }).then((res) => {
      if (res.code === '200') {
        unitList.value = res.rows.map((v) => ({
          label: v.fullName,
          value: v.id
        }))
      }
    })
  }
}
queryUnitList()

// 查询运维人员
const changeUnit = (val: string) => {
  baseForm.model.operationPersonId = ''
  baseForm.model.operationPersonContact = ''

  baseForm.model.operationUnit = unitList.value.find(
    (v: { value: string }) => val === v.value
  ).label
  getUserList({
    page: 1,
    size: 1000,
    obj: {
      status: '1',
      unitId: val,
      currentRoleId: '22'
    }
  }).then((res) => {
    if (res.code === '200') {
      userList.value = res.rows.map((v) => ({
        label: v.name,
        value: v.id,
        ...v
      }))
    }
  })
}

const handleAddress = (data: any) => {
  baseForm.model.position = data.address
}
</script>

<style lang="scss" scoped>
:deep(.el-date-editor--datetime) {
  width: 100%;
}
:deep(.el-form-item .el-form-item) {
  margin-bottom: 18px;
}
.chost {
  overflow: hidden;
  margin: 15px 0;
  &_tag {
    margin-left: 15px;
  }
}
</style>
