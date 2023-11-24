<template>
  <CnPage v-bind="props" />
  <CnDialog ref="dialogRef" v-bind="dialogProps" />
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import CnPage from '@/components/cn-page/CnPage.vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'

const dialogRef = ref()
const dialogProps = reactive<CnPage.DialogProps>({
  title: '新增单位类型',
  formProps: {
    model: { strategy: ['0'] },
    items: [
      { label: '单位类型', prop: 'type', component: 'input' },
      {
        label: '数据权限策略',
        prop: 'strategy',
        component: 'checkbox',
        props: { options: [{ label: '本单位', value: '0' }] }
      }
    ],
    labelWidth: 120,
    rules: {
      type: [{ required: true, message: '请输入单位类型' }],
      strategy: [{ required: true, message: '请选择数据权限策略' }]
    }
  },
  onSubmit: () => {
    console.log({ ...dialogProps.formProps?.model })
    // TODO
  }
})

const props = reactive<CnPage.Props>({
  params: {},
  action: () => Promise.reject('暂无接口'),
  search: {
    items: [{ label: '单位类型', prop: 'type', component: 'input' }]
  },
  toolbar: {
    items: [
      {
        label: '新增',
        type: 'primary',
        onClick: () => {
          dialogRef.value?.open()
        }
      }
    ]
  },
  table: {
    columns: [
      { type: 'index', label: '序号', width: 60 },
      { label: '单位类型', prop: 'type' },
      { label: '使用单位数', prop: 'count' },
      { label: '创建时间', prop: 'createTime' },
      {
        label: '操作',
        prop: 'action',
        buttons: [{ label: '上移' }, { label: '下移' }, { label: '编辑' }, { label: '删除' }]
      }
    ]
  }
})
</script>
