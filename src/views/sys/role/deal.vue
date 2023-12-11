<template>
  <CnDialog v-bind="dialogProps" ref="dialogRef" @success="onSuccess"> </CnDialog>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch, onMounted } from 'vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'
import { useHomeStore } from '@/stores/home'
import CnPage from '@/components/cn-page/CnPage.vue'
import type { Value } from 'sass';
import { type DictType, dictTypeAdd as AddRequest, dictTypeEdit as EditRequest } from '@/api'
import { textChangeRangeIsUnchanged } from 'typescript';
import { sysRoleAdd, sysRoleGetId, sysRoleEdit } from '@/api/admin';
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus';


const [store] = [useHomeStore()]
const { menuList } = storeToRefs(store)
const type = ref()
const treeData = reactive([]);
const dialogProps: CnPage.DialogProps = reactive({
  title: '新增',
  formProps: {
    model: {},
    items: [
      { label: '基本信息', component: 'divider', span: 24 },
      { label: '角色名称', prop: 'name', component: 'input' },
      { label: '状态', prop: 'status', component: 'input' },
      { label: '角色描述', prop: 'description', component: 'input', props: { type: 'textarea' } },
      { label: '功能权限', component: 'divider', span: 24 },
      {
        label: '',
        component: 'tree',
        span: 24,
        prop: 'menuIds',
        props: {
          showCheckbox: true,
          props: {
            label: "name",
            children: "childList",
          },
          data: menuList,
          nodeKey: 'id',
          onCheckChange: (data) => {
            // console.log('data: ', data)
          }
        }
      }
    ],
    colSpan: 24,
    rules: {
      type: [{ required: true, message: '请输入类型' }],
      description: [{ required: true, message: '请输入描述' }]
    }
  }
})

const dialogRef = ref()

const open = (data?: any, type?: string) => {
  dialogRef.value.open()
  if (!type) {
    // 新增
    
    dialogProps.formProps!.model = {
      menuIds: ['43']
    }
    dialogProps.action = () => handleSubmit('add')
    type.value = 'add'
  } else {
    if(type === "view") {
      dialogProps.formProps!.disabled = true
    }
    sysRoleGetId(data.id).then((res: any) => {
      if (res.code === "200") {
        dialogProps.formProps!.model = res.data;
      }
    })
    dialogProps.action = () => handleSubmit('edit')
    type.value = 'edit'
  }
}

function handleSubmit(action: 'add' | 'edit') {
  console.log(action);
  if (action === 'add') {
    const params: any = {
      ...dialogProps.formProps!.model
    }
    sysRoleAdd(params).then(res => {
      if (res.code === "200") {
        ElMessage({
          type: "success",
          message: res.message,
        });
        dialogRef.value.toggle();
      }
    })
  } else {
    const params: any = {
      ...dialogProps.formProps!.model
    }
    sysRoleEdit(params).then(res => {
      if (res.code === "200") {
        ElMessage({
          type: "success",
          message: res.message,
        });
        dialogRef.value.toggle();
      }
    })
  }
  // console.log('params: ', params)
  // return action === 'add' ? 'ddd' : 'dd'
}

defineExpose({ open })
</script>

<style scoped lang="scss"></style>
