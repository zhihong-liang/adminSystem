import type { ActionType, getDialogConfigParams } from './type'

export function getDialogConfig(actionType: ActionType) {
  if (actionType === 'label') {
    return getLabelActionDialogConfig
  } else if (actionType === 'add') {
    return getAddActionDialogConfig
  } else if (actionType === 'edit') {
    return getEditActionDialogConfig
  } else {
    return getDetailActionDialogConfig
  }
}

// 事项标签
export function getLabelActionDialogConfig(params: getDialogConfigParams): CnPage.DialogProps {
  const { dialogSubmitSuccess, model, optionsMap } = params
  return {
    title: '所属标签',
    formProps: {
      model: model ?? {},
      labelPosition: 'left',
      requireAsteriskPosition: 'right',
      items: [
        {
          label: '事项名称',
          prop: 'matterName'
        },
        {
          label: '事项标签',
          prop: 'label',
          component: 'select',
          props: {
            options: optionsMap!.label
          }
        }
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
  params: getDialogConfigParams,
  entryUnitValidator?: (rule: any, value: any, callback: any) => void,
  hardwareModuleValidator?: (rule: any, value: any, callback: any) => void,
  networdPolicyValidator?: (rule: any, value: any, callback: any) => void
): CnPage.DialogProps {
  const { dialogSubmitSuccess, optionsMap, visible, onClose } = params
  return {
    title: '新建',
    formProps: {
      model: { matterStatus: '1' },
      labelPosition: 'right',
      requireAsteriskPosition: 'right',
      items: [
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
          component: 'slot'
        },
        {
          label: '业务部门',
          prop: 'businessUnit',
          component: 'select',
          props: {
            options: optionsMap!.businessUnit
          }
        },
        {
          label: '业务系统名称',
          prop: 'businessSystemName',
          component: 'input'
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
        {
          label: '系统覆盖范围',
          prop: 'sysCoverage',
          component: 'cascader',
          props: {
            options: optionsMap!.sysCoverage,
            'collapse-tags': 'collapse-tags',
            'collapse-tags-tooltip': 'collapse-tags-tooltip',
            'max-collapse-tags': '3',
            props: {
              checkStrictly: false,
              multiple: true,
              emitPath: false,
              label: 'label',
              value: 'value',
              children: 'childen'
            }
          }
        },
        {
          label: '系统层级',
          prop: 'sysLevel',
          component: 'select',
          dict: 'SYS_LEVEL'
        },
        {
          label: '身份认证方式',
          prop: 'identityAuthType',
          component: 'radio',
          dict: 'IDENTITY_AUTH_TYPE'
        },
        {
          label: '',
          prop: 'checkAllIdentityAuthItem',
          visible: visible?.['identityAuthItem'],
          component: 'slot'
        },
        {
          label: '',
          prop: 'identityAuthItem',
          component: 'checkbox',
          visible: visible?.['identityAuthItem'],
          props: {
            options: optionsMap!.identityAuthItem
          }
        },
        {
          label: '涉及支付方式',
          prop: 'payStatus',
          component: 'radio',
          dict: 'PAY_STATUS'
        },
        {
          label: '',
          prop: 'checkAllPayWay',
          visible: visible?.['payWay'],
          component: 'slot'
        },
        {
          label: '',
          prop: 'payWay',
          component: 'checkbox',
          visible: visible?.['payWay'],
          props: {
            options: optionsMap!.payWay
          }
        },
        {
          label: '硬件模块',
          prop: 'checkAllHardwareModule',
          component: 'slot'
        },
        {
          label: '',
          prop: 'hardwareModule',
          component: 'checkbox',
          dict: 'HARDWARE_MODULE'
        },
        {
          label: '网络策略',
          prop: 'checkAllNetwordPolicy',
          component: 'slot'
        },
        {
          label: '',
          prop: 'networdPolicy',
          component: 'checkbox',
          dict: 'NETWORD_POLICY'
        }
      ],
      labelWidth: 120,
      colSpan: 18,
      rules: {
        matterName: [{ required: true, message: '请输入事项名称' }],
        entryUnit: [
          { required: true, message: '请输入事项进驻单位' },
          {
            validator: entryUnitValidator,
            trigger: 'blur'
          }
        ],
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
        networdPolicy: [{ required: true, message: '请选择网络策略' }],
        checkAllHardwareModule: [
          { required: true, validator: hardwareModuleValidator, trigger: 'submit' }
        ],
        checkAllNetwordPolicy: [
          { required: true, validator: networdPolicyValidator, trigger: 'submit' }
        ]
      }
    },
    onSuccess: dialogSubmitSuccess,
    onClose
  }
}

// 编辑事项
export function getEditActionDialogConfig(
  params: getDialogConfigParams,
  entryUnitValidator?: (rule: any, value: any, callback: any) => void
): CnPage.DialogProps {
  const { dialogSubmitSuccess, activeName, optionsMap, model, visible, onClose } = params
  const basicInfoItems: CnPage.FormItem[] = [
    { label: '', component: 'slot', prop: 'tabs', labelWidth: '0px', span: 24 },
    {
      label: '事项名称',
      prop: 'matterName',
      component: 'input'
    },
    {
      label: '状态',
      prop: 'matterStatus',
      dict: 'MATTER_STATUS'
    },
    {
      label: '事项别名',
      prop: 'matterAlias',
      component: 'input'
    },
    {
      label: '事项编号',
      prop: 'matterCode'
    },
    {
      label: '业务部门',
      prop: 'businessUnit',
      component: 'select',
      props: {
        options: optionsMap!.businessUnit
      }
    },
    {
      label: '事项进驻单位',
      prop: 'entryUnit',
      component: 'slot'
    },
    {
      label: '业务系统名称',
      prop: 'businessSystemName',
      component: 'input',
      span: 24
    },
    {
      label: '系统覆盖范围',
      prop: 'sysCoverage',
      component: 'cascader',
      props: {
        'collapse-tags': 'collapse-tags',
        'collapse-tags-tooltip': 'collapse-tags-tooltip',
        'max-collapse-tags': '3',
        options: optionsMap!.sysCoverage,
        props: {
          checkStrictly: false,
          multiple: true,
          emitPath: false,
          label: 'label',
          value: 'value',
          children: 'childen'
        }
      }
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
    }
  ]

  const configInfoItems: CnPage.FormItem[] = [
    { label: '', component: 'slot', prop: 'tabs', labelWidth: '0px', span: 24 },
    { label: '中文编码', prop: 'cnCode', component: 'input', span: 12 },
    { label: '访问路径', prop: 'accessPath', component: 'input', span: 12 },
    { label: '搜索关键词', prop: 'searchKeywords', component: 'input', span: 24 },
    {
      label: '标签',
      prop: 'lableId',
      component: 'select',
      span: 24,
      props: {
        options: optionsMap!.label
      }
    },
    {
      label: '身份认证方式',
      prop: 'checkAllIdentityAuthItem',
      visible: visible?.['identityAuthItem'],
      component: 'slot',
      span: 24
    },
    {
      label: '',
      prop: 'identityAuthItem',
      component: 'checkbox',
      visible: visible?.['identityAuthItem'],
      props: {
        options: optionsMap!.identityAuthItem
      },
      span: 24
    },
    {
      label: '涉及支付方式',
      prop: 'checkAllPayWay',
      component: 'slot',
      span: 24
    },
    {
      label: '',
      prop: 'payWay',
      component: 'checkbox',
      props: {
        options: optionsMap!.payWay
      },
      span: 24
    },

    {
      label: '硬件模块',
      prop: 'checkAllHardwareModule',
      component: 'slot',
      span: 24
    },
    {
      label: '',
      prop: 'hardwareModule',
      component: 'checkbox',
      props: {
        options: optionsMap!.hardwareModuleOptions
      },
      span: 24
    },
    {
      label: '网络策略',
      prop: 'checkAllNetwordPolicy',
      component: 'slot',
      span: 24
    },
    {
      label: '',
      prop: 'networdPolicy',
      component: 'checkbox',
      props: {
        options: optionsMap!.networdPolicyOptions
      },
      span: 24
    }
  ]
  return {
    title: '事项详情',
    formProps: {
      labelSuffix: '：',
      model: model ?? {},
      labelPosition: 'left',
      requireAsteriskPosition: 'left',
      items: [...(activeName === 'basicInfo' ? basicInfoItems : configInfoItems)],
      labelWidth: 140,
      colSpan: 12,
      rules: {
        matterName: [{ required: true, message: '请输入事项名称' }],
        entryUnit: [
          { required: true, message: '请输入事项进驻单位' },
          {
            validator: entryUnitValidator,
            trigger: 'blur'
          }
        ],
        businessUnit: [{ required: true, message: '请输入业务部门' }],
        businessSystemName: [{ required: true, message: '请输入业务系统名称' }],
        matterType: [{ required: true, message: '请选择事项类型' }],
        handleType: [{ required: true, message: '请选择办理类型' }],
        serviceObject: [{ required: true, message: '请选择服务对象' }],
        sysCoverage: [{ required: true, message: '请选择系统覆盖范围' }],
        sysLevel: [{ required: true, message: '请选择系统层级' }],
        hardwareModule: [{ required: true, message: '请选择硬件模块' }],
        networdPolicy: [{ required: true, message: '请选择网络策略' }]
      }
    },
    onSuccess: dialogSubmitSuccess,
    onClose
  }
}

// 事项详情
export function getDetailActionDialogConfig(params: getDialogConfigParams): CnPage.DialogProps {
  const { activeName, model, visible, onClose } = params
  const basicInfoItems: CnPage.FormItem[] = [
    { label: '', component: 'slot', prop: 'tabs', labelWidth: '0px', span: 24 },
    { label: '事项名称', prop: 'matterName' },
    { label: '状态', prop: 'matterStatus', dict: 'MATTER_STATUS' },
    {
      label: '事项别名',
      prop: 'matterAlias'
    },
    {
      label: '事项编号',
      prop: 'matterCode'
    },
    {
      label: '业务部门',
      prop: 'businessUnit'
    },
    {
      label: '事项进驻单位',
      prop: 'entryUnit'
    },
    {
      label: '业务系统名称',
      prop: 'businessSystemName',
      span: 24
    },

    {
      label: '系统覆盖范围',
      prop: 'sysCoverage'
    },
    {
      label: '系统层级',
      prop: 'sysLevel'
    },
    {
      label: '事项类型',
      prop: 'matterType',
      dict: 'MATTER_TYPE'
    },
    {
      label: '办理类型',
      prop: 'handleType'
    },

    {
      label: '服务对象',
      prop: 'serviceObject'
    }
  ]

  const configInfoItems: CnPage.FormItem[] = [
    { label: '', component: 'slot', prop: 'tabs', labelWidth: '0px', span: 24 },
    { label: '中文编码', prop: 'cnCode', span: 12 },
    { label: '访问路径', prop: 'accessPath', span: 12 },
    { label: '搜索关键词', prop: 'searchKeywords', span: 24 },
    {
      label: '标签',
      prop: 'lableName',
      span: 24
    },
    {
      label: '身份认证方式',
      prop: 'identityAuthItem',
      span: 24
    },
    {
      label: '涉及支付方式',
      prop: 'payWay',
      span: 24
    },
    {
      label: '硬件模块',
      prop: 'hardwareModule',
      span: 24
    },
    {
      label: '网络策略',
      prop: 'networdPolicy'
    }
  ]
  return {
    title: '事项详情',

    formProps: {
      labelSuffix: '：',
      readonly: true,
      model: model ?? {},
      labelPosition: 'left',
      requireAsteriskPosition: 'right',
      items: [...(activeName === 'basicInfo' ? basicInfoItems : configInfoItems)],
      labelWidth: 120,
      colSpan: 12
    },
    onClose
  }
}
