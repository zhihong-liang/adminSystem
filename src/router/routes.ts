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
      }
    ]
  },
]
