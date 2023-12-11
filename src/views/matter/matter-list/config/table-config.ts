import type { ActionType } from './type'
export default function getTableConfig(
  editClickCb: (params: any, handle: ActionType) => void
): CnPage.TableProps {
  return {
    data: [],
    columns: [
      { type: 'selection' },
      { label: '粤智助事项编码', slot: 'matterCode' },
      { label: '事项别名', prop: 'matterAlias' },
      { label: '事项名称', prop: 'matterName' },
      { label: '业务部门', prop: 'businessUnit' },
      { label: '系统覆盖范围', prop: 'sysCoverage' },
      { label: '办理类型', prop: 'handleType', dict: 'HANDLE_TYPE' },
      { label: '事项状态', prop: 'matterStatus', slot: 'matterStatus' },
      {
        label: '操作',
        prop: 'action',
        align: 'center',
        buttons: [
          {
            label: '编辑',
            type: 'text',
            onClick: (params: any) => {
              editClickCb('edit', params.row)
            }
          }
        ]
      }
    ]
  }
}
