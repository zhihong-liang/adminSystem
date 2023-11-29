import Mock from 'mockjs'

Mock.setup({ timeout: '10-2000' })

const data = Mock.mock({
  'list|0-100': [
    {
      'id|+1': 10000,
      avatar: '@image("360x360")',
      username: '@word(8, 16)',
      realname: '@cname()',
      birthday: '@date("yyyy-MM-dd")',
      sex: '@natural(0, 1)',
      height: '@natural(150, 200)',
      weight: '@natural(40, 100)'
    }
  ]
})

Mock.mock(/^\/users/, 'get', (options) => {
  let page = 1
  let size = 10
  let realname = ''
  if (options.type === 'GET') {
    const sp = new URLSearchParams(options.url.split('?')[1])
    if (sp.get('page')) page = Number(sp.get('page'))
    if (sp.get('size')) size = Number(sp.get('size'))
    realname = sp.get('realname') || ''
  }
  const start = (page - 1) * size
  const end = start + +size
  const rows = data.list.filter((v: { realname: string }) =>
    realname ? v.realname.includes(realname) : true
  )
  return {
    code: 200,
    data: { list: rows.slice(start, end), total: rows.length },
    message: 'success'
  }
})

Mock.mock(/^\/dictionary/, 'get', (options) => {
  const data: Record<string, any> = {}
  if (options.type === 'GET') {
    const sp = new URLSearchParams(options.url.split('?')[1])
    if (sp.get('0')) {
      data.SEX = [
        { label: '男', value: 0 },
        { label: '女', value: 1 }
      ]
    }
  }
  return {
    code: 200,
    data,
    message: 'success'
  }
})

Mock.mock(/^\/menuList/, 'get', (options) => {
  let data: Record<string, any> = []
  if (options.type === 'GET') {
    // const sp = new URLSearchParams(options.url.split('?')[1])

    data = [
      {
        id: 1,
        parentId: -1,
        children: [],
        icon: 'HomeFilled',
        title: '首页',
        url: '/screenRules',
        path: '/home',
        type: 'menu',
        description: '',
        orderNumber: 1
      },
      {
        id: 110,
        parentId: -1,
        children: [],
        icon: 'Histogram',
        title: '区划管理',
        url: '/division',
        path: '/division',
        type: 'menu',
        description: '区划管理',
        orderNumber: 2
      },
      {
        id: 111,
        parentId: -1,
        children: [],
        icon: 'Histogram',
        title: '日志管理',
        url: '/logManage',
        path: '/log',
        type: 'menu',
        description: '日志管理',
        orderNumber: 3
      },
      {
        id: 112,
        parentId: -1,
        children: [],
        icon: 'Histogram',
        title: '菜单管理',
        url: '/menuManage',
        path: '/menu',
        type: 'menu',
        description: '',
        orderNumber: 4
      }
    ]
  }
  return {
    code: 200,
    data,
    message: 'success'
  }
})
