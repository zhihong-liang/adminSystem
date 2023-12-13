import type { ActionType } from './type'

export default function getTableConfig(
  tableClickCb: (handleType: ActionType, params: any) => void,
  selectionChange?: (selection: any) => void
): CnPage.TableProps {
  return {
    data: [],
    selectionChange,
    columns: [
      { type: 'selection' },
      { label: '业务部门', prop: 'businessDeptName', slot: 'businessDeptName' },
      { label: '备注', prop: 'remark' },
      { label: '事项数', prop: 'mattersCount' },
      { label: '创建时间', prop: 'createTime' },
      {
        label: '操作',
        prop: 'action',
        align: 'center',
        buttons: [
          {
            label: '编辑',
            type: 'text',
            onClick: (params: any) => {
              tableClickCb('edit', params.row)
            }
          },
          {
            label: '删除',
            type: 'text',
            onClick: (params: any) => {
              tableClickCb('delete', params.row)
            }
          }
        ]
      }
    ]
  }
}
