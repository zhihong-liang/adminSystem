<template>
  <CnPage v-bind="props"></CnPage>
  <MainDeal
    ref="mainDealRef"
    @success="
      () => {
        props.refresh = new Date().getTime()
      }
    "
  />
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { dictTypeList as ListRequest, dictTypeDel as DelRequest } from '@/api'
import MainDeal from './mainDeal.vue'
import { ElMessageBox, ElMessage } from 'element-plus'

const emit = defineEmits(['changeType'])

// 删除
const handleRemove = ({ row }: any) => {
  ElMessageBox.confirm(`确定要删除${row.description}?`, {
    title: '删除',
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        instance.confirmButtonText = 'Loading...'

        DelRequest(row.type)
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

const mainDealRef = ref()

const props: CnPage.Props = reactive({
  params: {},
  action: (params) => ListRequest(params),
  search: {
    items: [{ label: '主类', prop: 'type', component: 'input' }]
  },
  toolbar: {
    items: [
      {
        label: '新增',
        type: 'success',
        onClick: () => {
          mainDealRef.value?.open()
          // dialogProps.formProps!.model = {}
          // dialogProps.action = () => handleSubmit('add')
        }
      }
    ]
  },
  table: {
    rowKey: 'id',
    columns: [
      { type: 'index', label: '序号', width: 60 },
      { prop: 'type', label: '类型' },
      { prop: 'description', label: '描述' },
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
              mainDealRef.value.open(row)
            }
          },
          { label: '删除', type: 'danger', text: true, onClick: handleRemove },
          {
            label: '管理子类',
            type: 'success',
            text: true,
            onClick: ({ row }) => {
              emit('changeType', row)
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

<style scoped lang="scss"></style>
