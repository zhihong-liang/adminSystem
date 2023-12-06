<template>
  <CnPage v-bind="props" />
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import CnPage from '@/components/cn-page/CnPage.vue';
import { getLoginLog, type LoginLog } from '@/api/admin'

const props: CnPage.Props<LoginLog> = reactive({
  params: {},
  action: getLoginLog,
  search: {
    items: [
      { label: '用户姓名', prop: 'loginName', component: 'input' },
      { label: '状态', prop: 'status', component: 'select', dict: 'RESULT_TYPE' },
      { label: '操作日期', prop: 'createTime', component: 'datepicker', props: { valueFormat: 'YYYY-MM-DD HH:mm:ss' } },
    ]
  },
  table: {
    columns: [
      { label: '序号', type: 'index', width: 60 },
      { label: '日志编号', prop: 'logNo' },
      { label: '操作分类', prop: 'logType', dict: 'LOING_IN_LOG_TYPE' },
      { label: '用户编号', prop: 'userNo' },
      { label: '用户名称', prop: 'loginName' },
      { label: '状态', prop: 'status', dict: 'RESULT_TYPE' },
      { label: '操作时间', prop: 'createTime' },
      { label: '登录IP', prop: 'loginIp' },
      { label: '浏览器', prop: 'browser' },
      { label: '日志说明', prop: 'msg' }
    ]
  }
})
</script>
