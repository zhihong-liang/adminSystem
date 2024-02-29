<template>
    <CnPage v-bind="pages" />
  </template>
  
  <script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import CnPage from '@/components/cn-page/CnPage.vue'
  import { getUserList } from '@/api/admin'
  
  const pages: CnPage.Props = reactive({
    params: {},
    action: getUserList,
    search: {
      items: [
        { label: '查询对象', prop: 'name', component: 'select' },
        { label: '事项别名', prop: 'name1', component: 'input' },
        { label: '事项名称', prop: 'name2', component: 'input' },
        { label: '系统层级', prop: 'name2', component: 'select' },
        { label: '事项覆盖范围', prop: 'name2', component: 'ad' },
        { label: '业务部门', prop: 'name2', component: 'select' },
        { label: '办理类型', prop: 'name2', component: 'select' },
        { label: '事项办理区域', prop: 'name2', component: 'ad' },
        { label: '设备类型', prop: 'name2', component: 'select' },
        { label: '事项状态', prop: 'name2', component: 'select' },
        { label: '事项标签', prop: 'name2', component: 'input' },
        { label: '事项上线时间', prop: 'name2', component: 'input' },
        { label: '办理时间', prop: 'name2', component: 'input' },
      ]
    },
    toolbar: {
      items: [
        {
          label: '导出',
          type: 'primary'
        }
      ]
    },
    table: {
      columns: [
        { type: 'selection' },
        { type: 'index', label: '序号', width: 60 },
        { prop: 'name', label: '事项编号' },
        { prop: 'name', label: '事项别名' },
        { prop: 'name', label: '事项名称' },
        { prop: 'name', label: '业务部门' },
        { prop: 'name', label: '覆盖范围' },
        { prop: 'name', label: '办理类型' },
        { prop: 'name', label: '事项状态' },
        { prop: 'name', label: '首次上线时间' },
        { prop: 'name', label: '业务量' },
      ]
    }
  })
  </script>
  