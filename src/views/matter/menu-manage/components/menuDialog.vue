<template>
  <CnDialog v-bind="dialogProps" ref="dialogRef" @success="handleSuccess">
    <template #menuIcon>
      <UploadPic v-model:value="dialogProps.formProps!.model.menuIcon" :limit="1" />
    </template>
    <template #parentId>
      <el-cascader
        v-model="dialogProps.formProps!.model.parentId"
        :props="cascaderProps"
        @change="handleChange"
        ref="cascaderRef"
      />
    </template>
  </CnDialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { queryMatterMenulist_No, addMatterMenu, editMatterMenu } from '@/api/matter'
import { DEFAILT_ITEM } from '../config/data'

// import UploadPic from '@/components/cn-page/CnUpload.vue'

import UploadPic from './uploadPic.vue'

import type { Resolve } from 'element-plus'
import type { MatterMenuResponse } from '../config/type'

const emits = defineEmits(['success'])

const model = ref('') // add(新增)、edit(编辑)、copy(复制)模式
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
  const params: any = {
    ...dialogProps?.formProps!.model,
    menuLevel: _menuLevel.value === 1 ? 1 : _menuLevel.value
  }

  if (params.parentId && Array.isArray(params.parentId)) {
    params.parentId = params.parentId[params.parentId.length - 1]
  }

  if (model.value === 'copy') {
    params.copyId = params.id
    params.id = null
  }

  return model.value === 'edit' ? editMatterMenu(params) : addMatterMenu(params)
}

function handleSuccess() {
  emits('success')
  close()
}

const _menuLevel = ref<number>(1)
// 上级菜单懒加载
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
  dialogProps.formProps!.model = {}
}

function init(params: any) {
  model.value = params.model
  dialogProps.formProps!.items = DEFAILT_ITEM.filter((item) =>
    item.model.includes(params.model)
  ) as CnPage.FormItem[]
  dialogProps.formProps!.model = { ...params.data }

  if (params.data.parentId) {
    dialogProps.formProps!.model.parentId = [params.data.parentId, params.data.id]
  }

  if (params.model === 'add') {
    dialogProps.formProps!.colSpan = 24
    dialogProps.title = '新增事项菜单'
  } else {
    dialogProps.formProps!.colSpan = 12
    dialogProps.title = params.model === 'edit' ? '编辑' : '复制'
  }
}

defineExpose({ open, close })
</script>

<style scoped></style>
