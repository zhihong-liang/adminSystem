<template>
  <div v-loading="loading">
    <CnSearch
      v-if="inited"
      v-bind="search"
      :model="params"
      :internal="props.internal"
      :class="{ cnsearch: !props.internal }"
      @search="handleQuery()"
      @reset="handleQuery()"
    >
      <template
        v-for="(item, index) in search?.items.filter(
          (e: CnPage.SearchProps) => e.component === 'slot'
        )"
        v-slot:[item.prop]
        :key="index"
      >
        <slot :name="item.prop" />
      </template>
    </CnSearch>

    <div :class="{ cncontent: !props.internal }">
      <CnToolbar v-bind="toolbar" :params="paramsAll" />
      <slot name="addition"></slot>
      <CnTable v-bind="table" :data="data" ref="tableRef">
        <template
          v-for="(column, index) in table?.columns.filter(
            (item: CnPage.TableColumnProps) => item.slot
          )"
          v-slot:[column.slot]="slotProps"
          :key="index"
        >
          <slot v-bind="slotProps" :name="column.slot" />
        </template>
      </CnTable>
      <CnPagination
        v-if="showPagination"
        v-bind="pagination"
        :total="total"
        @update="handleQuery"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, ref, watch, reactive, watchEffect } from 'vue'
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
  'transformResponse',
  'refresh',
  'internal'
])

const inited = ref(false)
const loading = ref(true)
const data = ref<any[]>([])
const showPagination = computed(() => props.pagination !== false)
const page = ref(1)
const size = ref(10)
const total = ref(0)

const tableRef = ref()
const paramsAll = reactive({
  search: {},
  tableList: []
})
paramsAll.search = computed(() => props.params).value
watchEffect(() => {
  paramsAll.tableList = tableRef.value?.$refs?.tableRef.getSelectionRows() || []
})

onBeforeMount(async () => {
  await props.init
  inited.value = true
  loading.value = false
  initPageOpts()
  handleQuery()
})

const handleQuery = (currentPage?: number, pageSize?: number) => {
  if (currentPage) page.value = currentPage
  if (pageSize) size.value = pageSize
  loading.value = true
  const params = props.transformRequest
    ? props.transformRequest(props.params, page.value, size.value)
    : { page: page.value, size: size.value, obj: { ...props.params } }
  props
    .action(params)
    .then((res: ListRes) => {
      const res2 = props.transformResponse ? props.transformResponse(res) : res
      data.value = res2.rows
      total.value = res2.total
    })
    .catch((err: any) => {
      // 这里可以做一些错误提示
      console.log('cn-page component action error', err)
    })
    .finally(() => {
      loading.value = false
    })
}

watch(
  () => props.refresh,
  () => {
    initPageOpts()
    handleQuery()
  }
)

function initPageOpts() {
  if (props.pagination && typeof props.pagination !== 'boolean') {
    page.value = props.pagination.page || 1
    size.value = props.pagination.size || 10
  }
}
</script>

<style lang="scss" scoped>
.cnsearch {
  padding: 20px 20px 10px;
  border-bottom: 20px solid var(--system-container-background);
}
.cncontent {
  padding: 20px;
}
</style>
