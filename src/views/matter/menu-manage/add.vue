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
    <TransferFormDialog ref="transferFormDialogRef" @submit="handleDialogSubmit" />

    <el-button type="primary" @click="handleAddMatterMenu">添加</el-button>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { queryMatterMenuRelation, queryMatterMenulist_No, addMatterMenu } from '@/api/matter'
import { getUnitList as queryUnitList } from '@/api/admin'

import CnForm from '@/components/cn-page/CnForm.vue'
import CnPage from '@/components/cn-page/CnPage.vue'
import CnIcon from '@/components/cn-page/CnIcon.vue'
import TransferFormDialog from './components/transferFormDialog.vue'

import type {
MatterMenu,
  MatterMenuResponse,
  MatterThemeMenuItem
} from '@/views/matter/menu-manage/config/type'
import type { Resolve } from 'element-plus/lib/components/cascader-panel/index.js'

const route = useRoute()

const model = computed(() => route.query.action)

const formProps: CnPage.FormProps = reactive({
  model: {
    menuName: '社保测试菜单',
    description: '这是测试的菜单',
    remark: '这是社保测试菜单',
    menuIcon: 'Odometer',
    backColor: 'red'
  },
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
          checkStrictly: true,
          lazy: true,
          lazyLoad: handleLazyLoad
        }
      }
    }
  ],
  rules: {
    menuName: [{ required: true, message: '请输入菜单名称' }],
    backColor: [{ required: true, message: '请输入背景颜色' }],
    // parentId: [{ required: true, message: '请选择上级菜单' }]
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
      { prop: 'matterStatus', label: '事项状态', dict: 'START_STOP' },
      { prop: 'sort', label: '排序' },
      {
        prop: 'action',
        label: '操作',
        minWidth: 120,
        buttons: [{ label: '删除', type: 'primary', text: true }]
      }
    ]
  },
  pagination: model.value !== 'add',
  refresh: new Date().getTime(),
  transformRequest: (params) => ({ obj: params })
})
const tableData = ref<MatterThemeMenuItem[]>([])

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

function handleAddMatterMenu() {
  const params: MatterMenu = {
    ...formProps.model,
    menuRelationList: tableData.value,
    menuLevel: !!formProps.model.parentId ? formProps.model.parentId + 1 : 1
  }

  addMatterMenu(params).then(res => {
    console.log('res: ', res);
  })
  console.log('params: ', params)
}

function handleDialogSubmit(list: MatterThemeMenuItem[]) {
  if (model.value === 'add' && list.length) {
    pageProps.action = () => Promise.resolve({ rows: list, total: null })
    pageProps.refresh = new Date().getTime()
    tableData.value = list
  }
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

  if (model.value === 'add') {
    pageProps.action = () => Promise.resolve({ rows: [], total: null })
  }
})
</script>

<style scoped></style>
