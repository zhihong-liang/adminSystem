<template>
  <CnForm v-bind="props">
    <template #height>
      <el-input-number />
    </template>
  </CnForm>
</template>

<script lang="ts" setup>
import { reactive, watch } from 'vue'
import CnForm from '@/components/cn-page/CnForm.vue'

const props = reactive<CnPage.FormProps>({
  model: {
    name: '张三',
    sex: 0,
    age: 18,
    body: { height: 178, weight: 90 },
    birthday: '2001-10-01',
    address: '广东广州'
  },
  items: [
    { label: '姓名', prop: 'name' },
    {
      label: '性别',
      prop: 'sex',
      component: 'select',
      props: {
        options: [
          { label: '男', value: 0 },
          { label: '女', value: 1 }
        ]
      }
    },
    { label: '年龄', prop: 'age', component: 'input' },
    { label: '出生日期', prop: 'birthday', component: 'datepicker' },
    { label: '身高', prop: 'height', component: 'slot' },
    { label: '体重', prop: 'body.weight' },
    {
      label: '籍贯',
      prop: 'address',
      component: 'cascader',
      props: {
        showAllLevels: false,
        options: [{ label: '广东', value: '44', children: [{ label: '广州', value: '4401' }] }]
      }
    }
  ],
  colSpan: 12,
  labelWidth: 80,
  labelPosition: 'top'
})

watch(
  () => props.model,
  () => {
    console.log(props.model)
  },
  { deep: true }
)
</script>
