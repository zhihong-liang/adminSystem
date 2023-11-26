import type { handleType } from './type'

export default function getDialogConfig(
  handleType: handleType,
  submitCb: () => void
): CnPage.DialogProps {
  if (handleType === 'add') {
    return {
      title: '新建标签',
      formProps: {
        model: {},
        labelPosition: 'left',
        requireAsteriskPosition: 'right',
        items: [
          { label: '标签名称', prop: 'name', component: 'input' },
          { label: '备注', prop: 'remind', component: 'input' },
          { label: '图标', prop: 'avatar', component: 'input' }
        ],
        labelWidth: 120,
        rules: {
          name: [{ required: true, message: '请输入标签名称' }]
        }
      },
      onSubmit: submitCb
    }
  } else if (handleType === 'edit') {
    return {
      title: '编辑标签',
      formProps: {
        model: {},
        items: [
          {
            label: '标签编号',
            prop: 'id'
          },
          {
            label: '标签名称',
            prop: 'labelName',
            component: 'select',
            props: {
              options: [
                { label: '读书', value: 0 },
                { label: '打球', value: 1 }
              ]
            }
          },
          { label: '备注', prop: 'remind', component: 'input' },
          {
            label: '图标',
            prop: 'avatar',
            component: 'input'
          },
          {
            label: '状态',
            prop: 'status',
            component: 'select',
            props: {
              options: [
                { label: '启用', value: 0 },
                { label: '停用', value: 1 }
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
      title: '删除标签',
      formProps: {
        model: {},
        items: [
          {
            label: '',
            prop: 'delete',
            component: 'slot'
          }
        ],
        labelWidth: 0
      },
      onSubmit: submitCb
    }
  }
}
