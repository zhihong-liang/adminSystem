<template>
  <CnPage v-bind="props">
    <template #sort="{ $index, row }">
      <template v-if="row.menuLevel !== 1">
        <el-button type="primary" icon="Top" text></el-button>
        <el-button type="primary" icon="Bottom" text></el-button>
        <el-button text>{{ $index ? '置顶' : '取消置顶' }}</el-button>
      </template>
    </template>
  </CnPage>
  <MenuDialog ref="menuDialogRef" @success="() => (props.refresh = new Date().getTime())" />
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import useConfirm from '@/hooks/useConfirm'
import { queryMatterMenulist_No, delMatterMenu } from '@/api/matter'

import CnPage from '@/components/cn-page/CnPage.vue'
import MenuDialog from './components/menuDialog.vue'

import type { MatterMenu, MatterMenuResponse } from '@/views/matter/menu-manage/config/type'

const router = useRouter()

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
        // buttons: [
        //   { label: '', type: 'primary', icon: 'Top', text: true, onClick: handleEdit },
        //   { label: '', type: 'primary', icon: 'Bottom', text: true, onClick: handleEdit },
        //   { label: '置顶', text: true, onClick: handleEdit }
        // ]
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
          { label: '删除', type: 'primary', text: true, onClick: ({ row }) => handleDelete(row) },
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
  transformResponse: (params) => ({ rows: params.data, total: 0 })
})

const dialogProps = reactive({
  model: 'add',
  data: {
    menuName: '社保测试菜单',
    description: '这是测试的菜单',
    remark: '这是社保测试菜单',
    menuIcon: 'Odometer',
    backColor: 'red'
  }
})

function handleCopy({ row }: any) {
  dialogProps.model = 'copy'
  dialogProps.data = row
  menuDialogRef.value.open(dialogProps)
}

function handleEdit({ row }: any) {
  dialogProps.model = 'edit'
  dialogProps.data = row
  menuDialogRef.value.open(dialogProps)
}

function handleDelete(row: MatterMenu | Array<MatterMenuResponse>) {
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
