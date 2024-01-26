export default function getSearchConfig(unitOptions: any): CnPage.SearchProps {
  return {
    model: {},
    labelPosition: 'left',
    items: [
      { label: '申请编号', prop: 'id', component: 'input' },
      {
        label: '设备接入单位',
        prop: 'devAccessUnit',
        component: 'select',
        props: {
          options: unitOptions,
          filterable: 'filterable'
        }
      },
      { label: '状态', prop: 'auditStatus', component: 'select', dict: 'DEV_APPLY_AUDIT_STATUS' }
    ],
    colSpan: 6,
    footerSpan: 0,
    labelWidth: 120
  }
}
