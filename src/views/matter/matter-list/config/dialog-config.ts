import type { tollbarActionType, tableActionType, tabsActivateName } from './type'

export function getTollBarActionDialogConfig(
  actionType: tollbarActionType,
  submitCb: () => void,
  payTypeVisible: () => boolean,
  authenticationTypeVisible: () => boolean
): CnPage.DialogProps {
  if (actionType === 'label') {
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
      onSubmit: submitCb
    }
  } else if (actionType === 'export') {
    return {
      title: '导出',
      formProps: {
        model: {},
        items: [
          {
            label: '请选择所需导出的字段',
            prop: 'fileds',
            component: 'checkbox',
            props: {
              options: [
                { label: '读书', value: 0 },
                { label: '打球', value: 1 }
              ]
            }
          }
        ],
        labelWidth: 120,
        rules: {
          type: [{ required: true, message: '请选择所需导出的字段' }]
        }
      },
      onSubmit: submitCb
    }
  } else {
    return {
      title: '新建',
      formProps: {
        model: { strategy: ['0'] },
        labelPosition: 'right',
        items: [
          { label: '基本信息' },
          { label: '事项名称', prop: 'name', component: 'input' },
          {
            label: '事项别名',
            prop: 'rename',
            component: 'input'
          },
          {
            label: '业务部门',
            prop: 'department',
            component: 'select',
            props: {
              options: [{ label: '1', value: '1' }]
            }
          },
          {
            label: '事项进驻单位',
            prop: 'unit',
            component: 'input'
          },
          {
            label: '业务系统名称',
            prop: 'systemName',
            component: 'input'
          },
          {
            label: '系统覆盖范围',
            prop: 'systemRound',
            component: 'cascader',
            props: {
              showAllLevels: false,
              options: [
                { label: '广东', value: '44', children: [{ label: '广州', value: '4401' }] }
              ]
            }
          },
          {
            label: '系统层级',
            prop: 'systemLevel',
            component: 'select',
            props: {
              options: [{ label: '1', value: '1' }]
            }
          },
          {
            label: '事项类型',
            prop: 'matterType',
            component: 'select',
            props: {
              options: [{ label: '1', value: '1' }]
            }
          },
          {
            label: '办理类型',
            prop: 'type',
            component: 'select',
            props: {
              options: [{ label: '1', value: '1' }]
            }
          },
          {
            label: '服务对象',
            prop: 'server',
            component: 'select',
            props: {
              options: [{ label: '1', value: '1' }]
            }
          },
          { label: '配置信息' },
          { label: '中文编码', prop: 'ZHName', component: 'input' },
          { label: '访问路径', prop: 'url', component: 'input' },
          { label: '搜索关键词', prop: 'keyword', component: 'input' },
          {
            label: '身份认证方式',
            prop: 'isAuthenticationType',
            component: 'radio',
            props: {
              options: [
                { label: '需认证', value: '1' },
                { label: '无需认证', value: '0' }
              ]
            }
          },
          {
            label: '',
            prop: 'authenticationType',
            component: 'checkbox',
            props: {
              options: [
                { label: '身份证', value: '1' },
                { label: '电子社保卡', value: '0' }
              ]
            },
            visible: authenticationTypeVisible
          },
          {
            label: '涉及支付方式',
            prop: 'isPay',
            component: 'radio',
            props: {
              options: [
                { label: '否', value: '0' },
                { label: '是', value: '1' }
              ]
            }
          },
          {
            label: '',
            prop: 'payType',
            component: 'checkbox',
            props: {
              options: [
                { label: '微信', value: '1' },
                { label: '支付宝', value: '2' }
              ]
            },
            visible: payTypeVisible
          },
          {
            label: '硬件模块',
            prop: 'hardwareModule',
            component: 'checkbox',
            props: {
              options: [
                { label: '二代身份证阅读器', value: '1' },
                { label: '活体检测摄像头', value: '2' }
              ]
            }
          },
          {
            label: '网络策略',
            prop: 'network',
            component: 'checkbox',
            props: {
              options: [
                { label: '政务外网', value: '1' },
                { label: '互联网', value: '2' }
              ]
            }
          }
        ],
        labelWidth: 120,
        colSpan: 18,
        rules: {
          name: [{ required: true, message: '请输入事项名称' }],
          department: [{ required: true, message: '请选择业务部门' }],
          unit: [{ required: true, message: '请输入事项进驻单位' }],
          systemName: [{ required: true, message: '请输入业务系统名称' }],
          systemRound: [{ required: true, message: '请选择系统覆盖范围' }],
          systemLevel: [{ required: true, message: '请选择系统层级' }],
          matterType: [{ required: true, message: '请选择事项类型' }],
          type: [{ required: true, message: '请选择办理类型' }],
          server: [{ required: true, message: '请选择服务对象' }],
          ZHName: [{ required: true, message: '请输入中文编码' }],
          path: [{ required: true, message: '请输入访问路径' }],
          isAuthenticationType: [{ required: true, message: '请选择身份认证方式' }],
          authenticationType: [{ required: true, message: '请选择身份认证方式' }],
          isPay: [{ required: true, message: '请选择涉及支付方式' }],
          payType: [{ required: true, message: '请选择涉及支付方式' }],
          hardwareModule: [{ required: true, message: '请选择涉及硬件模块' }],
          network: [{ required: true, message: '请选择网络策略' }]
        }
      },
      onSubmit: submitCb
    }
  }
}

