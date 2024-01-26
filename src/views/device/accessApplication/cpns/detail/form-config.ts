export default function getSearchConfig(model: any): CnPage.FormProps {
  return {
    model: model,
    labelPosition: 'right',
    items: [
      { label: '', prop: 'basicInfo', component: 'slot', labelWidth: 0.1 },
      { label: '申请编号', prop: 'id' },
      { label: '设备接入单位', prop: 'devAccessUnit' },
      { label: '接入类型', prop: '' },
      { label: '批次号', prop: 'batchNo' },
      { label: '申请事由', prop: '' },
      { label: '申请人', prop: 'applyPerson' },
      { label: '联系方式', prop: '' },
      { label: '申请时间', prop: 'applyTime' },
      { label: '', prop: 'deviceInfo', component: 'slot', labelWidth: 0.1, span: 24 }
    ],
    rules: {},
    colSpan: 24,
    footerSpan: 0,
    labelWidth: 130
  }
}
