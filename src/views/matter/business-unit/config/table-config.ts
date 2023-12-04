import type { handleType } from './type'

export default function getTableConfig(
  tableClickCb: (handleType: handleType, params: any) => void
): CnPage.TableProps {
  return {
    data: [],

    columns: [
      { type: 'selection' },
      { label: '业务部门', prop: 'businessName' },
      { label: '备注', prop: 'remake' },
      { label: '事项数', prop: 'matterCount' },
      { label: '创建时间', prop: 'createDate' },
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
