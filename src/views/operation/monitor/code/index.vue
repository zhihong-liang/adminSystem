<template>
  <CnPage v-bind="props"></CnPage>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { monitorCodeList as ListRequest, monitorCodeRemove as DelRequest } from '@/api'
import { ElMessageBox, ElMessage } from 'element-plus'

const emit = defineEmits(['changeType'])

const props: CnPage.Props = reactive({
  params: {},
  action: (params) => ListRequest(params),
  search: {
    items: [
      { label: '状态码', prop: 'themeCode', component: 'input' },
      { label: '是否启用', prop: 'status', component: 'select', dict: 'STATUS_CODE_STATUS' },
      { label: '类型', prop: 'type', component: 'select', dict: 'STATUS_CODE_TYPE' }
    ]
  },
  table: {
    rowKey: 'id',
    columns: [
      { prop: 'id', label: '编号' },
      { prop: 'statusCode', label: '状态码' },
      { prop: 'statusDescription', label: '状态描述' },
      { prop: 'moduleName', label: '模块名称' },
      { prop: 'type', label: '类型', dict: 'STATUS_CODE_TYPE' },
      { prop: 'status', label: '状态', dict: 'STATUS_CODE_STATUS' }
    ],
    treeProps: { children: 'childList' }
  },
  pagination: true,
  refresh: new Date().getTime()
  // transformResponse: () => {}
})
</script>

<style scoped lang="scss">
:deep(.启用) {
  color: #67c23a;
}
:deep(.禁用) {
  color: #f56c6c;
}
</style>
