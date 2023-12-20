<template>
  <CnPage v-bind="props"></CnPage>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { queryMatterMenulist_No } from '@/api/matter'

import type { MatterMenu, MatterMenuResponse } from '@/views/matter/menu-manage/config/type'

import CnPage from '@/components/cn-page/CnPage.vue'

const router = useRouter()

const props: CnPage.Props = reactive({
  params: {},
  action: queryMatterMenulist_No,
  search: {
    items: [
      { label: '菜单名称', prop: 'menuName', component: 'input' },
      { label: '菜单编号', prop: 'menuCode', component: 'input' },
      { label: '事项名称', prop: 'matterName', component: 'input' },
      { label: '状态', prop: 'status', component: 'select', dict: 'START_STOP' }
    ]
  },
  toolbar: {
    items: [
      {
        label: '新增',
        type: 'primary',
        onClick: () => router.push('/matter/menuManage/add')
      },
      {
        label: '删除',
        type: 'primary',
        plain: true
      }
    ]
  },
  table: {
    rowKey: 'id',
    columns: [
      { type: 'selection', width: '55' },
      { prop: 'menuName', label: '菜单名称' },
      { prop: 'remark', label: '备注' },
      { prop: 'menuLevel', label: '菜单级别', dict: 'MATTERS_MENU_LEVEL' },
      { prop: 'menuCode', label: '菜单编号', dict: 'MENU_STATUS' },
      { prop: 'mattersCount', label: '包含事项数' },
      { prop: 'themeCount', label: '使用主题数' },
      { prop: 'status', label: '状态', dict: 'START_STOP' },
      { prop: 'sort', label: '排序' },
      {
        prop: 'action',
        label: '操作',
        minWidth: 120,
        buttons: [
          { label: '编辑', type: 'primary', text: true },
          { label: '删除', type: 'primary', text: true },
          { label: '复制', type: 'primary', text: true }
        ]
      }
    ],
    lazy: true,
    load: TableLoad,
    treeProps: { children: 'children', hasChildren: 'open' }
  },
  pagination: false,
  refresh: new Date().getTime(),
  transformRequest: (params) => params,
  transformResponse: (params) => ({ rows: params.data, total: 0 })
})

function TableLoad(
  row: MatterMenuResponse,
  treeNode: unknown,
  resolve: (date: MatterMenuResponse[]) => void
) {
  queryMatterMenulist_No({ parentId: row.id } as MatterMenu).then((res) => {
    resolve(res.data)
  })
}
</script>

<style scoped></style>
