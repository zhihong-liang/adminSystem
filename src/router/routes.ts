import HomeView from '../views/HomeView.vue'

export default [
  {
    path: '/',
    name: 'home',
    component: HomeView
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
