<template>
  <CnPage v-bind="props" />
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import CnPage from '@/components/cn-page/CnPage.vue';
import { getOperationLog } from '@/api/admin'

const props: CnPage.Props = reactive({
  params: {},
  action: getOperationLog,
  search: {
    items: [
      { label: '用户姓名', prop: '', component: 'input' },
      { label: '状态', prop: '', component: 'select', dict: 'STATUS' },
      { label: '操作日期', prop: '', component: 'datepicker' },
    ]
  },
  table: {
    columns: [
      { label: '序号', type: 'index', width: 60 },
      { label: '日志编号', prop: 'id' },
      { label: '操作模块', prop: 'moduleName' },
      { label: '操作分类', prop: 'method' },
      { label: '用户编号', prop: 'userNo' },
      { label: '用户名称', prop: 'operatorName' },
      { label: '状态', prop: 'status' },
      { label: '操作时间', prop: 'no' },
      { label: '登录IP', prop: 'operatorIp' },
      { label: '浏览器', prop: 'browser' },
      { label: '日志说明', prop: 'description' }
    ]
  }
})
</script>
