const config: CnPage.SearchProps = {
  model: {},
  labelPosition: 'left',
  items: [
    { label: '粤智助事项编码', prop: 'itemId', component: 'input' },
    { label: '事项名称', prop: 'sex1', component: 'input' },
    {
      label: '事项别名',
      prop: 'sex',
      component: 'input'
    },
    {
      label: '服务对象',
      prop: 'birthday',
      component: 'select',
      props: {
        options: [
          { label: '已婚', value: 0 },
          { label: '未婚', value: 1 },
          { label: '离异', value: 2 },
          { label: '丧偶', value: 3 }
        ]
      }
    },
    {
      label: '系统层级',
      prop: 'marital',
      component: 'select',
      props: {
        options: [
          { label: '已婚', value: 0 },
          { label: '未婚', value: 1 },
          { label: '离异', value: 2 },
          { label: '丧偶', value: 3 }
        ]
      }
    },
    {
      label: '系统覆盖范围',
      prop: 'name2',
      component: 'cascader',
      props: {
        showAllLevels: false,
        options: [{ label: '广东', value: '44', children: [{ label: '广州', value: '4401' }] }]
      }
    },
    {
      label: '业务部门',
      prop: 'address',
      component: 'select',
      props: {
        options: [
          { label: '读书', value: 0 },
          { label: '打球', value: 1 }
        ]
      }
    },
    {
      label: '办理类型',
      prop: 'hobby',
      component: 'select',
      props: {
        options: [
          { label: '读书', value: 0 },
          { label: '打球', value: 1 }
        ]
      }
    },
    {
      label: '事项状态',
      prop: 'hobby',
      component: 'select',
      props: {
        options: [
          { label: '读书', value: 0 },
          { label: '打球', value: 1 }
        ]
      }
    }
  ],
  colSpan: 8,
  footerSpan: 0,
  labelWidth: 120
}

export default config
