function getTableConfig(
  deleteAction: (action: string, row: any) => void,
  selectionChange?: (selection: any) => void
): CnPage.TableProps {
  return {
    selectionChange,
    columns: [
      { type: 'selection' },
      { label: '设备接入单位设备编号', prop: 'unitDevCode', align: 'center' },
      { label: '设备接入单位', prop: 'devUnit', slot: 'devUnit', align: 'center' },
      { label: '设备类型', prop: 'devType', dict: 'DEV_TYPE', align: 'center' },
      { label: '部署场所', prop: 'siteName', align: 'center' },
      { label: '行政区划', prop: 'regionDetail', align: 'center' },
      { label: '详细地址', prop: 'detailAddress', align: 'center' },
      {
        label: '操作',
        prop: 'action',
        align: 'center',
        buttons: [
          {
            label: '删除',
            type: 'text',
            onClick: (params: any) => {
              deleteAction('delete', params.row)
            }
          }
        ]
      }
    ],
    data: []
  }
}

export default getTableConfig
