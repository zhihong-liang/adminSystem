<template>
  <CnPage v-bind="props" />
  <Detail ref="detailRef" @success="() => { props.refresh = Date.now()}" />
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import CnPage from '@/components/cn-page/CnPage.vue'
import {
  getUserList,
} from '@/api/admin'
import Detail from './child/detail.vue'

const detailRef = ref()

const props: CnPage.Props = reactive({
  params: {},
  action: getUserList,
  search: {
    items: [
      { label: '用户名称', prop: 'name', component: 'input' },
      { label: '登录手机号', prop: 'phone', component: 'input' }
    ]
  },
  toolbar: {
    items: [
      {
        label: '新增',
        type: 'primary',
          onClick: () => { detailRef.value.open('add', {}) }
      }
    ]
  },
  table: {
    columns: [
      { type: 'index', label: '序号', width: 60 },
      { prop: 'userNo', label: '用户编号' },
      { prop: 'name', label: '用户名称' },
      { prop: 'phone', label: '登录手机号' },
      { prop: 'unitName', label: '单位名称' },
      { prop: 'unitLevel', label: '单位层级', dict: 'UNIT_LEVEL' },
      { prop: 'unitType', label: '类型', minWidth: 100 },
      { prop: 'postName', label: '岗位' },
      { prop: 'status', label: '状态', dict: 'USER_STATUS' },
      { prop: 'createTime', label: '创建时间', width: 170 },
      {
        prop: 'action',
        label: '操作',
        buttons: [
          { label: '查看', type: 'primary', onClick: ({row}) => { detailRef.value.open('look', row) } },
          { label: '编辑', type: 'warning', onClick: ({row}) => { detailRef.value.open('edit', row) } }
        ]
      }
    ]
  }
})

</script>
