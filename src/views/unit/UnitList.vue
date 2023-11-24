<template>
  <CnPage v-bind="props" />
  <CnDialog ref="dialogRef" v-bind="dialogProps">
    <template #auth>
      <el-tree style="width: 100%" />
    </template>
  </CnDialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import CnPage from '@/components/cn-page/CnPage.vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'

const dialogRef = ref()
const dialogProps = reactive<CnPage.DialogProps>({
  title: '新增单位类型',
  formProps: {
    model: {},
    items: [
      { label: '基本信息', span: 24 },
      { label: '单位名称', prop: 'name', component: 'input' },
      { label: '行政区划', prop: 'ad', component: 'cascader' },
      { label: '单位性质', prop: 'property', component: 'select' },
      { label: '单位类', prop: 'category', component: 'select' },
      { label: '单位类型', prop: 'type', component: 'select' },
      { label: '排序', prop: 'index', component: 'input' },
      { label: '单位地址', prop: 'address', component: 'cascader', span: 24 },
      { label: '状态', prop: 'status', component: 'radio', span: 24 },
      { label: '备注', prop: 'remark', component: 'input', span: 24, props: { type: 'textarea' } },
      { label: '授权信息', span: 24 },
      { prop: 'auth', component: 'slot', span: 24 },
    ],
    colSpan: 12,
    labelWidth: 100
  },
  onSubmit: () => {
    console.log({ ...dialogProps.formProps?.model })
    // TODO
  }
})

const props = reactive<CnPage.Props>({
  params: {},
  action: () => Promise.reject(),
  search: {
    items: [
      { label: '单位名称', prop: 'name', component: 'input' },
      { label: '单位性质', prop: 'property', component: 'select' },
      { label: '单位类型', prop: 'type', component: 'select' }
    ]
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
      { label: '单位名称', prop: 'name' },
      { label: '用户数', prop: 'count' },
      { label: '单位性质', prop: 'property' },
      { label: '单位类', prop: 'category' },
      { label: '单位类型', prop: 'type' },
      { label: '上级单位', prop: 'parent' },
      { label: '创建时间', prop: 'createTime' },
      {
        label: '操作',
        prop: 'action',
        buttons: [
          { label: '编辑', type: 'primary' },
          { label: '删除', type: 'danger' }
        ]
      }
    ]
  }
})
</script>
