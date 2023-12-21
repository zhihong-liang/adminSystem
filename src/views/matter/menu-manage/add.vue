<template>
  <div class="Matter-Menu-Manage-add-root">
    <CnForm style="width: 60%" v-bind="formProps">
      <template #menuIcon>
        <CnIcon :html="formProps.model.menuIcon" size="20" />
      </template>
      <template #parentId>
        <el-cascader
          v-model="formProps!.model.parentId"
          :props="cascaderProps"
          :placeholder="formProps!.model.parentId ?? '无上级'"
          :disabled="true"
        />
      </template>
    </CnForm>

    <el-divider />

    <h2 class="mb-lg">事项列表</h2>
    <CnPage v-bind="pageProps"></CnPage>
    <TransferFormDialog
      ref="transferFormDialogRef"
      @onSuccess="() => (pageProps.refresh = new Date().getTime())"
    />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import useConfirm from '@/hooks/useConfirm'
import {
  queryMatterDetail,
  queryMatterMenulist_No,
  queryMatterMenuRelation,
  deleteMatterRelationList
} from '@/api/matter'
import { getUnitList as queryUnitList } from '@/api/admin'
import { DEFAILT_ITEM } from './config/data'
import useDictionary from '@/hooks/useDictionary'

import CnForm from '@/components/cn-page/CnForm.vue'
import CnPage from '@/components/cn-page/CnPage.vue'
import CnIcon from '@/components/cn-page/CnIcon.vue'
import TransferFormDialog from './components/transferFormDialog.vue'

import type { MatterMenuRelation, MatterMenuResponse } from '@/views/matter/menu-manage/config/type'
import type { Resolve } from 'element-plus/lib/components/cascader-panel/index.js'

const route = useRoute()

const selectedList = ref([])

const formProps: CnPage.FormProps = reactive({
  model: {},
  labelPosition: 'left',
  labelWidth: '100',
  items: DEFAILT_ITEM,
  readonly: true,
  colSpan: 12,
  rules: {
    menuName: [{ required: true, message: '请输入菜单名称' }],
    backColor: [{ required: true, message: '请输入背景颜色' }]
    // parentId: [{ required: true, message: '请选择上级菜单' }]
  }
})

const enterUnitList = ref<any>([]) // 菜单进驻单位列表
const pageProps: CnPage.Props = reactive({
  params: {
    menuId: route.query.id
  },
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
        plain: true,
        onClick: () => handleDeleteMatter(selectedList.value)
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
        buttons: [
          {
            label: '删除',
            type: 'primary',
            text: true,
            onClick: ({ row }) => handleDeleteMatter(row)
          }
        ]
      }
    ],
    selectionChange: (list) => (selectedList.value = list)
  },
  pagination: true,
  refresh: new Date().getTime(),
  transformRequest: (params) => ({ obj: params })
})

const transferFormDialogRef = ref()

const cascaderProps = {
  checkStrictly: true,
  lazy: true,
  lazyLoad(node: any, resolve: Resolve) {
    const params = {
      parentId: node.value
    }

    queryMatterMenulist_No(params).then((res) => {
      let nodes: any = []
      nodes = res.data.map((item: MatterMenuResponse) => ({
        value: item.id,
        label: item.menuName,
        menuLevel: item.menuLevel,
        leaf: !item.open
      }))

      return resolve(nodes)
    })
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

// 删除事项
function handleDeleteMatter(row: MatterMenuRelation | MatterMenuRelation[]) {
  if (Array.isArray(row) && !row.length) return

  const opts = {
    message: '确定删除事项吗?',
    title: '删除',
    action: () =>
      deleteMatterRelationList({
        ids: Array.isArray(row)
          ? selectedList.value.map((item: any) => item.id).join(',')
          : row.id?.toString() || ''
      }),
    success: () => {
      pageProps.refresh = new Date().getTime()
    }
  }
  useConfirm(opts)
}

async function init() {
  formProps.items.forEach((item: any) => {
    if (item.prop === 'status') {
      item.component = ''
    }
  })

  const id = route.query.id as any

  getUnitList()

  const matterInfo = await queryMatterDetail(id)
  if (matterInfo.code === '200') {
    formProps.model = matterInfo.data
    pageProps.params.id = matterInfo.data.id
  }
}

onBeforeMount(() => {
  init()
})
</script>

<style scoped></style>
