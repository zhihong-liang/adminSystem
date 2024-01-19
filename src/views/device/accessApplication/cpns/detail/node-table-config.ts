const props: CnPage.TableProps = {
  columns: [
    { label: '流程节点', prop: 'auditStep', align: 'center', dict: 'DEV_APPLY_AUDIT_STATUS' },
    { label: '处理单位', prop: 'devUnit', slot: 'devUnit', align: 'center' },
    { label: '处理人', prop: 'handleUserText', align: 'center' },
    { label: '处理说明', prop: 'handleOpinion', align: 'center' },
    { label: '处理时间', prop: 'hanlleTime', align: 'center' }
  ],
  border: true,
  data: []
}

export default props
