import type { ActionType, getDialogConfigParams } from './type'

export function getDialogConfig(actionType: ActionType) {
  if (actionType === 'add' || actionType === 'edit') {
    return getAddOrEditActionDialogConfig
  } else if (actionType === 'delete' || actionType === 'manyDelete') {
    return getDeleteActionDialogConfig
  } else {
    return getDetailActionDialogConfig
  }
}

// 新建/编辑标签
export function getAddOrEditActionDialogConfig(params: getDialogConfigParams): CnPage.DialogProps {
  const { dialogSubmitSuccess, model, onClose } = params
  return {
    title: model ? '编辑标签' : '新建标签',
    formProps: {
      model: model ? { ...model, status: '1' } : { status: '1' },
      labelPosition: 'left',
      requireAsteriskPosition: 'right',
      items: [
        { label: '标签名称', prop: 'lableName', component: 'input' },
        { label: '备注', prop: 'remark', component: 'input' },
        { label: '图标', prop: 'lableIcon', component: 'slot' }
      ],
      labelWidth: 120,
      rules: {
        lableName: [{ required: true, message: '请输入标签名称' }]
      }
    },
    onSuccess: dialogSubmitSuccess,
    onClose
  }
}

// 删除标签
export function getDeleteActionDialogConfig(params: getDialogConfigParams): CnPage.DialogProps {
  return {
    title: '删除标签',
    formProps: {
      model: {},
      labelPosition: 'left',
      requireAsteriskPosition: 'right',
      items: [{ label: '', prop: 'deleteTitle', component: 'slot' }],
      labelWidth: 0
    }
  }
}

// 查看标签详情
export function getDetailActionDialogConfig(params: getDialogConfigParams): CnPage.DialogProps {
  const { model } = params
  return {
    title: '事项标签详情',
    formProps: {
      model: model!,
      labelPosition: 'left',
      requireAsteriskPosition: 'right',
      items: [
        { label: '标签编号', prop: 'id' },
        { label: '标签名称', prop: 'lableName' },
        { label: '状态', prop: 'status' },
        { label: '备注', prop: 'remark' },
        { label: '图标', prop: 'lableIcon', component: 'image' },
        { label: '使用事项数', prop: 'mattersCount' },
        { label: '创建人', prop: 'createUser' },
        { label: '创建时间', prop: 'createTime' }
      ],
      labelWidth: 120,
      colSpan: 12
    }
  }
}
