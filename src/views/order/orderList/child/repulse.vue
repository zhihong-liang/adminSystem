<!-- 暂时不用了 -->
<template>
  <CnDialog v-bind="dialogProps" ref="dialogRef"></CnDialog>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from 'vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'
import { getUnitList, getUserList } from '@/api/admin'
import { orderBaseDetail, orderRepulse } from '@/api/order'

const emits = defineEmits(['success'])
const unitList = ref()
const userList = ref()

const dialogRef = ref()
const dialogProps: CnPage.DialogProps = reactive({
  title: '打回工单',
  action: () => orderRepulse(dialogProps?.formProps!.model),
  success: () => {
    emits('success')
  },
  formProps: {
    model: {},
    items: [
      { label: '基本信息', component: 'subtitle' },
      { label: '工单来源', prop: 'orderSource', component: 'select', dict: 'ORDER_SOURCE' },
      { label: '关联工单', prop: 'relationOrderNumber' },
      { label: '提交人姓名', prop: 'submitterName', component: 'input' },
      { label: '提交人手机号码', prop: 'submitterPhone', component: 'input' },

      { label: '工单信息', component: 'subtitle' },
      { label: '设备编号', prop: 'devCode' },
      { label: '设备地址', prop: 'address' },
      { label: '设备类型', prop: 'devType', dict: 'DEV_TYPE' },
      { label: '自助终端管理员', prop: 'managePersonName' },
      { label: '手机号码', prop: 'managePersonContact' },
      { label: '描述', prop: 'remark', component: 'input', props: { type: 'textarea' } },
      { label: '图片', prop: 'imagePath', component: 'upload' },
      { label: '紧急程度', prop: 'urgencyLevel', component: 'select', dict: 'WORK_URGENCY_LEVEL' },
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
            dialogProps.formProps.model.operationPersonContact = userList.value.filter(
              (v: { id: string }) => val === v.id
            )[0].telephone
          }
        }
      },
      { label: '手机号码', prop: 'operationPersonContact' }
    ] as any[],
    colSpan: 24,
    rules: {
      name1: [{ required: true, message: '请输入提交人姓名' }]
    }
  }
})

const open = (data: any) => {
  queryDetail(data.id)
  queryUnitList()
}
defineExpose({ open })

// 查询基本信息和工单信息
const queryDetail = (id: string) => {
  orderBaseDetail(id)
    .then((res) => {
      if (res.code === '200') {
        changeUnit(res.data.operationUnitId)
         dialogProps.formProps.model = {
          ...res.data.detail,
          ...res.data,
          relationOrderNumber: res.data.workOrderNumber,
          relationOrderId: res.data.id
         }
         delete dialogProps.formProps.model.id,
         delete dialogProps.formProps.model.workOrderNumber
      }
    })
    .finally(() => {
      dialogRef.value.open()
    })
}

// 查询运维单位
const queryUnitList = () => {
  getUnitList({
    page: 1,
    size: 1000,
    obj: {}
  }).then((res) => {
    if (res.code === '200') {
      unitList.value = res.rows.map((v) => ({
        label: v.fullName,
        value: v.id
      }))
    }
  })
}

// 查询运维人员
const changeUnit = (val: string) => {
  getUserList({
    page: 1,
    size: 1000,
    obj: {
      status: '1',
      unitId: val,
      currentRoleId: '23'
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
</script>
