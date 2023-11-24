import Login from '../views/login/index.vue'
import BaseLayout from '../layout/index.vue'
import HomeView from '../views/HomeView.vue'

export default [
  {
    path: '/login',
    name: '登录',
    component: Login,
  },
  {
    path: '/',
    name: 'layout',
    component: BaseLayout,
    children: [
      {
        path: '/home',
        component: HomeView,
        meta: {
          title: '首页',
          roles: ['user', 'admin']
        }
      },
      {
        // 系统管理 - 区划管理
        path: '/division',
        name: 'division',
        component: () => import('../views/division/DivisionList.vue')
      },
      {
        // 系统管理 - 单位管理 - 单位类型管理
        path: '/unit/type',
        name: 'unitType',
        component: () => import('../views/unit/UnitType.vue')
      }
    ]
  },
]
