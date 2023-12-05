import type { handleType } from './type'

export default function getTableConfig(
  tableClickCb: (handleType: handleType, params: any) => void
): CnPage.TableProps {
  return {
    data: [],
    columns: [
      { type: 'selection' },
      { label: '粤智助事项编码', prop: 'itemId', slot: 'itemId' },
      { label: '事项别名', prop: 'rename' },
      { label: '事项名称', prop: 'name' },
      { label: '业务部门', prop: 'department' },
      { label: '系统覆盖范围', prop: 'round' },
      { label: '办理类型', prop: 'type' },
      { label: '事项状态', prop: 'status', slot: 'status' },
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
