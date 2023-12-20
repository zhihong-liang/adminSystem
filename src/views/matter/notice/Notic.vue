<template>
  <CnPage v-bind="props">
    <template #matterCode="{ row }">
      <el-button type="text">{{ row.matterCode }}</el-button>
    </template>
    <template #status="{ row }">
      <el-text v-if="row.status === '1'" type="success"> 上线 </el-text>
      <el-text v-else> 下线 </el-text>
    </template>
  </CnPage>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { getHandleNoticeList } from '@/api/matter'
import CnPage from '@/components/cn-page/CnPage.vue'

import searchConfig from './config/search-config'
import getTollbarConifg from './config/tollbar-config'
import getTableConfig from './config/table-config'

const props = reactive<CnPage.Props>({
  params: {},
  action: getHandleNoticeList,
  search: searchConfig,
  toolbar: getTollbarConifg(),
  table: getTableConfig(),
  pagination: false
})
</script>
