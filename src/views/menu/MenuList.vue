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
    <template #status>
      <el-radio-group v-model="dialogProps.formProps!.model!.status">
        <el-radio label="1" size="large">启用</el-radio>
        <el-radio label="0" size="large">禁用</el-radio>
      </el-radio-group>
    </template>
  </CnDialog>
  <IconDialog v-model:value="dialogProps.formProps!.model.icon" ref="IconDialogRef" />
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from 'vue'
import { useHomeStore } from '@/stores/home'
import { storeToRefs } from 'pinia'
import moment from 'moment'
import { addMenu, removeMenu, editMenu, checkMenuList, type ListRes } from '@/api'

import { ElMessageBox, ElMessage } from 'element-plus'

import CnPage from '@/components/cn-page/CnPage.vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'
import IconDialog from './iconsDialog.vue'

import type { Menu } from '@/layout/slider/type'

const store = useHomeStore()
const { modules, menuList } = storeToRefs(store)
const { getMenuList } = store

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
        // props: { slots: [{ name: 'append', component: 'icon', label: 'Flag' }] },
        // slots: []
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
      { label: '状态', prop: 'status', span: 24, component: 'slot' },
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
  action: (params) => checkMenuList(params),
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
            /*props: {}*/
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
  transformResponse: handleTransformResp
})

function handleTransformResp(res: ListRes) {
  const { code, rows, total } = res

  if (code !== '200') return ElMessage.error({ message: '查询失败' })

  return { code, total, rows: assembleData(rows as Menu[]) }
}

// 把扁平化的树结构还原
function assembleData(menus: Menu[]) {
  const map: any = {}
  const list: Menu[] = []

  menus.forEach((item: any) => {
    const { id } = item
    map[`${id}`] = { ...item, childList: [] }
  })

  menus.forEach((node) => {
    const { parentId, id } = node

    if (parentId === 0) {
      list.push(map[`${id}`])
    } else {
      if (!!map[`${parentId}`]) {
        map[`${parentId}`].childList.push(map[`${id}`])
      } else {
        list.push(map[`${id}`])
      }
    }
  })

  return list
}

function handleSubmit(action: 'add' | 'edit') {
  let params: Menu = {
    ...dialogProps.formProps!.model
  }

  if (action === 'add') {
    params = Object.assign({}, params, {
      createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      createUser: 'ceshi'
    })

    if (params.parentId) {
      params.parentId = Number(params.parentId)
    } else {
      params.parentId = 0
    }
  } else {
    params = Object.assign({}, params, {
      updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      updateUser: 'ceshi'
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
  ElMessageBox.confirm(`确定要删除${row.name}?`, {
    title: '删除',
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        instance.confirmButtonText = 'Loading...'

        const params = {
          ids: row.id || ''
        }

        removeMenu(params)
          .then((res) => {
            const { code, message } = res

            if (code == '200') {
              done()
            } else {
              ElMessage.error({ message: `${message}` })
            }
          })
          .finally(() => {
            instance.confirmButtonLoading = false
          })
      } else {
        done()
      }
    }
  }).then(() => {
    ElMessage.success({ message: '删除成功' })
    props.refresh = new Date().getTime()
    getMenuList({})
  })
}

function queryMenuList() {
  props.refresh = new Date().getTime()
  getMenuList({})
}
</script>
