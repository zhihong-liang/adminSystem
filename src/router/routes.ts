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
    component: () => import('../views/division/ListView.vue')
  }
]
