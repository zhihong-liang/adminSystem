const config: CnPage.SearchProps = {
  model: {},
  labelPosition: 'left',
  items: [
    { label: '事项编码', prop: 'matterCode', component: 'input' },
    { label: '事项名称', prop: 'matterName', component: 'input' },
    {
      label: '办理须知状态',
      prop: 'status',
      component: 'select',
      dict: 'MATTERS_HANDLE_NOTICE_STATUS'
    }
  ],
  colSpan: 6,
  footerSpan: 0,
  labelWidth: 120
}

export default config

export const matterListSearchConfig: CnPage.SearchProps = {
  model: {},
  labelPosition: 'left',
  items: [
    { label: '事项编号', prop: 'matterCode', component: 'input' },
    { label: '事项名称', prop: 'matterName', component: 'input' },
    { label: '事项别名', prop: 'matterAlias', component: 'input' }
  ],
  colSpan: 8,
  footerSpan: 0,
  labelWidth: 80
}
