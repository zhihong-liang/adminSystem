const config: CnPage.SearchProps = {
  model: {},
  labelPosition: 'left',
  items: [
    { label: '公告标题', prop: 'itemId', component: 'input' },
    { label: '类型', prop: 'sex1', component: 'input' },
    {
      label: '发布状态',
      prop: 'status',
      component: 'select',
      props: {
        options: [
          { label: '已婚', value: 0 },
          { label: '未婚', value: 1 },
          { label: '离异', value: 2 },
          { label: '丧偶', value: 3 }
        ]
      }
    }
  ],
  colSpan: 8,
  footerSpan: 0,
  labelWidth: 120
}

export default config
