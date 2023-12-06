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
      { label: '用户姓名', prop: 'operatorUsername', component: 'input' },
      { label: '状态', prop: 'status', component: 'select', dict: 'RESULT_TYPE' },
      { label: '操作日期', prop: 'createTime', component: 'datepicker', props: { valueFormat: 'YYYY-MM-DD HH:mm:ss' } },
    ]
  },
  table: {
    columns: [
      { label: '序号', type: 'index', width: 60 },
      { label: '日志编号', prop: 'logNo' },
      { label: '操作模块', prop: 'moduleName' },
      { label: '操作分类', prop: 'logType', dict: 'LOG_TYPE' },
      { label: '用户编号', prop: 'operatorNo' },
      { label: '用户名称', prop: 'operatorUsername' },
      { label: '状态', prop: 'status', dict: 'RESULT_TYPE' },
      { label: '操作时间', prop: 'createTime' },
      { label: '登录IP', prop: 'operatorIp' },
      { label: '浏览器', prop: 'browser' },
      { label: '日志说明', prop: 'msg' }
    ]
  }
})
</script>
