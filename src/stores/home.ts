import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getMenuList as queryMenuList } from '@/api'

import type { TabItem, Menu, BreadcrumbItem } from '@/layout/type'

export interface getMenuListPayloadOptions {
    manual?: boolean // 手动更新，默认自动更新
    params?: Menu
}

export interface ContainerStyleProps {
    [key: string]: string
}

export const useHomeStore = defineStore('home', () => {
    // -------slider---------
    const collapse = ref(false) // 菜单是否折叠
    function updateCollapse() { // 更新菜单折叠
        collapse.value = !collapse.value
    }

    const menuList = ref<Menu[]>([])  // 菜单列表
    const finalMenuList = computed(() => menuList.value)

    // const userInfo = JSON.parse(localStorage.getItem('userInfo'))

    // 请求菜单列表
    async function getMenuList({ manual = false, params }: getMenuListPayloadOptions): Promise<Menu[]> {
        // 处理menu数据
        const formatMenu = (menus: Menu[]): Menu[] => {
            const list: Menu[] = []

            menus.forEach((menu) => {
                const { childList = [], status } = menu || {}

                if (status === '1') {
                    if (childList.length) {
                        menu.childList = formatMenu(childList)
                    }
                    return list.push(menu)
                }
            })
            return list
        }        
        const _res = await queryMenuList(params ?? {})  // TODO 接口失败也要做对应的处理
        const { data = [], code } = _res || {}

        return new Promise((resolve, reject) => {
            if (manual) {
                if (code === '200') {
                    resolve(formatMenu(data))
                }
            } else {
                if (code === '200') {
                    updateMenuList(data)
                    resolve([])
                } else {
                    reject(_res)
                }
            }
        })
    }
    function updateMenuList(list: Menu[]) {
        menuList.value = list
    }

    // views中所有模块的vue文件
    const modules = ref({})
    function updateModules(list: any) {
        modules.value = list
    }

    // -------tabs---------
    const tabList = ref<TabItem[]>([]) // tabs数据列表
    function addTabToList(tab: TabItem) {
        const isExit = !!tabList.value.find(t => t.id === tab.id)
        if (!isExit) tabList.value.push(tab)
    }
    function updateTabList(list: TabItem[]) {
        tabList.value = list
    }

    // 当前激活状态的tab，跟菜单的id关联
    const activeTab = ref<number | undefined>()
    function updateActiveTab(id?: number) {
        if (id) {
            activeTab.value = id
        } else {
            activeTab.value = undefined
        }
    }

    /*
    * breadcrumb
    */
    const breadcrumbList = ref<BreadcrumbItem[]>([])
    function updateBreadcrumb(list: BreadcrumbItem[]) {
        breadcrumbList.value = list
    }

    // 页面布局container的样式
    const containerStyle = ref<ContainerStyleProps>({})
    function updateContainerStyle(style: ContainerStyleProps) {
        containerStyle.value = style
    }

    return {
        collapse,
        tabList,
        menuList,
        activeTab,
        modules,
        finalMenuList,
        breadcrumbList,
        containerStyle,
        getMenuList,
        updateCollapse,
        addTabToList,
        updateTabList,
        updateActiveTab,
        updateMenuList,
        updateModules,
        updateBreadcrumb,
        updateContainerStyle
    }
},
    {
        persist: true
    }
)
