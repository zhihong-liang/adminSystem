export const DEFAILT_ITEM = [
  {
    label: '菜单编号',
    prop: 'menuCode',
    component: '',
    model: ['edit', 'copy']
  },
  {
    label: '菜单等级',
    prop: 'menuLevel',
    component: '',
    dict: 'MATTERS_MENU_LEVEL',
    model: ['edit', 'copy']
  },
  {
    label: '使用主题数',
    prop: 'themeCount',
    component: '',
    model: ['edit', 'copy']
  },
  {
    label: '创建时间',
    prop: 'createTime',
    component: '',
    model: ['edit', 'copy']
  },
  {
    label: '包含事项数',
    prop: 'mattersCount',
    component: '',
    model: ['edit', 'copy']
  },
  {
    label: '创建人',
    prop: 'createUser',
    component: '',
    model: ['edit', 'copy']
  },
  {
    label: '状态',
    prop: 'status',
    component: 'select',
    dict: 'START_STOP',
    model: ['edit', 'copy']
  },
  {
    label: '菜单名称',
    prop: 'menuName',
    component: 'input',
    props: { maxlength: 6, showWordLimit: true },
    model: ['add', 'edit', 'copy']
  },
  { label: '补充说明', prop: 'description', component: 'input', model: ['add', 'edit', 'copy'] },
  {
    label: '备注',
    prop: 'remark',
    component: 'input',
    props: { type: 'textarea', maxlength: 200, showWordLimit: true },
    model: ['add', 'edit', 'copy']
  },
  { label: '背景颜色', prop: 'backColor', component: 'input', model: ['add', 'edit', 'copy'] },
  {
    label: '上级菜单',
    prop: 'parentId',
    component: 'slot',
    model: ['add', 'edit', 'copy']
  },
  { label: '图标', prop: 'menuIcon', component: 'slot', model: ['add', 'edit', 'copy'] }
]
