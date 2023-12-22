<template>
  <CnPage v-bind="props"></CnPage>
  <Deal
    ref="dealRef"
    @success="
      () => {
        props.refresh = new Date().getTime()
      }
    "
  />
  <Sel
    ref="selRef"
    @success="
      () => {
        props.refresh = new Date().getTime()
      }
    "
  />
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { mattersThemeInfoListPage as ListRequest, delMattersThemeInfo as DelRequest } from '@/api'
import { ElMessageBox, ElMessage } from 'element-plus'
import Deal from './deal.vue'
import Sel from './sel.vue'

const emit = defineEmits(['changeType'])

const dealRef = ref()
const selRef = ref()
// 删除
const handleRemove = ({ row }: any) => {
  ElMessageBox.confirm(`确定要删除主题${row.themeName}?`, {
    title: '删除',
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        instance.confirmButtonText = 'Loading...'

        DelRequest(row.id)
          .then((res) => {
            const { code, message } = res
            if (code == '200') {
              done()
            }
          })
          .finally(() => {})
      } else {
        done()
      }
    }
  }).then(() => {
    ElMessage.success({ message: '删除成功' })
    props.refresh = new Date().getTime()
  })
}

const props: CnPage.Props = reactive({
  params: {},
  action: (params) => ListRequest(params),
  search: {
    items: [
      { label: '主题编号', prop: 'themeCode', component: 'input' },
      { label: '主题名称', prop: 'themeName', component: 'input' },
      { label: '状态', prop: 'status', component: 'select', dict: 'START_STOP' }
    ]
  },
  toolbar: {
    items: [
      {
        label: '新增',
        type: 'primary',
        onClick: () => {
          dealRef.value?.open('', 'add')
          // dialogProps.formProps!.model = {}
          // dialogProps.action = () => handleSubmit('add')
        }
      }
    ]
  },
  table: {
    rowKey: 'id',
    columns: [
      { prop: 'themeCode', label: '主题编号' },
      { prop: 'themeName', label: '主题名称' },
      { prop: 'themeName', label: '备注' },
      { prop: 'menuCount', label: '包含菜单数', width: '120px' },
      { prop: 'devCount', label: '使用设备数', width: '120px' },
      { prop: 'status', label: '状态', dict: 'START_STOP', width: '120px' },
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
              dealRef.value.open(row, 'edit')
            }
          },
          {
            label: '选择菜单',
            type: 'warning',
            text: true,
            onClick: ({ row }) => {
              selRef.value.open(row)
            }
          },
          { label: '删除', type: 'danger', text: true, onClick: handleRemove },
          {
            label: '复制',
            type: 'info',
            text: true,
            onClick: ({ row }) => {
              dealRef.value.open(row, 'copy')
            }
          }
        ]
      }
    ],
    treeProps: { children: 'childList' }
  },
  pagination: true,
  refresh: new Date().getTime()
  // transformResponse: () => {}
})
</script>

<style scoped lang="scss">
::v-deep .启用 {
  color: #67c23a;
}
::v-deep .停用 {
  color: #f56c6c;
}
</style>
