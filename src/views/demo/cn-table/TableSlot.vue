<template>
  <CnTable v-bind="props" v-loading="loading">
    <template #sex="{ row }">{{ row.sex === 0 ? '男' : '女' }}</template>
  </CnTable>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import CnTable from '@/components/cn-page/CnTable.vue'
import { getUsers, type User } from '@/api'

const props = reactive<CnPage.TableProps<User>>({
  columns: [
    { type: 'selection' },
    { label: '名称', prop: 'realname' },
    { label: '性别', prop: 'sex', slot: 'sex' },
    { label: '出生日期', prop: 'birthday' },
    {
      label: '操作',
      buttons: [
        {
          label: '编辑',
          type: 'primary',
          onClick: ({ row }) => {
            console.log('编辑操作', row)
          }
        }
      ]
    }
  ],
  data: []
})

const loading = ref(true)

getUsers({ page: 1, size: 20 }).then((res) => {
  props.data = res.list
  props.columns[1].label = '姓名'
  loading.value = false
})
</script>
