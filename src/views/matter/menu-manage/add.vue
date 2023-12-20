<template>
  <div class="Matter-Menu-Manage-add-root">
    <CnForm style="width: 40%" v-bind="formProps">
      <template #menuIcon>
        <CnIcon html="ZoomIn" />
      </template>
    </CnForm>

    <el-divider />

    <h2 class="mb-lg">事项列表</h2>
    <CnPage v-bind="pageProps"></CnPage>
    <TransferFormDialog ref="transferFormDialogRef" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, reactive, ref } from 'vue'
import { queryMatterMenuRelation, queryMatterMenulist_No } from '@/api/matter'
import { getUnitList as queryUnitList } from '@/api/admin'

import CnForm from '@/components/cn-page/CnForm.vue'
import CnPage from '@/components/cn-page/CnPage.vue'
import CnIcon from '@/components/cn-page/CnIcon.vue'
import TransferFormDialog from './components/transferFormDialog.vue'

import type { MatterMenuResponse } from '@/views/matter/menu-manage/config/type'
import type { Resolve } from 'element-plus/lib/components/cascader-panel/index.js'

const formProps: CnPage.FormProps = reactive({
  model: {},
  labelPosition: 'left',
  labelWidth: '100',
  items: [
    {
      label: '菜单名称',
      prop: 'menuName',
      component: 'input',
      props: { maxlength: 6, showWordLimit: true }
    },
    { label: '补充说明', prop: 'description', component: 'input' },
    {
      label: '备注',
      prop: 'remark',
      component: 'input',
      props: { type: 'textarea', maxlength: 200, showWordLimit: true }
    },
    { label: '图标', prop: 'menuIcon', component: 'slot' },
    { label: '背景颜色', prop: 'backColor', component: 'input' },
    {
      label: '上级菜单',
      prop: 'parentId',
      component: 'cascader',
      props: {
        props: {
          lazy: true,
          lazyLoad: handleLazyLoad
        }
      }
    }
  ],
  rules: {
    menuName: [{ required: true, message: '请输入菜单名称' }],
    backColor: [{ required: true, message: '请输入背景颜色' }],
    parentId: [{ required: true, message: '请选择上级菜单' }]
  }
})

const enterUnitList = ref<any>([]) // 菜单进驻单位列表
const pageProps: CnPage.Props = reactive({
  params: {},
  action: queryMatterMenuRelation,
  search: {
    items: [
      { label: '事项编号', prop: 'matterCode', component: 'input' },
      { label: '事项名称', prop: 'matterName', component: 'input' },
      { label: '菜单别名', prop: 'matterAlias', component: 'input' },
      {
        label: '菜单进驻单位',
        prop: 'entryUnit',
        component: 'select',
        props: { options: enterUnitList }
      },
      { label: '办理类型', prop: 'handleType', component: 'select', dict: 'HANDLE_TYPE' },
      { label: '事项状态', prop: 'matterStatus', component: 'select', dict: 'START_STOP' }
    ]
  },
  toolbar: {
    items: [
      {
        label: '增加事项',
        type: 'primary',
        onClick: () => transferFormDialogRef.value.open()
      },
      {
        label: '删除',
        type: 'primary',
        plain: true
      }
    ]
  },
  table: {
    rowKey: 'id',
    columns: [
      { type: 'selection', width: '55' },
      { prop: 'matterCode', label: '事项编号' },
      { prop: 'matterName', label: '事项名称' },
      { prop: 'matterAlias', label: '事项别名', dict: 'MATTERS_MENU_LEVEL' },
      { prop: 'entryUnitText', label: '事项进驻单位', dict: 'MENU_STATUS' },
      { prop: 'handleType', label: '办理类型', dict: 'HANDLE_TYPE' },
      { prop: 'status', label: '事项状态', dict: 'START_STOP' },
      { prop: 'sort', label: '排序' },
      {
        prop: 'action',
        label: '操作',
        minWidth: 120,
        buttons: [{ label: '删除', type: 'primary', text: true }]
      }
    ]
  },
  pagination: true,
  refresh: new Date().getTime(),
  transformRequest: (params) => ({ obj: params })
})

const transferFormDialogRef = ref()

function handleLazyLoad(node: any, resolve: Resolve) {
  const { value } = node

  const params = {
    parentId: value
  }

  queryMatterMenulist_No(params).then((res) => {
    let nodes: any = []
    nodes = res.data.map((item: MatterMenuResponse) => ({
      value: item.id,
      label: item.menuName,
      leaf: !item.open
    }))

    return resolve(nodes)
  })
}

// 获取事项进驻单位
function getUnitList() {
  const params = {
    obj: {},
    size: 10000
  }

  queryUnitList(params).then((res) => {
    if (res.code === '200') {
      enterUnitList.value = res.rows.map((item) => ({
        label: item.fullName,
        value: item.id
      }))
    }
  })
}

onBeforeMount(() => {
  getUnitList()
})
</script>

<style scoped></style>
