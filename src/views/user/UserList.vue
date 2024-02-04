<template>
  <CnPage v-bind="props" />
  <Detail
    ref="detailRef"
    @success="
      () => {
        props.refresh = Date.now()
      }
    "
  />
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import CnPage from '@/components/cn-page/CnPage.vue'
import { getUserList, getUserSync } from '@/api/admin'
import Detail from './child/detail.vue'
import { ElMessage } from 'element-plus'

const detailRef = ref()
const tableSelection = ref([])

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
        onClick: () => {
          detailRef.value.open('add', {})
        }
      }
      // {
      //   label: '同步工作流',
      //   type: 'primary',
      //   onClick: () => {
      //     if (tableSelection.value.length === 0) {
      //       ElMessage.error('请选择要同步的数据')
      //       return
      //     }
      //     const ids = tableSelection.value.map((v: {id: string}) => v.id).join(',')
      //     getUserSync(ids).then((res) => {
      //       if (res.code === '200') {
      //         ElMessage.success(res.message)
      //         props.refresh = Date.now()
      //       }
      //     })
      //   }
      // }
    ]
  },
  table: {
    columns: [
      // { type: 'selection' },
      { type: 'index', label: '序号', width: 60 },
      { prop: 'userNo', label: '用户编号' },
      { prop: 'name', label: '用户名称', width: 130 },
      { prop: 'phone', label: '登录手机号', width: 130},
      { prop: 'unitName', label: '单位名称', width: 200 },
      { prop: 'unitLevel', label: '单位层级', dict: 'UNIT_LEVEL' },
      { prop: 'unitType', label: '类型', minWidth: 100 },
      { prop: 'postName', label: '岗位' },
      { prop: 'status', label: '状态', dict: 'USER_STATUS' },
      { prop: 'createTime', label: '创建时间', width: 170 },
      { prop: 'workflowSyncFlag', label: '同步状态', dict: 'WORKFLOW_SYNC_FLAG' },
      {
        prop: 'action',
        label: '操作',
        minWidth: 175,
        buttons: [
          {
            label: '查看',
            type: 'primary',
            onClick: ({ row }) => {
              detailRef.value.open('look', row)
            }
          },
          {
            label: '编辑',
            type: 'warning',
            onClick: ({ row }) => {
              detailRef.value.open('edit', row)
            }
          },
          {
            label: '同步工作流',
            type: 'primary',
            visible: ({row}) => row.workflowSyncFlag !== '1',
            onClick: ({row}) => {
              getUserSync(row.id).then((res) => {
                if (res.code === '200') {
                  ElMessage.success(res.message)
                  props.refresh = Date.now()
                }
              })
            }
          }
        ]
      }
    ],
    selectionChange: (row) => (tableSelection.value = row)
  }
})
</script>
