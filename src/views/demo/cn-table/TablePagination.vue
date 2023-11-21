<template>
  <div>
    <CnTable v-bind="tables" v-loading="loading">
      <template #sex="{ row }">{{ row.sex === 0 ? '男' : '女' }}</template>
    </CnTable>
    <CnPagination v-bind="paginations" />
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import CnTable from '@/components/cn-page/CnTable.vue'
import CnPagination from '@/components/cn-page/CnPagination.vue'
import { getUsers, type User } from '@/api'

const tables = reactive<CnPage.TableProps<User>>({
  columns: [
    { type: 'selection' },
    { label: '名称', prop: 'realname' },
    { label: '性别', prop: 'sex', slot: 'sex' },
    { label: '出生日期', prop: 'birthday' }
  ],
  data: []
})

const paginations = reactive<CnPage.PaginationProps>({
  total: 0,
  onUpdate: getUserList
})

const loading = ref(true)

function getUserList(page: number, size: number) {
  loading.value = true
  getUsers({ page, size })
    .then((res) => {
      tables.data = res.list
      tables.columns[1].label = '姓名'
      paginations.total = res.total
    })
    .finally(() => {
      loading.value = false
    })
}
getUserList(1, 10)
</script>
