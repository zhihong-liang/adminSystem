<template>
  <CnDialog v-bind="dialogProps" ref="dialogRef">
    <template #sbtable>
      <CnTable v-bind="tableProp" style="margin: 0 0 15px" />
    </template>
  </CnDialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'
import CnTable from '@/components/cn-page/CnTable.vue'

const addType = ref()
const dialogRef = ref()
const dialogProps = reactive<CnPage.DialogProps>({
  title: '新建运维工单',
  action: () => Promise.resolve(),
  formProps: {
    model: {},
    items: [
      { label: '基本信息', component: 'subtitle' },
      { label: '工单来源', prop: 'userNo', component: 'select' },
      { label: '提交人姓名', prop: 'name', component: 'input' },
      { label: '提交人手机号码', prop: 'phone', component: 'input' },
      { label: '工单信息', component: 'subtitle' },
      {
        label: '安装设备台数',
        prop: 'userNoe',
        component: 'input',
        visible: () => addType.value === 'az'
      },
      {
        label: '设备编号',
        prop: 'userNo1',
        component: 'select',
        visible: () => ['yw', 'hc', 'sj'].includes(addType.value)
      },
      { prop: 'sbtable', component: 'slot', span: 24, visible: () => addType.value === 'sj' },
      { label: '描述', prop: 'userNo2', component: 'select' },
      {
        label: '备注',
        prop: 'userNo5',
        component: 'input',
        props: { type: 'textarea' },
        visible: () => addType.value === 'yw' || addType.value === 'hc'
      },
      { label: '图片', prop: 'userNo2', component: 'input' },
      {
        label: '紧急程度',
        prop: 'userNo3',
        component: 'select',
        visible: () => addType.value === 'yw' || addType.value === 'hc'
      },
      {
        label: '预约上门服务时间',
        prop: 'userNo4',
        component: 'select',
        visible: () => addType.value !== 'sj'
      },
      {
        label: '选择区域',
        prop: 'userNo4',
        component: 'select',
        visible: () => addType.value === 'az'
      }
    ],
    colSpan: 24,
    rules: {
      name: [{ required: true, message: '请输入提交人姓名' }],
      userNoe: [{ required: true, message: '请选择工单来源2' }]
    }
  },
  onSubmit: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('')
      }, 2000)
    })
  }
})

const tableProp = reactive<CnPage.TableProps>({
  columns: [
    { type: 'index', label: '序号', width: 60 },
    { label: '设备编号', prop: 'num' },
    { label: '设备接入单位编号', prop: 'num' },
    { label: '设备地址', prop: 'num' },
    { label: '设备类型', prop: 'num', dict: 'DATA_PERMISSION_POLICY' },
    { label: '自助终端管理员', prop: 'num' },
    {
      prop: 'action',
      label: '操作',
      buttons: [
        {
          label: '删除',
          type: 'danger',
          text: true,
          onClick: ({ row }) => {
            console.log('删除')
          }
        }
      ]
    }
  ],
  data: [{ num: '10001' }]
})

const open = (type: string, title: string) => {
  addType.value = type
  dialogProps.title = '新建' + title
  dialogRef.value.open()
}
defineExpose({ open })
</script>
