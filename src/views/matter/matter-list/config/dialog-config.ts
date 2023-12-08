import type { ActionType, visibleMap, tabsActivateName } from './type'

export function getDialogConfig(actionType: ActionType) {
  if (actionType === 'label') {
    return getLabelActionDialogConfig
  } else if (actionType === 'add') {
    return getAddActionDialogConfig
  } else {
    return getEditActionDialogConfig
  }
}

export function getLabelActionDialogConfig(
  dialogSubmitSuccess: () => void,
  activeName?: tabsActivateName,
  model?: Record<string, any>,
  visible?: visibleMap
): CnPage.DialogProps {
  return {
    title: '所属标签',
    formProps: {
      model: {},
      labelPosition: 'left',
      requireAsteriskPosition: 'right',
      items: [
        { label: '事项名称', prop: 'name' },
        { label: '事项标签', prop: 'label', component: 'input' }
      ],
      labelWidth: 120,
      rules: {
        label: [{ required: true, message: '请选择事项标签' }]
      }
    },
    onSuccess: dialogSubmitSuccess
  }
}

// 新建事项
export function getAddActionDialogConfig(
  dialogSubmitSuccess: () => void,
  activeName?: tabsActivateName,
  model?: Record<string, any>,
  visible?: visibleMap
): CnPage.DialogProps {
  return {
    title: '新建',
    formProps: {
      model: { matterStatus: '1' },
      labelPosition: 'right',
      requireAsteriskPosition: 'right',
      items: [
        { label: '基本信息', component: 'subtitle', span: 24 },
        { label: '事项名称', prop: 'matterName', component: 'input' },
        {
          label: '事项别名',
          prop: 'matterAlias',
          component: 'input'
        },
        { label: '搜索关键词', prop: 'searchKeywords', component: 'input' },
        {
          label: '事项进驻单位',
          prop: 'entryUnit',
          component: 'input'
        },
        {
          label: '业务部门',
          prop: 'businessUnit',
          component: 'input'
        },
        {
          label: '业务系统名称',
          prop: 'businessSystemName',
          component: 'input'
        },
        {
          label: '系统覆盖范围',
          prop: 'sysCoverage',
          component: 'select',
          dict: 'SYS_COVERAGE'
        },
        {
          label: '系统层级',
          prop: 'sysLevel',
          component: 'select',
          dict: 'SYS_LEVEL'
        },
        {
          label: '事项类型',
          prop: 'matterType',
          component: 'select',
          dict: 'MATTER_TYPE'
        },
        {
          label: '办理类型',
          prop: 'handleType',
          component: 'select',
          dict: 'HANDLE_TYPE'
        },
        {
          label: '服务对象',
          prop: 'serviceObject',
          component: 'select',
          dict: 'SERVICE_OBJECT'
        },
        { label: '配置信息', component: 'subtitle', span: 24 },
        { label: '中文编码', prop: 'cnCode', component: 'input' },
        { label: '访问路径', prop: 'accessPath', component: 'input' },

        {
          label: '身份认证方式',
          prop: 'identityAuthType',
          component: 'radio',
          dict: 'IDENTITY_AUTH_TYPE'
        },
        {
          label: '',
          prop: 'identityAuthItem',
          component: 'checkbox',
          // visible: visibleMap?.['identityAuthItem'] || undefined,
          dict: 'IDENTITY_AUTH_ITEM'
        },
        {
          label: '涉及支付方式',
          prop: 'payStatus',
          component: 'radio',
          dict: 'PAY_STATUS'
        },
        {
          label: '',
          prop: 'payWay',
          component: 'checkbox',
          // visible: visibleMap?.['payWay'] || undefined,
          dict: 'PAY_WAY'
        },
        {
          label: '硬件模块',
          prop: 'hardwareModule',
          component: 'checkbox',
          dict: 'HARDWARE_MODULE'
        },
        {
          label: '网络策略',
          prop: 'networdPolicy',
          component: 'checkbox',
          dict: 'NETWORD_POLICY'
        }
      ],
      labelWidth: 120,
      colSpan: 18,
      rules: {
        matterName: [{ required: true, message: '请输入事项名称' }],
        entryUnit: [{ required: true, message: '请输入事项进驻单位' }],
        businessUnit: [{ required: true, message: '请输入业务部门' }],
        businessSystemName: [{ required: true, message: '请输入业务系统名称' }],
        matterType: [{ required: true, message: '请选择事项类型' }],
        handleType: [{ required: true, message: '请选择办理类型' }],
        serviceObject: [{ required: true, message: '请选择服务对象' }],
        sysCoverage: [{ required: true, message: '请选择系统覆盖范围' }],
        sysLevel: [{ required: true, message: '请选择系统层级' }],
        identityAuthType: [{ required: true, message: '请选择身份认证方式' }],
        identityAuthItem: [{ required: true, message: '请选择认证方式' }],
        payStatus: [{ required: true, message: '请选择是否涉及支付方式' }],
        payWay: [{ required: true, message: '请选择支付方式' }],
        hardwareModule: [{ required: true, message: '请选择硬件模块' }],
        networdPolicy: [{ required: true, message: '请选择网络策略' }]
      }
    },
    onSuccess: dialogSubmitSuccess
  }
}

