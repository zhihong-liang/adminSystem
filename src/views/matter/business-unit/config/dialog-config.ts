import type { ActionType, getDialogConfigParams } from './type'

export function getDialogConfig(actionType: ActionType) {
  if (actionType === 'add' || actionType === 'edit') {
    return getAddOrEditActionDialogConfig
  } else if (actionType === 'delete') {
    return getDeleteActionDialogConfig
  } else {
    return getDetailActionDialogConfig
  }
}

// 新建/编辑业务部门
export function getAddOrEditActionDialogConfig(params: getDialogConfigParams): CnPage.DialogProps {
  const { dialogSubmitSuccess, model } = params
  return {
    title: model ? '编辑业务部门' : '新建业务部门',
    formProps: {
      model: model ? { ...model, status: '1' } : { status: '1' },
      labelPosition: 'left',
      requireAsteriskPosition: 'right',
      items: [
        { label: '业务部门', prop: 'businessDeptName', component: 'input' },
        { label: '备注', prop: 'remark', component: 'input' }
      ],
      labelWidth: 120,
      rules: {
        businessDeptName: [{ required: true, message: '请输入业务部门' }]
      }
    },
    onSuccess: dialogSubmitSuccess
  }
}

// 删除业务部门
export function getDeleteActionDialogConfig(params: getDialogConfigParams): CnPage.DialogProps {
  return {
    title: '删除业务部门',
    formProps: {
      model: {},
      labelPosition: 'left',
      requireAsteriskPosition: 'right',
      items: [{ label: '', prop: 'businessDeptName', component: 'slot' }],
      labelWidth: 0
    }
  }
}

// 业务部门详情
export function getDetailActionDialogConfig(params: getDialogConfigParams): CnPage.DialogProps {
  const { model } = params
  return {
    title: '业务部门详情',
    formProps: {
      model: model ?? {},
      labelPosition: 'left',
      requireAsteriskPosition: 'right',
      items: [
        { label: '业务部门', prop: 'businessDeptName' },
        { label: '备注', prop: 'remark' }
      ],
      labelWidth: 120
    }
  }
}
