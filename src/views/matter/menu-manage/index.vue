<template>
  <CnPage v-bind="props">
    <template #sort="{ row }">
      <template v-if="parseInt(row.menuLevel) > 1">
        <el-button type="primary" icon="Top" text @click="handleSortAction(row, 'up')"></el-button>
        <el-button
          v-permission="'down'"
          type="primary"
          icon="Bottom"
          text
          @click="handleSortAction(row, 'down')"
        ></el-button>
        <el-button text @click="handleSortAction(row, row.sortTop === 1 ? 'cancelTop' : 'top')">{{
          row.sortTop === 1 ? '取消置顶' : '置顶'
        }}</el-button>
      </template>
    </template>
  </CnPage>
  <MenuDialog ref="menuDialogRef" @success="() => (props.refresh = new Date().getTime())" />
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import useConfirm from '@/hooks/useConfirm'
import {
  queryMatterMenulist_No,
  delMatterMenu,
  upperMatterMenu,
  lowwerMatterMenu,
  isTopMatterMenu
} from '@/api/matter'
import { ElMessage } from 'element-plus'

import CnPage from '@/components/cn-page/CnPage.vue'
import MenuDialog from './components/menuDialog.vue'

import type { MatterMenu, MatterMenuResponse } from '@/views/matter/menu-manage/config/type'

const router = useRouter()

const _resolve = ref()
const menuDialogRef = ref()
const selectedList = ref<MatterMenuResponse[]>([]) // table选中的数据
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
        onClick: () => {
          dialogProps.model = 'add'
          dialogProps.data = {} as any
          menuDialogRef.value.open(dialogProps)
        }
      },
      {
        label: '删除',
        type: 'primary',
        plain: true,
        directives: [{ label: 'permission', value: 'delete' }],
        onClick: () => handleDelete(selectedList.value)
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
      {
        prop: 'sort',
        label: '排序',
        minWidth: 130,
        slot: 'sort'
      },
      {
        prop: 'action',
        label: '操作',
        minWidth: 150,
        buttons: [
          { label: '编辑', type: 'primary', text: true, onClick: handleEdit },
          {
            label: '选择事项',
            type: 'primary',
            text: true,
            onClick: ({ row }: any) =>
              router.push({ path: '/matter/menuManage/chooseMatter', query: { id: row.id } })
          },
          {
            label: '删除',
            type: 'primary',
            text: true,
            directives: [{ label: 'permission', value: 'delete' }],
            onClick: ({ row }) => handleDelete(row)
          },
          { label: '复制', type: 'primary', text: true, onClick: handleCopy }
        ]
      }
    ],
    lazy: true,
    load: TableLoad,
    treeProps: { children: 'children', hasChildren: 'open' },
    selectionChange: (list) => (selectedList.value = list)
  },
  pagination: false,
  refresh: new Date().getTime(),
  transformRequest: (params) => params,
  transformResponse: (params) => ({
    rows: params.data.map((m: any) => ({ ...m, menuLevel: m.menuLevel.toString() })),
    total: 0
  })
})

const dialogProps = reactive({
  model: 'add',
  data: {}
})

function handleCopy({ row }: any): void {
  dialogProps.model = 'copy'
  dialogProps.data = row
  menuDialogRef.value.open(dialogProps)
}

function handleEdit({ row }: any): void {
  dialogProps.model = 'edit'
  dialogProps.data = row
  menuDialogRef.value.open(dialogProps)
}

function handleDelete(row: MatterMenu | Array<MatterMenuResponse>): void {
  if (Array.isArray(row) && !row.length) return

  const opts = {
    message: '确定删除菜单吗?',
    title: '删除',
    action: () =>
      delMatterMenu({
        ids: Array.isArray(row) ? row.map((m) => m.id).join(',') : row.id || ''
      }),
    success: () => {
      props.refresh = new Date().getTime()
    }
  }
  useConfirm(opts)
}

function handleQueryMatterMenuList(pid: number | undefined, callback: Function): void {
  queryMatterMenulist_No({ parentId: pid } as MatterMenu).then((res) => {
    callback(res.data.map((item) => ({ ...item, menuLevel: item.menuLevel?.toString() })))
  })
}

// 排序操作
function handleSortAction(row: any, actionName: 'up' | 'down' | 'top' | 'cancelTop'): void {
  const { id, parentId, sortTop } = row

  if (actionName === 'up' && sortTop === 1) return // 置顶状态的数据，上升操作无效

  const map = {
    up: { api: upperMatterMenu, params: id },
    down: { api: lowwerMatterMenu, params: id },
    top: { api: isTopMatterMenu, params: { id, isTop: true } },
    cancelTop: { api: isTopMatterMenu, params: { id, isTop: false } }
  }

  const target = map[actionName]
  target.api(target.params).then((res) => {
    if (res.code === '200') {
      ElMessage({ message: '操作成功', type: 'success' })

      // 局部更新
      handleQueryMatterMenuList(parentId, _resolve.value)
    }
  })
}

function TableLoad(
  row: MatterMenuResponse,
  treeNode: unknown,
  resolve: (date: MatterMenuResponse[]) => void
): void {
  _resolve.value = resolve
  // 局部更新
  handleQueryMatterMenuList(row.id, resolve)
}
</script>

<style scoped></style>
