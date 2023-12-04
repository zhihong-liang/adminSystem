<template>
  <CnPage v-bind="props"></CnPage>
  <CnDialog v-bind="dialogProps" ref="dialogRef" @success="queryMenuList">
    <template #status>
      <el-radio-group v-model="dialogProps.formProps!.model!.status">
        <el-radio label="1" size="large">启用</el-radio>
        <el-radio label="0" size="large">禁用</el-radio>
      </el-radio-group>
    </template>
  </CnDialog>
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

import type { Menu } from '@/layout/slider/type'

const store = useHomeStore()
const { modules } = storeToRefs(store)
// const { getMenuList, updateMenuList } = store

const componentMenu = computed(() =>
  Object.keys(modules.value).map((m) => ({ value: m.replace('..', '') }))
)

// 模拟数据
const menuTree = [
  { title: '首页', sort: 1, id: 1 },
  { title: '个人中心', sort: 2, id: 2, children: [{ title: '用户详情', sort: 99, id: 99 }] },
  { title: '设备管理', sort: 3, id: 3 },
  { title: '农信社特派员', sort: 4, id: 4 }
]

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
          options: componentMenu.value
        }
      },
      { label: '图标', prop: 'icon', component: 'input' },
      {
        label: '父级菜单',
        prop: 'parentId',
        component: 'input'
      },
      {
        label: '类型',
        prop: 'type',
        component: 'select',
        props: {
          options: [
            { label: '菜单', value: 'menu' },
            { label: '模块', value: 'dirt' },
            { label: '按钮', value: 'action' }
          ]
        }
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

const props: CnPage.Props = reactive({
  params: {},
  action: (params) => checkMenuList(params),
  search: {
    items: [
      { label: '标题', prop: 'name', component: 'input' },
      { label: '类型', prop: 'type', component: 'select' },
      { label: '状态', prop: 'status', component: 'select' }
    ]
  },
  toolbar: {
    items: [
      {
        label: '新增',
        type: 'primary',
        onClick: () => {
          dialogRef.value?.open()
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
      { prop: 'type', label: '类型' },
      { prop: 'status', label: '状态' },
      { prop: 'code', label: '编码' },
      { prop: 'path', label: '地址' },
      { prop: 'component', label: '组件' },
      { prop: 'icon', label: '图标', icons: [{/*props: {}*/ }] }, // show：控制icon的显示？
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

  return { code, total, rows: assembleData(rows as Menu[])}
}

// 把扁平化的树结构还原
function assembleData(menus: Menu[]) {
  const map = new Map()
  const list: Menu[] = []

  for (const item of menus) {
    const { id, parentId } = item

    item.childList = []
    map.set(id, item)

    if (parentId === 0) {
      list.push(item)
    } else {
      if (map.has(parentId)) {
        map.get(parentId).childList.push(item)
      } else {
        list.push(item)
      }
    }
  }

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
  })
}

function queryMenuList() {
  props.refresh = new Date().getTime()
}
</script>
