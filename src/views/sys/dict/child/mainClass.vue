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
import { dictTypeList as ListApi } from '@/api'
import MainDeal from './mainDeal.vue'
// 编辑
const handleEdit = () => {}

// 删除
const handleRemove = () => {}

const mainDealRef = ref()

const props: CnPage.Props = reactive({
  params: {},
  action: (params) => ListApi(params),
  search: {
    items: [{ label: '主类', prop: 'type', component: 'input' }]
  },
  toolbar: {
    items: [
      {
        label: '新增',
        type: 'primary',
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
          { label: '删除', type: 'danger', text: true, onClick: handleRemove }
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
