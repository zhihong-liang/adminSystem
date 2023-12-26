export default function getTableConfig(
  selectionChange?: (selection: any) => void
): CnPage.TableProps {
  return {
    data: [],
    selectionChange,
    columns: [
      { type: 'selection' },
      { label: '事项编码', slot: 'matterCode' },
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
        slot: 'action'
      }
    ]
  }
}
