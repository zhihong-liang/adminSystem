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
import whileList from './whiteList'
import { differenceBy } from 'lodash-es'

import type { BreadcrumbItem, Menu } from '@/layout/type'

let whiteRoutes: any = []

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...Routes, ...(import.meta.env.MODE === 'development' ? Demo : [])]
})

// 菜单转换为路由
const formatMenus = (menus: Menu[], modules: any) => {
  let list
  list = menus.map((m: Menu) => {
    const { name, id, parentId, path, childList, component = '', code, type, status } = m

    let menu: any = {}
    let buttons: any[] = []

    // 每次菜单转换为路由都判断当前菜单是否在 路由白名单 里，存在则把白名单里的菜单也转换为路由
    let white = whileList[component]
    if (Array.isArray(white)) {
      const list = white.map((r, idx) => ({
        ...r,
        parentId: id,
        id: new Date().getTime() + idx,
        type: 'dirt',
        status: '0'
      }))
      // 防止重复添加路由
      whiteRoutes = whiteRoutes.concat(differenceBy(list, whiteRoutes, 'code'))
    }

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
        component,
        status: +status!,
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
    ...formatMenus(menuList, modules), // 菜单转换为路由
    ...formatMenus(whiteRoutes, modules) // 白名单转换为路由
    // TODO 添加404
  ]
  addRoutes('/', _children)
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
    return
  }

  const curNode = findNodeByPath(router.getRoutes(), parentPath)

  if (curNode?.children) {
    routes.forEach(
      (r) => !router.hasRoute(r.name as string) && router.addRoute(curNode.name as string, r)
    )
    // router.addRoute(curNode.name as string, r)
  }
}

// 处理面包屑组件数据
function searchParentNode(id?: number): BreadcrumbItem[] {
  if (!id) return []

  let { flatMenuList } = useHomeStore()
  flatMenuList = [...flatMenuList, ...whiteRoutes]

  let _id = id
  const result: BreadcrumbItem[] = []

  while (_id !== 0) {
    // TODO 稍有不慎容易跑进循环，需要优化
    const target = flatMenuList.find((m) => m.id === _id) || {}

    if (target.parentId === _id) break // 如果 parentId 和 _id 相同就跳出循环，防止跑进循环

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

  if (to.path === '/login') {
    refresh.value = true
    resetAll()
    next()
    return
  }

  if (!!getToken()) {
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

  handleRouterBeforeEach(to, next)
})

router.afterEach(() => {
  close()
})

export default router
