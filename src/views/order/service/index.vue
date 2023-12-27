<template>
  <CnPage v-bind="props" />
  <addEdit ref="serviceRef" @success="() => { props.refresh = Date.now()}" />
</template>

<script lang="ts" setup>
import CnPage from '@/components/cn-page/CnPage.vue'
import { reactive, ref } from 'vue';
import addEdit from './child/addEdit.vue'

const props: CnPage.Props = reactive({
  params: {},
  action: () => Promise.resolve(),
  search: {
    items: [
      { label: '服务标准名称', prop: 'name', component: 'input' },
      { label: '状态', prop: 'phone', component: 'select' }
    ]
  },
  toolbar: {
    items: [
      {
        label: '新增',
        type: 'primary',
        onClick: () => openDialog()
      }
    ]
  },
  table: {
    columns: [
      { type: 'index', label: '序号', width: 60 },
      { prop: 'name', label: '服务标准名称' },
      { prop: 'status', label: '状态', dict: 'USER_STATUS' },
      {
        prop: 'action',
        label: '操作',
        buttons: [
          { label: '编辑', type: 'primary', text: true, onClick: ({row}) => openDialog('edit', '编辑') },
          { label: '删除', type: 'danger', text: true, onClick: ({row}) => { console.log(1) } },
        ]
      }
    ]
  }
})

const serviceRef = ref()
const openDialog = (type='add', title='新增') => {
  serviceRef.value.open(type, title)
}
</script>