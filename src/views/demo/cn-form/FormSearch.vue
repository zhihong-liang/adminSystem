<template>
  <CnSearch v-bind="props" />
</template>

<script lang="ts" setup>
import { reactive, type UnwrapNestedRefs } from 'vue'
import CnSearch from '@/components/cn-page/CnSearch.vue'

const props: UnwrapNestedRefs<CnPage.SearchProps> = reactive<CnPage.SearchProps>({
  model: {},
  items: [
    { label: '姓名', prop: 'name', component: 'input' },
    { label: '性别', prop: 'sex1', component: 'select', dict: 'SEX' },
    {
      label: '性别',
      prop: 'sex',
      component: 'radio',
      props: {
        options: [
          { label: '男', value: 0 },
          { label: '女', value: 1 }
        ]
        // type: "button"
      }
    },
    { label: '出生日期', prop: 'birthday', component: 'datepicker' },
    {
      label: '婚姻状态',
      prop: 'marital',
      component: 'select',
      props: {
        options: [
          { label: '已婚', value: 0 },
          { label: '未婚', value: 1 },
          { label: '离异', value: 2 },
          { label: '丧偶', value: 3 }
        ]
      }
    },
    {
      label: '配偶姓名',
      prop: 'name2',
      component: 'input',
      visible: () => props.model?.marital === 0
    },
    {
      label: '籍贯',
      prop: 'address',
      component: 'cascader',
      props: {
        showAllLevels: false,
        options: [{ label: '广东', value: '44', children: [{ label: '广州', value: '4401' }] }]
      }
    },
    {
      label: '爱好',
      prop: 'hobby',
      component: 'checkbox',
      props: {
        options: [
          { label: '读书', value: 0 },
          { label: '打球', value: 1 }
        ]
        // type: "button"
      }
    }
  ],
  // colSpan: 6,
  // footerSpan: 0,
  labelWidth: 80,
  // labelPosition: 'top',
  onSearch: (data) => {
    console.log(data)
  },
  onReset(data, el) {
    console.log(data, el)
  }
})
</script>
