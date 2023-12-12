const config: CnPage.SearchProps = {
  model: {},
  labelPosition: 'left',
  items: [
    { label: '公告标题', prop: 'noticeName', component: 'input' },
    { label: '类型', prop: 'noticeTyle', component: 'select', dict: 'NOTICE_TYPE' },
    {
      label: '发布状态',
      prop: 'noticeStatus',
      component: 'select',
      dict: 'NOTICE_STATUS'
    }
  ],
  colSpan: 8,
  footerSpan: 0,
  labelWidth: 120
}

export default config
