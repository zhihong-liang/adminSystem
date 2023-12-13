<template>
  <CnDialog v-bind="dialogProps" ref="dialogRef" @success="onSuccess">
    <template #menuIds>
      <div class="menu">
        <el-checkbox
          :indeterminate="indeterminate"
          v-model="allCheck"
          label="全选"
          @change="handleChaneAllCheck"
        />
        <el-tree
          ref="elTreeRef"
          v-model="treeData"
          :props="{
            label: 'name',
            children: 'childList',
            value: 'id'
          }"
          :data="menuList"
          nodeKey="id"
          show-checkbox
          @check-change="handleCheckChange"
        >
        </el-tree>
      </div>
    </template>
  </CnDialog>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch, onMounted } from 'vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'
import { useHomeStore } from '@/stores/home'
import CnPage from '@/components/cn-page/CnPage.vue'
import type { Value } from 'sass'
import { type DictType, dictTypeAdd as AddRequest, dictTypeEdit as EditRequest } from '@/api'
import { sysRoleAdd, sysRoleGetId, sysRoleEdit } from '@/api/admin'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'

const [store] = [useHomeStore()]
const { menuList } = storeToRefs(store)
let allsubs: string[] = []
const type = ref()
const treeData = ref([])
const elTreeRef = ref()

const dialogProps: CnPage.DialogProps = reactive({
  title: '新增',
  formProps: {
    model: {},
    items: [
      { label: '基本信息', component: 'divider', span: 24 },
      { label: '角色名称', prop: 'name', component: 'input' },
      { label: '状态', prop: 'status', component: 'select', dict: 'ROLE_STATUS' },
      { label: '角色描述', prop: 'description', component: 'input', props: { type: 'textarea' } },
      { label: '功能权限', component: 'divider', span: 24 },
      { label: '', component: 'slot', prop: 'menuIds' }
    ],
    colSpan: 24,
    rules: {
      type: [{ required: true, message: '请输入类型' }],
      description: [{ required: true, message: '请输入描述' }]
    }
  }
})

const dialogRef = ref()
const subnodes = []
const open = (data?: any, _type?: string) => {
  dialogRef.value.open()
  allsubs = getAllKeys(menuList.value)
  if (!_type) {
    // 新增
    dialogProps.action = () => handleSubmit('add')
    type.value = 'add'
    indeterminate.value = false
    allCheck.value = false
  } else {
    if (_type === 'view') {
      dialogProps.formProps!.disabled = true
    }
    sysRoleGetId(data.id).then((res: any) => {
      if (res.code === '200') {
        dialogProps.formProps!.model = res.data
        treeData.value = res.data.menuIds
        // 树节点赋值回显
        elTreeRef.value.setCheckedKeys(res.data.menuIds, false)
      }
    })
    dialogProps.action = () => handleSubmit('edit')
    type.value = 'edit'
  }
}

function handleSubmit(action: 'add' | 'edit') {
  if (action === 'add') {
    const params: any = {
      ...dialogProps.formProps!.model,
      menuIds: treeData.value
    }
    sysRoleAdd(params).then((res) => {
      if (res.code === '200') {
        ElMessage({
          type: 'success',
          message: res.message
        })
        dialogRef.value.close()
      }
    })
  } else {
    const params: any = {
      ...dialogProps.formProps!.model,
      menuIds: treeData.value
    }
    sysRoleEdit(params).then((res) => {
      if (res.code === '200') {
        ElMessage({
          type: 'success',
          message: res.message
        })
        dialogRef.value.close()
      }
    })
  }
}

const handleCheckChange = (data: any, checked: boolean) => {
  treeData.value = elTreeRef.value.getCheckedKeys()
}

defineExpose({ open })

function getAllKeys(tree: any) {
  let keys: string[] = []
  function traverse(node: any) {
    keys.push(node.id)
    if (node.childList && node.childList.length > 0) {
      node.childList.forEach((child: any) => {
        traverse(child)
      })
    }
  }
  tree.forEach((item: any) => {
    traverse(item)
  })
  return keys
}

// 全选
const indeterminate = ref(false) // 不确定
const allCheck = ref(false)
const handleChaneAllCheck = (val) => {
  if (val) {
    // 全选
    elTreeRef.value.setCheckedKeys(allsubs, false)
  } else {
    // 反选
    elTreeRef.value.setCheckedKeys([], false)
  }
  treeData.value = elTreeRef.value.getCheckedKeys()
}

// 全选 反选 回显
watch(
  () => treeData.value,
  (val) => {
    if (val.length) {
      indeterminate.value = true
    } else {
      indeterminate.value = false
    }
    if (allsubs.length == val.length) {
      indeterminate.value = false
      allCheck.value = true
    } else {
      allCheck.value = false
    }
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.menu {
  display: flex;
  flex-direction: column;
}
</style>
