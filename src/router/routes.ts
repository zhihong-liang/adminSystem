import Login from '../views/login/index.vue'
import BaseLayout from '../layout/index.vue'

export default [
  {
    path: '/login',
    name: '登录',
    component: Login
  },
  {
    path: '/noauth',
    name: '无权登录',
    component: () => import('../views/login/noauth.vue')
  },
  {
    path: '/',
    name: 'layout',
    component: BaseLayout,
    redirect: '/system/usercenter',
    children: []
  }
]
