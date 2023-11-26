const config: CnPage.SearchProps = {
  model: {},
  labelPosition: 'left',
  items: [
    {
      label: '标签编号',
      prop: 'id',
      component: 'input'
    },
    { label: '标签名称', prop: 'name', component: 'input' },

    {
      label: '状态',
      prop: 'status',
      component: 'select',
      props: {
        options: [
          { label: '全部', value: 0 },
          { label: '启用', value: 1 },
          { label: '停用', value: 2 }
        ]
      }
    }
  ],
  colSpan: 6,
  footerSpan: 0,
  labelWidth: 120
}

export default config
