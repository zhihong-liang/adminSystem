<template>
  <CnPage v-bind="props"></CnPage>
  <CnDialog
    v-bind="dialogProps"
    ref="dialogRef"
    @success="() => (props.refresh = new Date().getTime())"
    @close="() => (dialogProps.formProps!.model = {})"
  >
  </CnDialog>
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

const cascaderProps = {
  checkStrictly: true,
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
        leaf: !item.open
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
  action: () => querAddDevGroup(dialogProps?.formProps!.model)
})

const _resolve = ref()
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
          dialogProps.formProps!.items = DEFAULT_ITEMS.filter((i: any) => i.prop !== 'status')
          dialogRef.value.open()
        }
      }
    ]
  },
  table: {
    rowKey: 'id',
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
            onClick: ({ row }) => {
              dialogProps.formProps!.items = DEFAULT_ITEMS
              dialogProps.formProps!.model = row
              dialogRef.value.open()
            }
          },
          {
            label: '删除',
            type: 'primary',
            text: true,
            onClick: handleDeleteGroup
          }
        ]
      }
    ],
    lazy: true,
    load: TableLoad,
    treeProps: { children: 'children', hasChildren: 'open' }
  },
  pagination: false,
  refresh: new Date().getTime(),
  transformRequest: (params) => ({ ...params }),
  transformResponse: (res) => ({ rows: res.data, total: 0 })
})

function handleTableResolve(pid: number | undefined, callback: Function): void {
  queryDevGroupList({ parentId: pid }).then((res: any) => {
    callback(res.data)
  })
}

function TableLoad(
  row: DeviceInfo,
  treeNode: unknown,
  resolve: (date: DeviceInfo[]) => void
): void {
  _resolve.value = resolve
  handleTableResolve(row.id, resolve)
}

function handleDeleteGroup({ row }: any) {
  const opts = {
    message: `确定要删除${row.groupName}?`,
    title: '删除',
    action: () => queryDeleteDevGroup(row.id || ''),
    success: () => {
      props.refresh = new Date().getTime()
    }
  }
  useConfirm(opts)
}
</script>

<style scoped></style>
