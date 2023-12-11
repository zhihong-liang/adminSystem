import type { ActionType } from './type'

export default function getTableConfig(
  tableClickCb: (handleType: ActionType, params: any) => void
): CnPage.TableProps {
  return {
    data: [],
    columns: [
      // { type: 'selection' },
      { label: '标签名称', prop: 'lableName', slot: 'lableName' },
      { label: '使用事项数', prop: 'mattersCount' },
      { label: '创建时间', prop: 'createTime' },
      {
        label: '操作',
        prop: 'action',
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
