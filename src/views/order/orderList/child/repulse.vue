<template>
  <CnDialog v-bind="dialogProps" ref="dialogRef"></CnDialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'

const dialogRef = ref()
const dialogProps = reactive<CnPage.DialogProps>({
  title: '打回工单',
  action: () => Promise.resolve(),
  formProps: {
    model: {},
    items: [
      { label: '基本信息', component: 'subtitle' },
      { label: '工单来源', prop: 'userNo', component: 'select' },
      { label: '关联工单', prop: 'name' },
      { label: '提交人姓名', prop: 'phone', component: 'input' },
      { label: '提交人手机号码', prop: 'userNoe', component: 'input' },

      { label: '工单信息', component: 'subtitle' },
      { label: '设备编号', prop: 'name' },
      { label: '设备地址', prop: 'userNoe' },
      { label: '设备类型', prop: 'userNoe' },
      { label: '自助终端管理员', prop: 'userNoe' },
      { label: '手机号码', prop: 'userNoe' },
      { label: '描述', prop: 'userNoe', component: 'input', props: { type: 'textarea' } },
      { label: '图片', prop: 'userNoe', component: 'input' },
      { label: '紧急程度', prop: 'userNoe', component: 'select' },
      {
        label: '预约上门服务时间',
        prop: 'yytime',
        component: 'datepicker',
        props: {
          type: 'datetime',
          format: 'YYYY-MM-DD HH:mm',
          dateFormat: 'MMM DD, YYYY',
          timeFormat: 'HH:mm'
        }
      },
      { label: '运维单位', prop: 'userNoe', component: 'select' },
      { label: '运维人员', prop: 'userNoe', component: 'select' },
      { label: '手机号码', prop: 'userNoe' }
    ],
    colSpan: 24,
    rules: {
      name1: [{ required: true, message: '请输入提交人姓名' }]
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

const open = () => {
  dialogRef.value.open()
}
defineExpose({ open })
</script>
