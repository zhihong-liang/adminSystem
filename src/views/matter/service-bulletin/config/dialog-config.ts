import type { ActionType, getDialogConfigParams } from './type'

export function getDialogConfig(actionType: ActionType) {
  if (actionType === 'add' || actionType === 'edit') {
    return getAddOrEditActionConfig
  } else if (actionType === 'delete') {
    return getDeleteActionConfig
  } else if (actionType === 'offShelf') {
    return getOffShelfActionConfig
  } else {
    return getEditOrEditActionConfig
  }
}

// 新建公告
export function getAddOrEditActionConfig(params: getDialogConfigParams): CnPage.DialogProps {
  const { model, dialogSubmitSuccess, handle } = params
  return {
    title: handle === 'edit' ? '编辑服务公告' : '新建服务公告',
    formProps: {
      model: model!,
      labelPosition: 'left',
      colSpan: 24,
      items: [
        {
          label: '公告标题',
          prop: 'noticeName',
          component: 'input'
        },
        {
          label: '来源',
          prop: 'noticeSource',
          component: 'input'
        },
        {
          label: '类型',
          prop: 'noticeTyle',
          component: 'select',
          dict: 'NOTICE_TYPE'
        },
        {
          label: '发布区域',
          prop: 'pushAreaCode',
          component: 'slot'
        },
        {
          label: '设备类型',
          prop: 'deviceType',
          component: 'checkbox',
          dict: 'DEV_TYPE'
        },
        {
          label: '信息展示期',
          prop: 'startDate',
          component: 'slot'
        },
        {
          label: '公告内容',
          prop: 'content',
          component: 'editor',
          props: {
            toolbarConfig: {
              excludeKeys: ['group-image', 'group-video'] // 去掉图片/视频
            }
          }
        }
      ],
      rules: {
        noticeName: [{ required: true, message: '请输入公告标题' }],
        noticeSource: [{ required: true, message: '请输入来源' }],
        noticeTyle: [{ required: true, message: '请选择类型' }],
        pushAreaCode: [{ required: true, message: '请选择发布区域' }],
        deviceType: [{ required: true, message: '请选择设备类型' }],
        startDate: [{ required: true, message: '请选择信息展示期' }],
        content: [{ required: true, message: '请输入公告内容' }]
      },
      labelWidth: 120
    },
    onSuccess: dialogSubmitSuccess
  }
}

// 删除服务公告
function getDeleteActionConfig(params: getDialogConfigParams): CnPage.DialogProps {
  const {} = params
  return {
    title: '删除',
    formProps: {
      model: {},
      labelPosition: 'left',
      items: [
        {
          label: '',
          prop: 'deleteTitle',
          component: 'slot'
        }
      ],
      labelWidth: 0
    }
  }
}

// 下架服务公告
function getOffShelfActionConfig(params: getDialogConfigParams): CnPage.DialogProps {
  const {} = params
  return {
    title: '下架',
    formProps: {
      model: {},
      labelPosition: 'left',
      items: [
        {
          label: '',
          prop: 'offShelf',
          component: 'slot'
        }
      ],
      labelWidth: 0
    }
  }
}

// 公告详情
export function getEditOrEditActionConfig(params: getDialogConfigParams): CnPage.DialogProps {
  const { model } = params
  return {
    title: '查看详情',
    formProps: {
      model: model ?? {},
      labelPosition: 'left',
      items: [
        {
          label: '公告标题',
          prop: 'noticeName'
        },
        {
          label: '来源',
          prop: 'noticeSource'
        },
        {
          label: '类型',
          prop: 'noticeTyle',
          dict: 'NOTICE_TYPE'
        },
        {
          label: '发布区域',
          prop: 'pushAreaName'
        },
        {
          label: '设备类型',
          prop: 'deviceType',
          dict: 'DEV_TYPE'
        },
        {
          label: '信息展示期',
          prop: 'date'
        },
        {
          label: '状态',
          prop: 'noticeStatus',
          component: 'slot'
        },
        {
          label: '公告内容',
          prop: 'content',
          component: 'slot'
        },
        {
          label: '发布人',
          prop: 'createUser'
        },
        {
          label: '发布时间',
          prop: 'pushDate'
        }
      ],
      colSpan: 24,
      labelWidth: 120
    }
  }
}
