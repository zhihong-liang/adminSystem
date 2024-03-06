<template>
  <CnPage v-bind="props"></CnPage>
  <SubDeal
    ref="subDealRef"
    @success="
      () => {
        props.refresh = new Date().getTime()
      }
    "
  />
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { dictList as ListRequest, dictDel as DelRequest } from '@/api'
import SubDeal from './subDeal.vue'
import { ElMessageBox, ElMessage } from 'element-plus'

const emit = defineEmits(['changeType'])
const defineprops = defineProps({
  type: {
    type: String
  }
})

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

const subDealRef = ref()

const props: CnPage.Props = reactive({
  params: { type: defineprops.type },
  action: (params) => ListRequest(params),
  toolbar: {
    items: [
      {
        label: '新增',
        type: 'primary',
        onClick: () => {
          subDealRef.value?.open({ type: defineprops.type }, 'add')
          // dialogProps.formProps!.model = {}
          // dialogProps.action = () => handleSubmit('add')
        }
      },
      {
        label: '返回主类列表',
        type: 'info',
        onClick: () => {
          emit('changeType', '')
        }
      }
    ]
  },
  table: {
    rowKey: 'id',
    maxHeight: "600",
    columns: [
      { type: 'index', label: '序号', width: 60 },
      { prop: 'type', label: '主类' },
      { prop: 'subtype', label: '值' },
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
              subDealRef.value.open(row)
            }
          },
          { label: '删除', type: 'danger', text: true, onClick: handleRemove }
        ]
      }
    ]
  },
  pagination: true,
  refresh: new Date().getTime()
  // transformResponse: () => {}
})
</script>

<style scoped lang="scss"></style>
