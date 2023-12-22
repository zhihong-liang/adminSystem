<template>
  <CnPage v-bind="props"></CnPage>
  <CnDialog v-bind="dialogProps" ref="dialogRef" @success="queryMenuList">
    <template #icon>
      <el-input v-model="dialogProps.formProps!.model.icon" disabled>
        <template #append>
          <el-button @click="() => IconDialogRef?.open()">选择</el-button>
        </template>
      </el-input>
    </template>
  </CnDialog>
  <IconDialog v-model:value="dialogProps.formProps!.model.icon" ref="IconDialogRef" />
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from 'vue'
import { useHomeStore } from '@/stores/home'
import { storeToRefs } from 'pinia'
import { dymanicAddRoute } from '@/router'
import moment from 'moment'
import useConfirm from '@/hooks/useConfirm'
import { addMenu, removeMenu, editMenu, getMenuList as queryMenuTree, type Res } from '@/api'

import CnPage from '@/components/cn-page/CnPage.vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'
import IconDialog from './iconsDialog.vue'

import type { Menu } from '@/layout/slider/type'

const store = useHomeStore()
const { modules, menuList, tabList } = storeToRefs(store)
const { updateMenuList, updateTabList } = store

const componentMenus = computed(() => Object.keys(modules.value).map((m) => ({ value: m })))

const dialogRef = ref<InstanceType<typeof CnDialog>>()
const dialogProps: CnPage.DialogProps = reactive({
  title: '新增菜单',
  formProps: {
    model: {},
    items: [
      { label: '标题', prop: 'name', component: 'input' },
      { label: '编码', prop: 'code', component: 'input' },
      { label: '地址', prop: 'path', component: 'input' },
      {
        label: '组件',
        prop: 'component',
        component: 'select',
        props: {
          options: componentMenus.value
        }
      },
      {
        label: '图标',
        prop: 'icon',
        component: 'slot'
      },
      {
        label: '父级菜单',
        prop: 'parentId',
        component: 'cascader',
        props: {
          options: menuList,
          props: {
            checkStrictly: true,
            emitPath: false,
            label: 'name',
            value: 'id',
            children: 'childList'
          }
        }
      },
      {
        label: '类型',
        prop: 'type',
        component: 'select',
        dict: 'MENU_TYPE'
      },
      { label: '排序', prop: 'sort', component: 'input' },
      {
        label: '状态',
        prop: 'status',
        span: 24,
        component: 'radio',
        props: {
          options: [
            { label: '启用', value: '1' },
            { label: '禁用', value: '0' }
          ]
        }
      },
      {
        label: '描述',
        prop: 'description',
        span: 24,
        component: 'input',
        props: { type: 'textarea' }
      }
    ],
    colSpan: 12,
    rules: {
      name: [{ required: true, message: '请输入标题' }],
      code: [{ required: true, message: '请输入编码' }],
      path: [{ required: true, message: '请输入地址' }],
      status: [{ required: true, message: '请输入状态' }]
    }
  }
})

const IconDialogRef = ref<InstanceType<typeof CnDialog>>()

const props: CnPage.Props = reactive({
  params: {},
  action: Action,
  search: {
    items: [
      { label: '标题', prop: 'name', component: 'input' },
      { label: '类型', prop: 'type', component: 'select', dict: 'MENU_TYPE' },
      { label: '状态', prop: 'status', component: 'select', dict: 'MENU_STATUS' }
    ]
  },
  toolbar: {
    items: [
      {
        label: '新增',
        type: 'primary',
        onClick: () => {
          dialogRef.value?.open()
          dialogProps.formProps!.model = {}
          dialogProps.action = () => handleSubmit('add')
        }
      }
    ]
  },
  table: {
    rowKey: 'id',
    columns: [
      { prop: 'name', label: '标题' },
      { prop: 'sort', label: '排序' },
      { prop: 'type', label: '类型', dict: 'MENU_TYPE' },
      { prop: 'status', label: '状态', dict: 'MENU_STATUS' },
      { prop: 'code', label: '编码' },
      { prop: 'path', label: '地址' },
      { prop: 'component', label: '组件' },
      {
        prop: 'icon',
        label: '图标',
        icons: [
          {
            props: { size: '20px' }
          }
        ]
      },
      { prop: 'description', label: '描述' },
      {
        prop: 'action',
        label: '操作',
        minWidth: 120,
        buttons: [
          { label: '编辑', type: 'primary', text: true, onClick: handleEdit },
          { label: '删除', type: 'danger', text: true, onClick: handleRemove }
        ]
      }
    ],
    treeProps: { children: 'childList' }
  },
  pagination: false,
  refresh: new Date().getTime(),
  transformRequest: (params) => params,
  transformResponse: handleTransformResp
})

const step = ref('') // 有两个状态：add 或 delete

function Action(params: any) {
  return new Promise((resolve, reject) => {
    queryMenuTree(params)
      .then((res) => {
        if (res.code === '200') {
          resolve(res)
        } else {
          reject(res)
        }
      })
      .catch((err) => reject(err))
  })
}

function handleTransformResp(res: Res) {
  const { code, data } = res

  // 如果是 删除(delete) 或 新增(add)，则需要更新 pinia 的 menuList
  if (step.value === 'delete' || step.value === 'add') {
    updateMenuList(data)

    // 每次 新增菜单 都 更新动态路由
    step.value === 'add' && dymanicAddRoute(menuList.value, modules.value)
  }

  step.value = ''

  return { code, total: 0, rows: data }
}

function handleSubmit(action: 'add' | 'edit') {
  let params: Menu = {
    ...dialogProps.formProps!.model
  }

  if (action === 'add') {
    params = Object.assign({}, params, {
      createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      // createUser: 'ceshi'
    })

    if (params.parentId) {
      params.parentId = Number(params.parentId)
    } else {
      params.parentId = 0
    }
  } else {
    params = Object.assign({}, params, {
      updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      // updateUser: 'ceshi'
    })
  }

  return action === 'add' ? addMenu(params) : editMenu(params)
}

// 编辑
function handleEdit({ row }: any) {
  dialogRef.value?.open()
  dialogProps.formProps!.model = row
  dialogProps.action = () => handleSubmit('edit')
}

function handleRemove({ row }: any) {
  const opts = {
    message: `确定要删除${row.name}?`,
    title: '删除',
    action: () =>
      removeMenu({
        ids: row.id || ''
      }),
    success: () => {
      // 更新tab
      updateTabList(tabList.value.filter((t) => t.id !== row.id))
      step.value = 'delete'
      props.refresh = new Date().getTime()
    }
  }
  useConfirm(opts)
}

function queryMenuList() {
  step.value = 'add'
  props.refresh = new Date().getTime()
}
</script>
