<template>
  <CnPage v-bind="props" />
  <CnDialog v-bind="dialogProps" ref="dialogRef">
    <template #add>
      <el-button type="success">增加授权</el-button>
    </template>
  </CnDialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import CnPage from '@/components/cn-page/CnPage.vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'

const dialogRef = ref<InstanceType<typeof CnDialog>>()
const dialogProps = reactive<CnPage.DialogProps>({
  title: '新增用户',
  formProps: {
    model: { position: [] },
    items: [
      { label: '基本信息', component: 'subtitle', span: 24 },
      { label: '用户编号', prop: 'code', component: 'input' },
      { label: '用户名称', prop: 'code', component: 'input' },
      { label: '登录手机号', prop: 'code', component: 'input' },
      { label: '联系电话', prop: 'code', component: 'input' },
      { label: '电子邮箱', prop: 'code', span: 24, component: 'input' },
      { label: '状态', prop: 'code', span: 24, component: 'radio' },
      { label: '授权信息', component: 'subtitle', span: 24 },
      {
        prop: 'auth',
        component: 'group',
        props: {
          children: [
            { label: '单位类型', prop: 'type', component: 'select' },
            { label: '单位', prop: 'unit', component: 'select' },
            { label: '角色', prop: 'role', component: 'select' },
            { label: '岗位', prop: 'position', component: 'input' },
            { label: '功能权限', prop: 'porperty', component: 'select' },
            { label: '数据权限', prop: 'data', component: 'select' }
          ]
        }
      },
      { prop: 'add', component: 'slot', span: 24 }
    ],
    colSpan: 12
  },
  onSubmit: () => {
    console.log({ ...dialogProps.formProps?.model })
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('')
      }, 2000)
    })
  }
})

const props: CnPage.Props = reactive({
  params: {},
  action: () => Promise.reject(),
  search: {
    items: [
      { label: '用户名称', prop: 'name', component: 'input' },
      { label: '登录手机号', prop: 'phone', component: 'input' }
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
      { prop: 'code', label: '用户编号' },
      { prop: 'code', label: '用户名称' },
      { prop: 'code', label: '登录手机号' },
      { prop: 'code', label: '单位名称' },
      { prop: 'code', label: '单位层级' },
      { prop: 'code', label: '类型' },
      { prop: 'code', label: '岗位' },
      { prop: 'code', label: '状态' },
      { prop: 'code', label: '创建时间' },
      {
        prop: 'action',
        label: '操作',
        buttons: [
          { label: '查看', type: 'primary' },
          { label: '编辑', type: 'warning' }
        ]
      }
    ]
  }
})
</script>

<style lang="scss" scoped>
.add-auth {
  margin-top: -120px;
  text-align: right;
  width: 100%;
}
</style>
