<template>
  <CnDialog v-bind="dialogProps" ref="dialogRef" @success="handleSuccess">
    <template #parentId>
      <el-cascader
        v-model="dialogProps.formProps!.model.parentId"
        :props="cascaderProps"
        @change="handleChange"
        ref="cascaderRef"
      />
    </template>
    <!-- <template #footer>
      <span>{{ dialogProps.formProps?.model.parentId }}</span>
    </template> -->
  </CnDialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { queryMatterMenuRelation, queryMatterMenulist_No, addMatterMenu } from '@/api/matter'

import type { Resolve } from 'element-plus'
import type { MatterMenuResponse } from '../config/type'

const DEFAILT_ITEM = [
  {
    label: '菜单编号',
    prop: 'menuCode',
    component: '',
    model: ['edit']
  },
  {
    label: '菜单等级',
    prop: 'menuLevel',
    component: '',
    dict: 'MATTERS_MENU_LEVEL',
    model: ['edit']
  },
  {
    label: '使用主题数',
    prop: 'themeCount',
    component: '',
    model: ['edit']
  },
  {
    label: '创建时间',
    prop: 'createTime',
    component: '',
    model: ['edit']
  },
  {
    label: '包含事项数',
    prop: 'mattersCount',
    component: '',
    model: ['edit']
  },
  {
    label: '创建人',
    prop: 'createUser',
    component: '',
    model: ['edit']
  },
  {
    label: '状态',
    prop: 'status',
    component: 'select',
    dict: 'START_STOP',
    model: ['edit']
  },
  {
    label: '菜单名称',
    prop: 'menuName',
    component: 'input',
    props: { maxlength: 6, showWordLimit: true },
    model: ['add', 'edit']
  },
  { label: '补充说明', prop: 'description', component: 'input', model: ['add', 'edit'] },
  {
    label: '备注',
    prop: 'remark',
    component: 'input',
    props: { type: 'textarea', maxlength: 200, showWordLimit: true },
    model: ['add', 'edit']
  },
  { label: '图标', prop: 'menuIcon', component: 'slot', model: ['add', 'edit'] },
  { label: '背景颜色', prop: 'backColor', component: 'input', model: ['add', 'edit'] },
  {
    label: '上级菜单',
    prop: 'parentId',
    component: 'slot',
    model: ['add', 'edit']
  }
]

const emits = defineEmits(['success'])

const dialogProps: CnPage.DialogProps = reactive({
  title: '',
  formProps: {
    model: {},
    labelPosition: 'left',
    labelWidth: '100',
    items: DEFAILT_ITEM,
    colSpan: 24,
    rules: {
      menuName: [{ required: true, message: '请输入菜单名称' }],
      backColor: [{ required: true, message: '请输入背景颜色' }]
      // parentId: [{ required: true, message: '请选择上级菜单' }]
    }
  },
  action: DialogAction
})

function DialogAction() {
  const params = {
    ...dialogProps?.formProps!.model,
    menuLevel: _menuLevel.value === 1 ? 1 : _menuLevel.value
  }

  return addMatterMenu(params)
}

function handleSuccess() {
  emits('success')
  close()
}

const _menuLevel = ref<number>(1)
// 上级菜单懒加载
const cascaderProps = {
  emitPath: false,
  checkStrictly: true,
  lazy: true,
  lazyLoad(node: any, resolve: Resolve) {
    const { value } = node

    const params = {
      parentId: value
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

const cascaderRef = ref()
function handleChange() {
  // 获取当前点击节点的menuLevel
  const nodes = cascaderRef.value.getCheckedNodes()
  if (nodes && nodes.length) {
    _menuLevel.value = nodes[0]?.data.menuLevel + 1
  }
}

const dialogRef = ref()
function open(data: any) {
  dialogRef.value.open()
  init(data)
}
function close() {
  dialogRef.value.close()
  resetAll()
}

function resetAll() {
  _menuLevel.value = 1
  //   dialogProps.formProps.model = {}
}

function init(params: any) {
  dialogProps.formProps!.items = DEFAILT_ITEM.filter((item) =>
    item.model.includes(params.model)
  ) as any
  dialogProps.formProps!.model = params.data

  if (params.model === 'add') {
    dialogProps.formProps!.colSpan = 24
    dialogProps.title = '新增事项菜单'
  } else {
    dialogProps.formProps!.colSpan = 12
    dialogProps.title = '编辑'
  }
}

defineExpose({ open, close })
</script>

<style scoped></style>
