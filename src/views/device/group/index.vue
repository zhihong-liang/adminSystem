<template>
  <CnPage v-bind="props" ref="PageRef"></CnPage>
  <CnDialog
    v-bind="dialogProps"
    ref="dialogRef"
    @success="handleDialogSuccess"
    @close="() => (dialogProps.formProps!.model = {})"
  />
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import useConfirm from '@/hooks/useConfirm'
import {
  queryDevGroupList,
  queryDeleteDevGroup,
  querAddDevGroup,
  type DeviceInfo
} from '@/api/device'

import CnPage from '@/components/cn-page/CnPage.vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'

import type { Resolve } from 'element-plus/lib/components/cascader-panel/index.js'
import { ElMessage } from 'element-plus'

const cascaderProps = {
  checkStrictly: true,
  emitPath: false,
  lazy: true,
  lazyLoad(node: any, resolve: Resolve) {
    const params = {
      parentId: node.value
    }

    queryDevGroupList(params).then((res) => {
      let nodes: any = []
      nodes = res.data.map((item: DeviceInfo) => ({
        value: item.id,
        label: item.groupName,
        leaf: item.open === false,
        disabled: item.parentId && !item.open
      }))

      return resolve(nodes)
    })
  }
}

const DEFAULT_ITEMS: any = [
  {
    label: '设备分组',
    prop: 'groupName',
    component: 'input',
    props: {
      maxlength: 20,
      showWordLimit: true
    }
  },
  {
    label: '上级分组',
    prop: 'parentId',
    component: 'cascader',
    props: {
      props: cascaderProps
    }
  },
  {
    label: '备注',
    prop: 'groupRemark',
    component: 'input',
    props: {
      type: 'textarea',
      maxlength: 200,
      showWordLimit: true
    }
  },
  {
    label: '状态',
    prop: 'status',
    component: 'select',
    dict: 'START_STOP'
  }
]

const loadMap = new Map()
const action = ref('add') // add / edit

const dialogRef = ref()
const dialogProps: CnPage.DialogProps = reactive({
  title: '新建',
  formProps: {
    model: {},
    items: DEFAULT_ITEMS,
    colSpan: 24,
    rules: {
      groupName: [{ required: true, message: '请输入设备分组' }],
      status: [{ required: true, message: '请选择分组状态' }]
    },
    labelWidth: '100',
    labelPosition: 'right'
  },
  action: handleDialogAction
})

const PageRef = ref()
const props: CnPage.Props = reactive({
  params: {},
  action: queryDevGroupList,
  search: {
    items: [
      { label: '设备分组', prop: 'groupName', component: 'input' },
      { label: '备注', prop: 'groupRemark', component: 'input' }
    ]
  },
  toolbar: {
    items: [
      {
        label: '新增',
        type: 'primary',
        onClick: () => {
          action.value = 'add'
          dialogProps.formProps!.items = DEFAULT_ITEMS.filter((i: any) => i.prop !== 'status')
          dialogRef.value.open()
        }
      }
    ]
  },
  table: {
    lazy: true,
    rowKey: 'id',
    load: TableLoad,
    treeProps: { children: 'children', hasChildren: 'open' },
    columns: [
      { prop: 'groupName', label: '设备分组' },
      { prop: 'groupRemark', label: '备注' },
      {
        prop: 'action',
        label: '操作',
        minWidth: 120,
        buttons: [
          {
            label: '编辑',
            type: 'primary',
            text: true,
            onClick: handleEdit
          },
          {
            label: '删除',
            type: 'primary',
            text: true,
            onClick: handleDeleteGroup
          }
        ]
      }
    ]
  },
  pagination: false,
  transformRequest: (params) => ({ ...params }),
  transformResponse: (res) => ({ rows: res.data, total: 0 })
})

async function handleDialogSuccess() {
  const { prevParentId, parentId } = dialogProps.formProps?.model as any

  if (action.value === 'add') {
    await reloadTree(parentId)
    props.refresh = new Date().getTime()
  } else {
    await reloadTree(parentId)

    // 如果更改了父节点，前、后两个父节点都要 reload
    if (prevParentId !== parentId) {
      await reloadTree(prevParentId)
      props.refresh = new Date().getTime()
    }
  }
}

function handleEdit({ row }: any) {
  action.value = 'edit'
  dialogProps.formProps!.items = DEFAULT_ITEMS
  // 保存上一个父节点，后面要同时刷新两个父节点的数据
  dialogProps.formProps!.model = Object.assign({}, row, { prevParentId: row.parentId })
  dialogRef.value.open()
}

function handleDialogAction() {
  const params = {
    ...dialogProps?.formProps!.model
  }

  if (params.prevParentId) delete params.prevParentId

  return querAddDevGroup(params, action.value === 'add' ? 'post' : 'put')
}

function TableLoad(
  row: DeviceInfo,
  treeNode: unknown,
  resolve: (date: DeviceInfo[]) => void
): void {
  loadMap.set(row.id, { row, treeNode, resolve })
  queryDevGroupList({ parentId: row.id })
    .then((res: any) => resolve(res.data))
    .catch(() => ElMessage.error('请求失败'))
}

// 重新加载子数据
function reloadTree(parentId: number) {
  if (loadMap.get(parentId) === undefined) return

  const { row, treeNode, resolve } = loadMap.get(parentId)
  const node = PageRef.value.$refs['tableRef'].$refs['tableRef']

  // bugfix: 修复该节点只有一个子节点的情况下，删除和编辑操作不成功的bug
  if (node.store.states.lazyTreeNodeMap.value[parentId].length <= 1) {
    node.store.states.lazyTreeNodeMap.value[parentId] = []
  }

  TableLoad(row, treeNode, resolve)
}

function handleDeleteGroup({ row }: any) {
  const opts = {
    message: `确定要删除${row.groupName}?`,
    title: '删除',
    action: () => queryDeleteDevGroup(row.id || ''),
    success: () => {
      props.refresh = new Date().getTime()
      if (row.parentId) {
        reloadTree(row.parentId)
      }
    }
  }
  useConfirm(opts)
}
</script>

<style scoped></style>
