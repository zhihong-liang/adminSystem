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
      { label: '事项编号', prop: 'matterCode', slot: 'matterCode' },
      { label: '事项名称', prop: 'matterName' },
      { label: '系统覆盖范围', prop: 'sysCoverage' },
      { label: '办理类型', prop: 'handleType', dict: 'HANDLE_TYPE' },
      { label: '办理须知状态', prop: 'status', slot: 'status' },
      { label: '创建时间', prop: 'createTime' },
      {
        label: '操作',
        prop: 'action',
        buttons: [
          {
            label: '编辑',
            type: 'primary',
            onClick: (params: any) => {
              tableClickCb('edit', params.row)
            }
          },
          {
            label: '删除',
            type: 'primary',
            onClick: (params: any) => {
              tableClickCb('delete', params.row)
            }
          }
        ]
      }
    ]
  }
}

export function getMatterListTableConfig() {
  return {
    data: [],
    columns: [
      {
        label: '事项编号',
        prop: 'matterCode',
        slot: 'matterCode',
        width: 240
      },
      {
        label: '事项名称',
        prop: 'matterName'
      },
      { label: '事项别名', prop: 'matterAlias' },
      { label: '事项覆盖范围', prop: 'sysCoverage' },
      { label: '事项状态', prop: 'matterStatus', slot: 'matterStatus' }
    ]
  }
}
