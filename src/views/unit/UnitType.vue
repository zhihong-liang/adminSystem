<template>
  <CnPage v-bind="props" />
  <CnDialog ref="dialogRef" v-bind="dialogProps" />
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import CnPage from '@/components/cn-page/CnPage.vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'
import { useDelete } from '@/hooks/useConfirm'
import {
  getUnitTypeList,
  updateUnitTypeSort,
  addUnitType,
  editUnitType,
  delUnitType,
  type UnitType
} from '@/api/admin'
import { removeDictionary } from '@/hooks/useDictionary'

type UnitTypeReq = Partial<Omit<UnitType, 'dataPermissionPolicy'>> & {
  dataPermissionPolicy?: string[]
}

const dialogRef = ref()
const dialogProps = reactive<CnPage.DialogProps<UnitTypeReq>>({
  formProps: {
    model: {},
    items: [
      { label: '单位类型', prop: 'unitTypeName', component: 'input' },
      {
        label: '数据权限策略',
        prop: 'dataPermissionPolicy',
        component: 'checkbox',
        dict: 'DATA_PERMISSION_POLICY'
      }
    ],
    colSpan: 24,
    labelWidth: 120,
    rules: {
      unitTypeName: [{ required: true, message: '请输入单位类型' }],
      dataPermissionPolicy: [{ required: true, message: '请选择数据权限策略' }]
    }
  }
})
const saveUnitType = (type = 'add', model: UnitTypeReq = { status: '1' }) => {
  dialogProps.title = type === 'add' ? '新增单位类型' : '编辑单位类型'
  dialogProps.formProps!.model = { ...model }
  dialogProps.action = () => {
    const model = dialogProps.formProps?.model || {}
    const action = type === 'add' ? addUnitType : editUnitType
    return action({
      ...model,
      dataPermissionPolicy: model.dataPermissionPolicy.join()
    })
  }
  dialogProps.onSuccess = saveUnitTypeSuccess
  dialogRef.value?.open()
}

const props = reactive<CnPage.Props<UnitType, UnitTypeReq>>({
  params: {},
  action: getUnitTypeList,
  search: {
    items: [{ label: '单位类型', prop: 'unitTypeName', component: 'input' }]
  },
  toolbar: {
    items: [{ label: '新增', type: 'success', onClick: () => saveUnitType() }]
  },
  table: {
    columns: [
      { type: 'index', label: '序号', width: 60 },
      { label: '单位类型', prop: 'unitTypeName' },
      { label: '使用单位数', prop: 'unitCount' },
      { label: '创建时间', prop: 'createTime' },
      {
        label: '操作',
        prop: 'action',
        buttons: [
          {
            label: '上移',
            type: 'primary',
            onClick: ({ row }) => {
              updateUnitTypeSort('upper', row.id)
                .then((res) => {
                  ElMessage.success(res.message || '操作成功')
                  props.refresh = Date.now()
                })
            }
          },
          {
            label: '下移',
            type: 'success',
            onClick: ({ row }) => {
              updateUnitTypeSort('below', row.id)
                .then((res) => {
                  ElMessage.success(res.message || '操作成功')
                  props.refresh = Date.now()
                })
            }
          },
          {
            label: '编辑',
            type: 'warning',
            onClick: ({ row }) =>
              saveUnitType('edit', {
                ...row,
                dataPermissionPolicy: row.dataPermissionPolicy?.split(',')
              })
          },
          {
            label: '删除',
            type: 'danger',
            onClick: ({ row }) => {
              useDelete({
                action: () => delUnitType(row.id!.toString()),
                success: saveUnitTypeSuccess
              })
            }
          }
        ]
      }
    ]
  }
})

function saveUnitTypeSuccess() {
  props.refresh = Date.now()
  removeDictionary('UNIT_TYPE')
}
</script>
