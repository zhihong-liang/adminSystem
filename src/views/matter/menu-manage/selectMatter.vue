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
    <CnPage v-bind="pageProps">
      <template #sort="{ row }">
        <el-button type="primary" icon="Top" text @click="handleSortAction(row, 'up')"></el-button>
        <el-button
          type="primary"
          icon="Bottom"
          text
          @click="handleSortAction(row, 'down')"
        ></el-button>
        <el-button text @click="handleSortAction(row, row.sortTop === 1 ? 'cancelTop' : 'top')">{{
          row.sortTop === 1 ? '取消置顶' : '置顶'
        }}</el-button>
      </template>
    </CnPage>
  </div>
  <TransferFormDialog
    ref="transferFormDialogRef"
    @onSuccess="() => (pageProps.refresh = new Date().getTime())"
  />
</template>

<script setup lang="ts">
import { onBeforeMount, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import useConfirm from '@/hooks/useConfirm'
import {
  queryMatterDetail,
  queryMatterMenulist_No,
  queryMatterMenuRelation,
  deleteMatterRelationList,
  upperMatterMenuRelation,
  lowwerMatterMenuRelation,
  isTopMatterMenuRelation
} from '@/api/matter'
import { getUnitList as queryUnitList } from '@/api/admin'
import { DEFAILT_ITEM } from './config/data'
import { ElMessage } from 'element-plus'

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
  items: DEFAILT_ITEM.map((i) => {
    i.prop === 'status' && (i.component = '') // 设置为readOnly
    return i
  }),
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
      { prop: 'sort', label: '排序', minWidth: 130, slot: 'sort' },
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
  transformRequest: (params) => ({ obj: { menuId: route.query.id, ...params } })
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

function handleSortAction(row: any, actionName: 'up' | 'down' | 'top' | 'cancelTop'): void {
  const { id, sortTop } = row

  if (actionName === 'up' && sortTop === 1) return

  const map = {
    up: { api: upperMatterMenuRelation, params: id },
    down: { api: lowwerMatterMenuRelation, params: id },
    top: { api: isTopMatterMenuRelation, params: { id, isTop: true } },
    cancelTop: { api: isTopMatterMenuRelation, params: { id, isTop: false } }
  }

  const target = map[actionName]
  target.api(target.params).then((res) => {
    if (res.code === '200') {
      ElMessage({ message: '操作成功', type: 'success' })
      pageProps.refresh = new Date().getTime()
    }
  })
}

// 删除事项
function handleDeleteMatter(row: MatterMenuRelation | MatterMenuRelation[]): void {
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

function init(): void {
  // 获取事项进驻单位
  queryUnitList({ obj: {}, size: 10000 }).then((res) => {
    if (res.code === '200') {
      enterUnitList.value = res.rows.map((item) => ({
        label: item.fullName,
        value: item.id
      }))
    }
  })

  // 请求菜单详情
  queryMatterDetail(route.query.id as any).then((res) => {
    if (res.code === '200') {
      formProps.model = { ...res.data, menuLevel: res.data.menuLevel.toString() }
    } else {
      formProps.model = {
        menuLevel: '',
        status: ''
      }
    }
  })
}

onBeforeMount(() => {
  init()
})
</script>

<style scoped></style>
