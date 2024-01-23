import { ref } from 'vue'
import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized,
  type RouteRecordRaw
} from 'vue-router'
import { start, close } from '@/utils/nprogress'
import Routes from './routes'
import Demo from './demo'
import { useHomeStore, useLoginStore, useUserStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { getToken } from '@/utils/auth'

import BaseLayout from '../layout/index.vue'

import type { BreadcrumbItem, Menu } from '@/layout/type'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...Routes, ...(import.meta.env.MODE === 'development' ? Demo : [])]
})

// 菜单转换为路由
const formatMenus = (menus: Menu[], modules: any) => {
  let list = []

  list = menus.map((m: Menu) => {
    const { name, id, parentId, path, childList, component, code, type, status } = m
    let menu: any = {}
    let buttons: any[] = []

    if (type === 'menu' && childList && childList.length) {
      menu.children = formatMenus(childList, modules)
    }

    if (type === 'dirt') {
      menu.component = modules[component as string]

      if (childList?.length) {
        buttons = childList
          .filter((b) => b.type === 'action')
          .map((buttons) => ({
            status: buttons.status,
            code: buttons.code,
            id: buttons.id,
            parentId: buttons.parentId
          }))
      }
    }

    menu = Object.assign({}, menu, {
      path,
      name: code,
      meta: {
        name,
        id,
        parentId,
        // component,
        status: Number(status),
        authButtons: buttons
      }
    })

    return menu
  })

  return list
}

// 添加动态路由
export const dymanicAddRoute = (menuList: Menu[], modules: any) => {
  const _children = [
    ...formatMenus(menuList, modules)
    // TODO 添加404
  ]

  const baseRoute: any = {
    path: '/',
    name: 'layout',
    component: BaseLayout,
    redirect: '/system/usercenter',
    children: _children
  }

  router.addRoute(baseRoute)
}

function findNodeByPath(routes: RouteRecordRaw[], path: string) {
  for (let i = 0; i < routes.length; i += 1) {
    const element = routes[i]

    if (element.path === path) return element

    findNodeByPath(element.children || [], path)
  }
}

export const addRoutes = (parentPath: string, routes: RouteRecordRaw[]) => {
  if (!parentPath) {
    routes.forEach((r) => router.addRoute('layout', r))
  }

  const curNode = findNodeByPath(router.getRoutes(), parentPath)

  if (curNode?.children) {
    curNode.children
  }
}

// 处理面包屑组件数据
function searchParentNode(id?: number): BreadcrumbItem[] {
  if (!id) return []

  const home = useHomeStore()
  const { flatMenuList } = storeToRefs(home)

  let _id = id
  const result: BreadcrumbItem[] = []

  while (_id !== 0) {
    const target = flatMenuList.value.find((m) => m.id === _id) || {}
    const isEmpty = !Object.keys(target).length
    if (!isEmpty) {
      const { id, name, path } = target
      result.unshift({ id, name, path: path as string })
    }
    _id = target.parentId as number
  }

  return result
}

const refresh = ref(true)

const handleRouterBeforeEach = async (to: RouteLocationNormalized, next: NavigationGuardNext) => {
  const [home, userStore] = [useHomeStore(), useUserStore()]

  const { menuList, modules } = storeToRefs(home)
  const { getMenuList, addTabToList, resetAll, updateBreadcrumb } = home
  const { updateAuthButtions } = userStore

  const hasToken = !!getToken()

  if (to.path === '/login') {
    resetAll()
    next()
    return
  }

  if (hasToken) {
    if (refresh.value && menuList.value.length) {
      await dymanicAddRoute(menuList.value, modules.value)
      refresh.value = false

      next({ path: to.path, query: to.query }) // 动态添加路由后，要重新再调一次next(to.path)，不能直接next()
    } else {
      // 发现没有菜单列表数据，先请求菜单接口，再重新跑一次守卫逻辑，下一次就不会跑进这里
      if (!menuList.value.length) {
        const loginInfo: any = useLoginStore()
        await getMenuList({
          manual: false,
          params: { currentRoleId: loginInfo.$state.userInfo.currentRoleId || 1 }
        })

        next({ path: to.path, query: to.query })
      } else {
        if (to.path !== '/login' && to.meta.status === 1) {
          addTabToList({
            id: to.meta.id as number,
            name: to.meta.name as string,
            path: to.path
          })
          // 更新权限按钮组
          to.meta?.authButtons && updateAuthButtions(to.meta.authButtons as Menu[])

          // console.log(findNodeByPath(router.getRoutes(), to.path))

          // console.log('to: ', to)
        }

        updateBreadcrumb(searchParentNode(to.meta.id as number))

        next()
      }
    }
  } else {
    if (to.path !== '/login' && to.path !== '/noauth') {
      next('/login')
    } else {
      next()
    }
  }
}

router.beforeEach((to, from, next) => {
  start()
  // console.log('router: ', router)

  handleRouterBeforeEach(to, next)
})

router.afterEach(() => {
  close()
})

export default router
