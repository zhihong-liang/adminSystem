<template>
  <CnPage v-bind="props">
    <template #avatar="{ row }">
      <img :src="row.avatar" height="80" />
    </template>
  </CnPage>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { getUsers } from '@/api'
import CnPage from '@/components/cn-page/CnPage.vue'

const init: Promise<void> = new Promise((resolve) =>
  setTimeout(() => {
    // props.params.realname = '石'
    resolve()
  }, 1000)
)

const props = reactive<CnPage.Props>({
  init,
  params: {},
  action: getUsers,
  search: {
    items: [{ prop: 'realname', label: '姓名', component: 'input' }]
  },
  toolbar: {
    items: [
      {
        label: '新增',
        type: 'primary',
        onClick: () => {
          console.log('新增')
        }
      }
    ]
  },
  table: {
    columns: [
      { label: '姓名', prop: 'realname' },
      { label: '性别', prop: 'sex', dict: 'SEX' },
      { label: '头像', prop: 'avatar', slot: 'avatar' }
    ]
  },
  pagination: false
})
</script>
