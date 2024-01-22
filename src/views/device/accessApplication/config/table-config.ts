export default function getTableConfig(): CnPage.TableProps {
  return {
    data: [],
    defaultSort: { prop: 'applyTime', order: 'descending' },
    columns: [
      { label: '申请编号', prop: 'id', width: '180px' },
      { label: '设备接入单位', prop: 'devAccessUnit', slot: 'devAccessUnit' },
      { label: '批次号', prop: 'batchNo' },
      { label: '设备数', prop: 'devNum' },
      { label: '申请人', prop: 'applyPerson' },
      { label: '申请时间', prop: 'applyTime', sortable: true },
      { label: '状态', prop: 'auditCurrentStep', dict: 'DEV_APPLY_NODE' },
      { label: '审核时间', prop: 'auditEndTime' },
      {
        label: '操作',
        prop: 'action',
        slot: 'action'
      }
    ]
  }
}
