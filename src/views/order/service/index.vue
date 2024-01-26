<template>
  <CnPage v-bind="props" />
  <addEdit
    ref="serviceRef"
    @success="
      () => {
        props.refresh = Date.now()
      }
    "
  />
</template>

<script lang="ts" setup>
import CnPage from '@/components/cn-page/CnPage.vue'
import { reactive, ref } from 'vue'
import addEdit from './child/addEdit.vue'
import { writeQueryList, writeUpdateStatus } from '@/api/admin'
import useConfirm from '@/hooks/useConfirm'

const props: CnPage.Props = reactive({
  params: {},
  action: writeQueryList,
  search: {
    items: [
      { label: '文案类型', prop: 'messageType', component: 'select', dict: 'MESSAGE_TYPE' },
      { label: '状态', prop: 'status', component: 'select', dict: 'MESSAGE_STATUS' }
    ]
  },
  table: {
    columns: [
      { type: 'index', label: '序号', width: 60 },
      { label: '文案类型', prop: 'messageType', dict: 'MESSAGE_TYPE' },
      { label: '编号', prop: 'messageCode' },
      { label: '备注', prop: 'remark' },
      { label: '状态', prop: 'status', dict: 'MESSAGE_STATUS' },
      { label: '更新时间', prop: 'updateTime' },
      {
        prop: 'action',
        label: '操作',
        buttons: [
          {
            label: '详情',
            type: 'default',
            onClick: ({ row }) => openDialog('look', row)
          },
          {
            label: '编辑',
            type: 'primary',
            onClick: ({ row }) => openDialog('edit', row)
          },
          {
            label: '启用',
            type: 'primary',
            visible: ({ row }) => row.status === '0',
            onClick: ({ row }) => {
              const opts = {
                message: `确定要启用该文案？`,
                title: '提示',
                action: () => writeUpdateStatus({id: row.id,status:'1'}),
                success: () => {
                  props.refresh = new Date().getTime()
                }
              }
              useConfirm(opts)
            }
          },
          {
            label: '禁用',
            type: 'primary',
            visible: ({ row }) => row.status === '1',
            onClick: ({ row }) => {
              const opts = {
                message: `确定要禁用该文案？`,
                title: '提示',
                action: () => writeUpdateStatus({id: row.id,status:'0'}),
                success: () => {
                  props.refresh = new Date().getTime()
                }
              }
              useConfirm(opts)
            }
          },
        ]
      }
    ]
  }
})

const serviceRef = ref()
const openDialog = (type: string, row: any) => {
  serviceRef.value.open(type, row)
}
</script>
