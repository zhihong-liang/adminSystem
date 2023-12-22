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
import { reactive, ref, nextTick, watch, onMounted, computed } from 'vue'
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

const checkMemuIds = (rule: any, value: any, callback: any) => {
  console.log('value: ', treeData.value)
  nextTick(() => {
    if (!treeData.value.includes(45)) {
      if (allCheck.value) {
        callback()
      } else {
        callback(new Error('个人中心必选'))
      }
    } else {
      callback()
    }
  })
}

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
      name: [{ required: true, message: '请输入角色名称' }],
      status: [{ required: true, message: '请选中状态', trigger: 'change' }],
      menuIds: [{ validator: checkMemuIds }]
    }
  }
})

const dialogRef = ref()
const open = (data?: any, _type?: string) => {
  dialogRef.value.open()
  allsubs = getAllKeys(menuList.value)
  if (_type === 'view') {
    dialogProps.formProps!.disabled = true
  } else {
    dialogProps.formProps!.disabled = false
  }
  if (!_type) {
    // 新增
    dialogProps.action = () => handleSubmit('add')
    type.value = 'add'
    indeterminate.value = false
    allCheck.value = false
    dialogProps.formProps!.disabled = false
    // 个人中心默认选中
    dialogProps.formProps!.model = { menuIds: ['45'] }
    nextTick(() => {
      elTreeRef.value.setCheckedKeys(['45'], false)
    })
  } else {
    if (_type === 'view') {
      dialogProps.formProps!.disabled = true
    } else {
      dialogProps.formProps!.disabled = false
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
    return sysRoleAdd(params)
  } else {
    const params: any = {
      ...dialogProps.formProps!.model,
      menuIds: treeData.value
    }
    return sysRoleEdit(params)
  }
}

const handleCheckChange = (data: any, checked: boolean) => {
  treeData.value = elTreeRef.value.getCheckedKeys()
  // todo: 触发校验
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
// 多个子菜单时，不全选不会返回父级菜单ID
// 若返回父级菜单ID，子菜单会被全部选中
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
