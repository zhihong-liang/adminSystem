const props: CnPage.TableProps = {
  columns: [
    { label: '设备接入单位设备编号', prop: 'unitDevCode' },
    { label: '设备接入单位', prop: 'devUnit', slot: 'devUnit' },
    { label: '设备类型', prop: 'devType', dict: 'DEV_TYPE' },
    { label: '部署场所', prop: 'siteName' },
    { label: '行政区划', prop: 'regionDetail' },
    { label: '详细地址', prop: 'detailAddress' }
  ],
  data: []
}

export default props
