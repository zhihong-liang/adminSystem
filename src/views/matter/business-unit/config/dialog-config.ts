import type { handleType } from './type'

export default function getDialogConfig(
  handleType: handleType,
  submitCb: () => void
): CnPage.DialogProps {
  if (handleType === 'add') {
    return {
      title: '新建业务部门',
      formProps: {
        model: { status: '1' },
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
      onSuccess: submitCb
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
      onSuccess: submitCb
    }
  } else if (handleType === 'delete') {
    return {
      title: '删除业务部门',
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
      onSuccess: submitCb
    }
  } else {
    return {
      title: '事项标签详情',
      formProps: {
        model: {},
        labelPosition: 'left',
        items: [
          { label: '标签名称', prop: 'name', component: 'input' },
          { label: '备注', prop: 'remind', component: 'input' },
          { label: '图标', prop: 'avatar', component: 'input' }
        ],
        readonly: true,
        colSpan: 12,
        labelWidth: 120
      },
      onSuccess: submitCb
    }
  }
}
