<template>
  <CnPage v-bind="props" />
  <CnDialog v-bind="dialogProps" ref="dialogRef" />
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import CnPage from '@/components/cn-page/CnPage.vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'

// 模拟数据
const menuTree = [
  { title: '首页', sort: 1, id: 1 },
  { title: '个人中心', sort: 2, id: 2, children: [{ title: '用户详情', sort: 99, id: 99 }] },
  { title: '设备管理', sort: 3, id: 3 },
  { title: '农信社特派员', sort: 4, id: 4 }
]

const dialogRef = ref<InstanceType<typeof CnDialog>>()
const dialogProps: CnPage.DialogProps = reactive({
  title: '新增菜单',
  formProps: {
    model: {},
    items: [
      { label: '标题', prop: 'title', component: 'input' },
      { label: '编码', prop: 'code', component: 'input' },
      { label: '地址', prop: 'title', component: 'input' },
      { label: '组件', prop: 'title', component: 'input' },
      { label: '图标', prop: 'title', component: 'input' },
      { label: '父级菜单', prop: 'title', component: 'input' },
      { label: '类型', prop: 'title', component: 'input' },
      { label: '排序', prop: 'title', component: 'input' },
      { label: '状态', prop: 'status', span: 24, component: 'radio', props: { options: [{ label: '启用', value: 1 }] } },
      { label: '描述', prop: 'title', span: 24, component: 'input', props: { type: 'textarea' } }
    ],
    colSpan: 12,
    rules: {
      title: [{ required: true, message: '请输入标题' }]
    }
  }
})

const props: CnPage.Props = reactive({
  params: {},
  action: () => Promise.resolve({ code: 200, data: { list: menuTree } }),
  search: {
    items: [
      { label: '标题', prop: 'title', component: 'input' },
      { label: '类型', prop: 'type', component: 'select' },
      { label: '状态', prop: 'status', component: 'select' }
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
    rowKey: 'id',
    columns: [
      { prop: 'title', label: '标题' },
      { prop: 'sort', label: '排序' },
      { prop: 'type', label: '类型' },
      { prop: 'type', label: '状态' },
      { prop: 'type', label: '编码' },
      { prop: 'type', label: '地址' },
      { prop: 'type', label: '组件' },
      { prop: 'type', label: '图标' },
      { prop: 'type', label: '描述' },
      {
        prop: 'action',
        label: '操作',
        minWidth: 120,
        buttons: [
          { label: '编辑', type: 'warning' },
          { label: '删除', type: 'danger' }
        ]
      }
    ]
  },
  pagination: false
})
</script>
