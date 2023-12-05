import type CnPage from '@/components/cn-page/cn-page'
import type { dialogActionType } from './type'

export function getTollBarActionDialogConfig(
  actionType: dialogActionType,
  submitCb: () => void,
  model?: Record<string, any>
): CnPage.DialogProps {
  console.log(actionType)
  if (actionType === 'delete') {
    return {
      title: '删除',
      formProps: {
        model: {},
        items: [
          {
            prop: 'delete',
            component: 'slot'
          }
        ],
        labelWidth: 120
      },
      onSubmit: submitCb
    }
  } else if (actionType === 'offShelf') {
    return {
      title: '下架',
      formProps: {
        model: {},
        items: [
          {
            prop: 'offShelf',
            component: 'slot'
          }
        ],
        labelWidth: 120
      },
      onSubmit: submitCb
    }
  } else {
    const readonly = actionType === 'detail'
    let title
    if (actionType === 'add') title = '新建'
    if (actionType === 'detail') title = '查看详情'
    if (actionType === 'edit') title = '编辑'
    return {
      title,
      formProps: {
        model: model ?? {},
        labelPosition: 'right',
        items: [
          { label: '公告标题', prop: 'title', component: 'input' },
          {
            label: '来源',
            prop: 'from',
            component: 'input'
          },
          {
            label: '类型',
            prop: 'type',
            component: 'select',
            props: {
              options: [{ label: '1', value: '1' }]
            }
          },
          {
            label: '发布区域',
            prop: 'area',
            component: 'select',
            props: {
              options: [{ label: '1', value: '1' }]
            }
          },
          {
            label: '设备类型',
            prop: 'systemName',
            component: 'checkbox',
            props: {
              options: [{ label: '1', value: '1' }]
            }
          },
          {
            label: '信息展示期',
            prop: 'date',
            component: 'datepicker',
            props: {}
          },
          {
            label: '公告内容',
            prop: 'content',
            component: 'input',
            props: {
              type: 'textarea'
            }
          }
        ],
        labelWidth: 120,
        colSpan: 18,
        readonly,
        rules: {
          name: [{ required: true, message: '请输入事项名称' }],
          department: [{ required: true, message: '请选择业务部门' }],
          unit: [{ required: true, message: '请输入事项进驻单位' }],
          systemName: [{ required: true, message: '请输入业务系统名称' }],
          systemRound: [{ required: true, message: '请选择系统覆盖范围' }],
          systemLevel: [{ required: true, message: '请选择系统层级' }],
          matterType: [{ required: true, message: '请选择事项类型' }]
        }
      },
      onSubmit: submitCb
    }
  }
}
