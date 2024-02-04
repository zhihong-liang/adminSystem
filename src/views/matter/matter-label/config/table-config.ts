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
      { label: '标签名称', prop: 'lableName', slot: 'lableName' },
      { label: '使用事项数', prop: 'mattersCount' },
      { label: '状态', prop: 'status', dict: 'MATTER_LABEL_STATUS' },
      { label: '创建时间', prop: 'createTime' },
      {
        label: '操作',
        prop: 'action',
        slot: 'action'
      }
    ]
  }
}