// 编辑事项
export function getEditActionDialogConfig(
  dialogSubmitSuccess?: () => void,
  activeName?: tabsActivateName,
  model?: Record<string, any>,
  visible?: visibleMap
): CnPage.DialogProps {
  const basicInfoItems: CnPage.FormItem[] = [
    { label: '', component: 'slot', prop: 'tabs', labelWidth: '0px', span: 24 },
    { label: '事项名称', prop: 'matterName', component: 'input' },
    { label: '状态', prop: 'matterName', component: 'input' },
    {
      label: '事项别名',
      prop: 'matterAlias',
      component: 'input'
    },
    {
      label: '粤智助事项编码',
      prop: 'matterAlias',
      component: 'input'
    },
    {
      label: '办理类型',
      prop: 'handleType',
      component: 'select',
      dict: 'HANDLE_TYPE'
    },
    {
      label: '事项类型',
      prop: 'matterType',
      component: 'select',
      dict: 'MATTER_TYPE'
    },
    {
      label: '服务对象',
      prop: 'serviceObject',
      component: 'select',
      dict: 'SERVICE_OBJECT'
    },
    {
      label: '网络策略',
      prop: 'networdPolicy',
      component: 'checkbox',
      dict: 'NETWORD_POLICY'
    },
    {
      label: '业务部门',
      prop: 'businessUnit',
      component: 'input'
    },
    {
      label: '事项进驻单位',
      prop: 'entryUnit',
      component: 'input'
    },
    {
      label: '系统层级',
      prop: 'sysLevel',
      component: 'select',
      dict: 'SYS_LEVEL'
    },
    {
      label: '业务系统名称',
      prop: 'businessSystemName',
      component: 'input'
    },

    {
      label: '系统覆盖范围',
      prop: 'sysCoverage',
      component: 'select',
      dict: 'SYS_COVERAGE'
    }
  ]

  const configInfoItems: CnPage.FormItem[] = [
    { label: '', component: 'slot', prop: 'tabs', labelWidth: '0px', span: 24 },
    { label: '搜索关键词', prop: 'searchKeywords', component: 'input', span: 24 },
    {
      label: '身份认证方式',
      prop: 'identityAuthItem',
      component: 'checkbox',
      dict: 'IDENTITY_AUTH_ITEM',
      span: 24
    },
    {
      label: '涉及支付方式',
      prop: 'payWay',
      component: 'checkbox',
      dict: 'PAY_WAY',
      span: 24
    },
    {
      label: '硬件模块',
      prop: 'hardwareModule',
      component: 'checkbox',
      dict: 'HARDWARE_MODULE',
      span: 24
    }
  ]
  return {
    title: '事项详情',
    formProps: {
      model: model ?? {},
      labelPosition: 'left',
      requireAsteriskPosition: 'right',
      items: [...(activeName === 'basicInfo' ? basicInfoItems : configInfoItems)],
      labelWidth: 120,
      colSpan: 12
    }
  }
}
