<template>
  <div v-loading="loading">
    <CnSearch
      v-if="inited"
      v-bind="search"
      :model="params"
      @search="handleQuery"
      @reset="handleQuery"
    />
    <CnToolbar v-bind="toolbar" />
    <CnTable v-bind="table" :data="data">
      <template
        v-for="(column, index) in table?.columns.filter(
          (item: CnPage.TableProps['columns'][0]) => item.slot
        )"
        v-slot:[column.slot]="slotProps"
        :key="index"
      >
        <slot v-bind="slotProps" :name="column.slot" />
      </template>
    </CnTable>
    <CnPagination v-if="showPagination" v-bind="pagination" :total="total" @update="handleQuery" />
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, ref } from 'vue'
import type { ListRes } from '@/api'
import CnSearch from './CnSearch.vue'
import CnToolbar from './CnToolbar.vue'
import CnTable from './CnTable.vue'
import CnPagination from './CnPagination.vue'

const props = defineProps([
  'search',
  'toolbar',
  'table',
  'pagination',
  'init',
  'action',
  'params',
  'transformRequest',
  'transformResponse'
])

const inited = ref(false)
const loading = ref(true)
const data = ref<any[]>([])
const showPagination = computed(() => !!props.pagination)
const page = ref()
const size = ref()
const total = ref(0)

onBeforeMount(async () => {
  await props.init
  inited.value = true
  loading.value = false
  if (props.pagination && typeof props.pagination !== 'boolean') {
    page.value = props.pagination.page || 1
    size.value = props.pagination.size || 10
  }
  handleQuery()
})

const handleQuery = (currentPage?: number, pageSize?: number) => {
  if (currentPage) page.value = currentPage
  if (pageSize) size.value = pageSize
  loading.value = true
  const params = props.transformRequest ? props.transformRequest(props.params) : props.params
  props
    .action({ page: page.value, size: size.value, ...params })
    .then((res: ListRes) => {
      console.log(res)
      data.value = res.list
      total.value = res.total
    })
    .finally(() => {
      loading.value = false
    })
}
</script>
