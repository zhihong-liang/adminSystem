import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { start, close } from '@/utils/nprogress'
import Routes from './routes'
import Demo from './demo'
import { useHomeStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { getToken } from '@/utils/auth'

import BaseLayout from '../layout/index.vue'

import type { Menu } from '@/layout/slider/type'
import { ref } from 'vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...Routes,
    ...(import.meta.env.MODE === 'development' ? Demo : [])
  ]
})

// 菜单转换为路由
const formatMenus = (menus: Menu[], modules: any) => {
  let list = []

  list = menus.map((m: Menu) => {
    const { name, id, parentId, path, childList, component, code, type } = m
    let menu: any = {}

    if (type === 'menu' && childList && childList.length) {
      menu.children = formatMenus(childList, modules)
    }

    if (type === 'dirt') {
      menu.component = modules[component!]
    }

    menu = Object.assign(menu, {
      path,
      name: code,
      meta: {
        name,
        id,
        parentId
      }
    })

    return menu
  })

  return list
}

// 动态路由
export const dymanicAddRoute = (menuList: Menu[], modules: any) => {
  const _children = [
    ...formatMenus(menuList, modules),
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    }
  ]

  const baseRoute: any = {
    path: '/',
    name: 'layout',
    component: BaseLayout,
    redirect: '/home',
    children: _children
  }

  router.addRoute(baseRoute)
}

// async function initMenu() {
//   const { getMenuList } = useHomeStore()

//   await getMenuList({})
// }

const refresh = ref(true)

router.beforeEach(async (to, from, next) => {
  start();

  const home = useHomeStore()
  const { menuList, modules } = storeToRefs(home)
  const { getMenuList } = home
  const hasToken = !!getToken()

  if (hasToken) {
    if (refresh.value && menuList.value.length) {
      await dymanicAddRoute(menuList.value, modules.value)
      refresh.value = false

      next({ path: to.path }) // 动态添加路由后，要重新再调一次next(to.path)，不能直接next()
    } else {
      // 发现没有菜单列表数据，先请求菜单接口，再重新跑一次守卫逻辑，下一次就不会跑进这里
      if (!menuList.value.length) {
        await getMenuList({})
        next({ path: to.path })
      }

      next()
    }
  } else {
    if (to.path !== '/login') {
      next('/login')
    } else {
      next()
    }
  }

})

router.afterEach(() => {
  close();
})

export default router
