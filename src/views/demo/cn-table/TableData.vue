<template>
  <CnTable v-bind="props" v-loading="loading" />
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import CnTable from '@/components/cn-page/CnTable.vue'
import { getUsers, type User } from '@/api'

const props = reactive<CnPage.TableProps<User>>({
  columns: [
    { type: 'selection' },
    { label: '名称', prop: 'realname' },
    { label: '性别', prop: 'sex', dict: 'SEX' },
    { label: '出生日期', prop: 'birthday' }
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