export function getTableActionConfig(
  handleType: tableActionType,
  tabsActivateName: tabsActivateName,
  payTypeVisible: () => boolean,
  authenticationTypeVisible: () => boolean
): CnPage.DialogProps {
  const readyOnly = handleType === 'detail'
  if (tabsActivateName === 'basicInfo') {
    return {
      title: '事项详情',
      formProps: {
        model: {},
        labelPosition: 'left',
        requireAsteriskPosition: 'right',
        items: [
          { label: '', component: 'slot', prop: 'tabs', span: 24, labelWidth: '0px' },
          { label: '事项名称', prop: 'name', component: 'input' },
          {
            label: '事项别名',
            prop: 'rename',
            component: 'input'
          },
          {
            label: '业务部门',
            prop: 'department',
            component: 'select',
            props: {
              options: [{ label: '1', value: '1' }]
            }
          },
          {
            label: '事项进驻单位',
            prop: 'unit',
            component: 'input'
          },
          {
            label: '业务系统名称',
            prop: 'systemName',
            component: 'input',
            span: 24
          },
          {
            label: '系统覆盖范围',
            prop: 'systemRound',
            component: 'cascader',
            props: {
              showAllLevels: false,
              options: [
                { label: '广东', value: '44', children: [{ label: '广州', value: '4401' }] }
              ]
            }
          },
          {
            label: '系统层级',
            prop: 'systemLevel',
            component: 'select',
            props: {
              options: [{ label: '1', value: '1' }]
            }
          },
          {
            label: '事项类型',
            prop: 'matterType',
            component: 'select',
            props: {
              options: [{ label: '1', value: '1' }]
            }
          },
          {
            label: '办理类型',
            prop: 'type',
            component: 'select',
            props: {
              options: [{ label: '1', value: '1' }]
            }
          },
          {
            label: '服务对象',
            prop: 'server',
            component: 'select',
            props: {
              options: [{ label: '1', value: '1' }]
            }
          }
        ],
        readonly: readyOnly,
        labelWidth: 120,
        colSpan: 12,
        rules: {
          label: [{ required: true, message: '请选择事项标签' }]
        }
      },
      onSubmit: () => {}
    }
  } else {
    return {
      title: '事项详情',
      formProps: {
        model: {},
        labelPosition: 'left',
        requireAsteriskPosition: 'right',
        items: [
          { label: '', component: 'slot', prop: 'tabs', span: 24, labelWidth: '0px' },
          { label: '中文编码', prop: 'ZHName', component: 'input' },
          { label: '访问路径', prop: 'url', component: 'input' },
          { label: '搜索关键词', prop: 'keyword', component: 'input' },
          {
            label: '身份认证方式',
            prop: 'isAuthenticationType',
            component: 'radio',
            props: {
              options: [
                { label: '需认证', value: '1' },
                { label: '无需认证', value: '0' }
              ]
            }
          },
          {
            label: '',
            prop: 'authenticationType',
            component: 'checkbox',
            props: {
              options: [
                { label: '身份证', value: '1' },
                { label: '电子社保卡', value: '0' }
              ]
            },
            visible: authenticationTypeVisible
          },
          {
            label: '涉及支付方式',
            prop: 'isPay',
            component: 'radio',
            props: {
              options: [
                { label: '否', value: '0' },
                { label: '是', value: '1' }
              ]
            }
          },
          {
            label: '',
            prop: 'payType',
            component: 'checkbox',
            props: {
              options: [
                { label: '微信', value: '1' },
                { label: '支付宝', value: '2' }
              ]
            },
            visible: payTypeVisible
          },
          {
            label: '硬件模块',
            prop: 'hardwareModule',
            component: 'checkbox',
            props: {
              options: [
                { label: '二代身份证阅读器', value: '1' },
                { label: '活体检测摄像头', value: '2' }
              ]
            }
          },
          {
            label: '网络策略',
            prop: 'network',
            component: 'checkbox',
            props: {
              options: [
                { label: '政务外网', value: '1' },
                { label: '互联网', value: '2' }
              ]
            }
          }
        ],
        labelWidth: 120,
        colSpan: 12,
        readonly: readyOnly,
        rules: {
          label: [{ required: true, message: '请选择事项标签' }]
        }
      },
      onSubmit: () => {}
    }
  }
}
