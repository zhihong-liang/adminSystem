<template>
  <CnForm v-bind="baseForm" ref="formRef">
    <template #paidan>
      <CnPage v-bind="pdPage" style="width: 100%" />
      <div class="chost">
        <span>已选运维人员</span>
        <div class="chost_tag">
          <el-tag v-for="(item, index) in 9" :key="index" style="margin: 0 10px 10px 0"
            >张三 13829773455</el-tag
          >
        </div>
      </div>
    </template>

    <template #handlSlot>
      <div style="color: red">注：如需修改上门服务时间，请与客户联系后再进行修改</div>
    </template>

    <template #eveaSlot>
      <div style="margin-right: 30px">
        <div>态度：<el-rate v-model="baseForm.model.attude" /></div>
        <div>效率：<el-rate v-model="baseForm.model.ratio" /></div>
      </div>
      <el-button>重新评分</el-button>
    </template>
  </CnForm>
</template>

<script lang="ts" setup>
import CnForm from '@/components/cn-page/CnForm.vue'
import { reactive, ref, inject, computed } from 'vue'
import CnPage from '@/components/cn-page/CnPage.vue'

const titleType = ref(inject('titleType') as string)

const formRef = ref()

const allForm: any = reactive({
  Supply: [{ label: '补充说明', prop: 'status', component: 'input', props: { type: 'textarea' } }],
  Allocation: [
    { label: '运维单位', prop: 'yuwei', component: 'select', dict: 'USER_STATUS' },
    { label: '运维人员', prop: 'status', component: 'select' },
    { label: '手机号码', prop: 'status' }
  ],
  Dispatch: [{ component: 'slot', prop: 'paidan' }],
  Transfer: [
    { component: 'slot', prop: 'paidan' },
    { label: '转单原因', component: 'input', prop: 'yyuan' }
  ],
  Handle: [
    { label: '运维人员姓名', prop: 'status' },
    { label: '运维人员手机号码', prop: 'status' },
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
    { component: 'slot', prop: 'handlSlot' },
    {
      label: '运维方式',
      prop: 'opetype',
      component: 'select',
      props: {
        options: [
          { label: '电话运维', value: '1' },
          { label: '现场运维', value: '2' }
        ]
      }
    },
    {
      label: '到达现场',
      prop: 'status',
      component: 'select',
      visible: () => baseForm.model?.opetype === '2'
    },
    {
      label: '到达现场时间',
      prop: 'status',
      component: 'input',
      visible: () => baseForm.model?.opetype === '2'
    }
  ],
  FinishDeal: [
    { label: '运维人员姓名', prop: 'name' },
    { label: '运维人员手机号码', prop: 'name' },
    { label: '预约上门服务时间', prop: 'name' },
    { label: '运维方式', prop: 'name' },
    { label: '运维说明', prop: 'name', component: 'input', props: { type: 'textarea' } },
    { label: '图片(上传签收单)', prop: 'name', component: 'input' }
  ],
  Back: [
    { label: '退回原因', prop: 'name', component: 'select' },
    { label: '备注', prop: 'name', component: 'input', props: { type: 'textarea' } }
  ],
  Close: [
    { label: '关闭原因', prop: 'name', component: 'select' },
    { label: '备注', prop: 'name', component: 'input', props: { type: 'textarea' } }
  ],
  Finish: [
    { label: '完成原因', prop: 'name', component: 'select' },
    { label: '备注', prop: 'name', component: 'input', props: { type: 'textarea' } }
  ],
  Evaluate: [
    { label: '评价', prop: 'eveaSlot', component: 'slot' },
    { label: '处理结果', prop: 'name', component: 'radio', dict: 'USER_STATUS' },
    { label: '评价内容', prop: 'name', component: 'input', props: { type: 'textarea' } }
  ],
  Visit: [
    { label: '是否满意', prop: 'name', component: 'radio', dict: 'USER_STATUS' },
    { label: '回访记录', prop: 'name', component: 'input', props: { type: 'textarea' } }
  ]
} as Record<string, unknown>)

const baseForm = reactive<CnPage.DialogProps>({
  model: {},
  items: allForm[titleType.value],
  labelWidth: 100,
  colSpan: 24,
  rules: {
    yuwei: [{ required: true, message: '请选择运维单位' }],
    eveaSlot: [
      {
        required: true,
        validator: (rule: any, value: any, callback: any) => {
          if (baseForm.model.attude && baseForm.model.ratio) {
            callback()
          } else {
            callback(new Error('请为态度和效率打分'))
          }
        }
      }
    ]
  }
})

defineExpose({ formRef: formRef, model: baseForm.model })

const pdPage: CnPage.Props = reactive({
  params: {},
  action: () => Promise.reject(),
  search: {
    items: [
      { label: '行政区域', prop: 'xz', component: 'ad', props: { props: { checkStrictly: true } } },
      { label: '运维人员', prop: 'name', component: 'input' }
    ]
  },
  table: {
    columns: [
      { type: 'selection' },
      { prop: 'ad', label: '行政区域' },
      { prop: 'yunfei', label: '运维人员' },
      { prop: 'phone', label: '手机号码' }
    ]
  }
})
</script>

<style lang="scss" scoped>
:deep(.el-date-editor--datetime) {
  width: 100%;
}
.chost {
  overflow: hidden;
  margin: 15px 0;
  &_tag {
    width: 89%;
    float: right;
  }
}
</style>
