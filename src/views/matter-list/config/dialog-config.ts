import type { handleType } from './type'

export default function getDialogConfig(
  handleType: handleType,
  submitCb: () => void
): CnPage.DialogProps {
  if (handleType === 'label') {
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
      onSubmit: () => {
        submitCb()
      }
    }
  } else if (handleType === 'export') {
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
      onSubmit: () => {}
    }
  } else {
    return {
      title: '新增单位类型',
      formProps: {
        model: { strategy: ['0'] },
        items: [
          { label: '单位类型', prop: 'type', component: 'input' },
          {
            label: '数据权限策略',
            prop: 'strategy',
            component: 'checkbox',
            props: { options: [{ label: '本单位', value: '0' }] }
          }
        ],
        labelWidth: 120,
        rules: {
          type: [{ required: true, message: '请输入单位类型' }],
          strategy: [{ required: true, message: '请选择数据权限策略' }]
        }
      },
      onSubmit: () => {}
    }
  }
}
