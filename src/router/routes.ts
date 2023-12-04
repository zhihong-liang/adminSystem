import Login from '../views/login/index.vue'
import BaseLayout from '../layout/index.vue'

export default [
  {
    path: '/login',
    name: '登录',
    component: Login
  },
  {
    path: '/',
    name: 'layout',
    component: BaseLayout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'homeView',
        component: () => import('../views/HomeView.vue'),
        meta: { requiredAuth: true }
      },
      // 系统管理子系统
      {
        path: '/system',
        name: 'system',
        children: [
          {
            // 系统管理子系统 - 菜单管理
            path: '/system/menu',
            name: 'menu',
            component: () => import('../views/menu/MenuList.vue')
          },
          {
            // 系统管理 - 用户管理
            path: '/system/user',
            name: 'user',
            component: () => import('../views/user/UserList.vue')
          },
        ]
      },
      // 日志管理
      {
        path: '/log',
        name: 'logManage',
        component: () => import('../views/log/index.vue'),
        meta: { requiredAuth: false }
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
      },
      {
        // 系统管理 - 单位管理 - 单位管理
        path: '/unit/list',
        name: 'unitList',
        component: () => import('../views/unit/UnitList.vue')
      },
      {
        // 事项列表
        path: '/matterList',
        name: 'matterList',
        component: () => import('../views/matter-list/MatterList.vue')
      },
      {
        // 事项标签管理
        path: '/matterLabel',
        name: 'matterLabel',
        component: () => import('../views/matter-label/MatterLabel.vue')
      },
      {
        // 设备列表
        path: '/device',
        name: 'device',
        component: () => import('../views/device/index.vue')
      },
      {
        // 注销设备列表
        path: '/logOffDevice',
        name: 'logOffDevice',
        component: () => import('../views/logOffDevice/index.vue')
      }
    ]
  }
]
