<template>
  <CnDialog v-bind="dialogProps" ref="dialogRef" @success="onSuccess"> </CnDialog>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick, watch, onMounted, computed } from 'vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'
import CnTable from '@/components/cn-page//CnTable.vue'
import { SortDown, SortUp, Upload } from '@element-plus/icons-vue'
import Menu from './menu.vue'
import {
  type ThemeType,
  addMattersThemeInfo as AddRequest,
  editMattersThemeInfo as EditRequest,
  isExistThemeName,
  copyThemeInfo as CopyRequest
} from '@/api'

const checkThemeName = (rule: any, value: any, callback: any) => {
  isExistThemeName({
    themeName: dialogProps.formProps?.model?.themeName,
    id: dialogProps.formProps!.model?.id || ''
  }).then((res) => {
    if (!res.data) {
      callback()
    } else {
      if (type.value == 'edit') {
        console.log('value: ', value)
        if (oldThemeName == value) {
          callback()
        } else {
          callback(new Error('主题名称重复'))
        }
      } else {
        callback(new Error('主题名称重复'))
      }
    }
  })
}
const dialogProps = reactive({
  title: '',
  action: () => {
    let params: ThemeType = dialogProps.formProps!.model
    if (type.value === 'add') {
      return AddRequest(params)
    } else if (type.value === 'edit') {
      return EditRequest(params)
    } else if (type.value === 'copy') {
      params.copyId = params.id
      let _params = {
        copyId: params.id,
        remark: params.remark,
        themeName: params.themeName,
        status: params.status
      }
      return CopyRequest(_params)
    }
  },
  formProps: {
    model: {},
    items: [
      { label: '主题名称', prop: 'themeName', component: 'input', span: 24 },
      { label: '备注', prop: 'remark', component: 'input', props: { type: 'textarea' } }
    ],
    colSpan: 24,
    rules: {
      themeName: [
        { required: true, message: '请输入主题名称' },
        { validator: checkThemeName, trigger: 'blur' }
      ]
    }
  }
})

const dialogRef = ref()
const type = ref<string>('add')
let oldThemeName = ''
const open = (data: any, _type: string) => {
  type.value = _type || 'add'
  if (_type == 'edit') {
    dialogProps.title = '修改'
    dialogProps.formProps!.model = data
    dialogProps.formProps!.items = [
      { label: '包含菜单数', prop: 'menuCount', span: 12 },
      { label: '使用设备数', prop: 'devCount', span: 12 },
      { label: '创建人：', prop: 'createUser', span: 12 },
      { label: '创建时间', prop: 'createTime', span: 12 },
      { label: '主题编号', prop: 'themeCode', component: 'input', span: 12 },
      { label: '主题名称', prop: 'themeName', component: 'input', span: 12 },
      { label: '状态', prop: 'status', component: 'select', dict: 'START_STOP', span: 12 },
      { label: '备注', prop: 'remark', component: 'input', props: { type: 'textarea' }, span: 24 }
    ]
    oldThemeName = data.themeName
  }
  if (_type == 'add') {
    dialogProps.formProps!.model = {}
    dialogProps.title = '新增'
  }
  if (_type == 'copy') {
    dialogProps.formProps!.model = data
    dialogProps.title = '复制'
  }
  dialogRef.value.open()
}
defineExpose({ open })
</script>

<style lang="scss" scoped>
.tab-list {
  display: flex;
  gap: 5px;
  flex-direction: wrap;
  align-items: center;
  flex-wrap: wrap;
}
.checked {
  background: #409eff;
  color: #fff;
  &:deep(.el-icon) {
    color: #fff;
  }
}

.inputwidth {
  width: 100px;
}
</style>
