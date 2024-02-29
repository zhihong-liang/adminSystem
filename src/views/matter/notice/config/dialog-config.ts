import type { ActionType, getDialogConfigParams } from './type'

export default function getDialogConfig(actionType: ActionType) {
  if (actionType === 'add') {
    return getAddActionDialogConfig
  } else if (actionType === 'delete' || actionType === 'manyDelete') {
    return getDeleteActionDialogConfig
  } else if (actionType === 'detail') {
    return getDetailActionDialogConfig
  } else {
    return getEditActionDialogConfig
  }
}

// 删除办理须知
export function getDeleteActionDialogConfig(params: getDialogConfigParams): CnPage.DialogProps {
  return {
    title: '删除办理须知',
    formProps: {
      model: {},
      labelPosition: 'left',
      requireAsteriskPosition: 'right',
      items: [{ label: '', prop: 'deleteTitle', component: 'slot' }],
      labelWidth: 0
    }
  }
}

// 新建办理须知
export function getAddActionDialogConfig(params: getDialogConfigParams): CnPage.DialogProps {
  const { dialogSubmitSuccess } = params
  return {
    title: '新建办理须知',
    formProps: {
      model: {},
      labelPosition: 'left',
      requireAsteriskPosition: 'right',
      items: [
        { label: '事项名称', prop: 'matterInfo', component: 'slot' },
        { label: '办理材料', prop: 'noticeFileList', component: 'slot' },
        {
          label: '办理条件',
          prop: 'processingConditions',
          component: 'editor',
          props: {
            height: '300px',
            toolbarConfig: {
              excludeKeys: ['group-image', 'group-video'] // 去掉图片/视频
            }
          }
        }
      ],
      rules: {
        matterInfo: [{ required: true, message: '请选择事项' }],
        processingConditions: [{ required: true, message: '请填写办理条件' }]
      },
      labelWidth: 80
    },
    onSuccess: dialogSubmitSuccess
  }
}

// 编辑办理须知
export function getEditActionDialogConfig(params: getDialogConfigParams): CnPage.DialogProps {
  const { dialogSubmitSuccess, model } = params
  return {
    title: '编辑办理须知',
    formProps: {
      model: model ?? {},
      labelPosition: 'left',
      requireAsteriskPosition: 'right',
      items: [
        { label: '事项名称', prop: 'matterInfo', component: 'slot' },
        { label: '办理材料', prop: 'noticeFileList', component: 'slot' },
        {
          label: '办理条件',
          prop: 'processingConditions',
          component: 'editor',
          props: {
            height: '300px',
            toolbarConfig: {
              excludeKeys: ['group-image', 'group-video'] // 去掉图片/视频
            }
          }
        }
      ],
      rules: {
        matterInfo: [{ required: true, message: '请选择事项' }],
        processingConditions: [{ required: true, message: '请填写办理条件' }]
      },
      colSpan: 24,
      labelWidth: 80
    },
    onSuccess: dialogSubmitSuccess
  }
}

// 查看办理须知详情
export function getDetailActionDialogConfig(params: getDialogConfigParams): CnPage.DialogProps {
  const { model } = params
  return {
    title: '办理须知详情',
    formProps: {
      model: model ?? {},
      labelPosition: 'left',
      items: [
        { label: '事项编号', prop: 'matterCode' },
        { label: '事项名称', prop: 'matterName' },
        { label: '事项别名', prop: 'matterAlias' },
        { label: '系统办理范围', prop: 'sysCoverage' },
        { label: '办理须知状态', prop: 'status', component: 'slot', readonly: true },
        { label: '办理材料', prop: 'detailNoticeFileList', component: 'slot', span: 24, readonly: true },
        {
          label: '办理条件',
          prop: 'processingConditions',
          component: 'slot'
        }
      ],
      labelWidth: 120
    }
  }
}

// 自定义上传
export function getSelfUploadActionDialogConfig(): CnPage.DialogProps {
  return {
    title: '自定义上传材料',
    formProps: {
      model: {},
      labelPosition: 'left',
      requireAsteriskPosition: 'right',
      items: [
        { label: '材料名称', prop: 'fileName', component: 'input', span: 20 },
        { label: '材料上传', prop: 'fileUrl', component: 'slot' },
        {
          label: '',
          prop: 'tips',
          component: 'slot'
        }
      ],
      rules: {
        fileName: [{ required: true, message: '请输入材料名称' }],
        fileUrl: [{ required: true, message: '请选择材料上传' }]
      },
      labelWidth: 80
    }
  }
}
