export default function getSearchConfig(
  onSearchCb: (data: any) => void,
  onResetCb: () => void
): CnPage.SearchProps {
  return {
    model: {},
    labelPosition: 'left',
    items: [
      { label: '设备接入单位设备编号', prop: 'unitDevCode', component: 'input', labelWidth: 200 },
      { label: '部署场所', prop: 'siteName', component: 'input' },
      {
        label: '行政区划',
        prop: 'provinceCode',
        component: 'ad',
        props: { props: { checkStrictly: true } }
      },
      {
        label: '设备类型',
        prop: 'devType',
        component: 'select',
        dict: 'DEV_TYPE'
      }
    ],
    onReset: onResetCb,
    onSearch: (data) => onSearchCb(data),
    colSpan: 6,
    footerSpan: 0,
    labelWidth: 120
  }
}
