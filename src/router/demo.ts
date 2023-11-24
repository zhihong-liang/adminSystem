export default [
  {
    path: '/demo/table/data',
    name: 'DemoTableData',
    component: () => import('../views/demo/cn-table/TableData.vue')
  },
  {
    path: '/demo/table/pagination',
    name: 'DemoTablePagination',
    component: () => import('../views/demo/cn-table/TablePagination.vue')
  },
  {
    path: '/demo/table/slot',
    name: 'DemoTableSlot',
    component: () => import('../views/demo/cn-table/TableSlot.vue')
  },
  {
    path: '/demo/form/data',
    name: 'DemoFormData',
    component: () => import('../views/demo/cn-form/FormData.vue')
  },
  {
    path: '/demo/form/search',
    name: 'DemoFormSearch',
    component: () => import('../views/demo/cn-form/FormSearch.vue')
  },
  {
    path: '/demo/form/slot',
    name: 'DemoFormSlot',
    component: () => import('../views/demo/cn-form/FormSlot.vue')
  },
  {
    path: '/demo/page/data',
    name: 'DemoPageData',
    component: () => import('../views/demo/cn-page/PageData.vue')
  },
  // {
  //   name : '日志管理',
  //   children: [
  //     {
  //       path: '/log/login-log',
  //       name: '登录日志',
  //       component: () => import('@/views/log/index.vue')
  //     },
  //     {
  //       path: '/log/action-log',
  //       name: '操作日志',
  //       component: () => import('@/views/log/index.vue')
  //     }
  //   ]
  // }
]
