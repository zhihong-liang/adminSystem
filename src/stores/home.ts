import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getMenuList as queryMenuList } from '@/api'

import type { TabItem } from '@/layout/tabs/type'
import type { Menu } from '@/layout/slider/type'

export const useHomeStore = defineStore('home', () => {
    // -------slider---------
    const collapse = ref(false) // 菜单是否折叠
    function updateCollapse() { // 更新菜单折叠
        collapse.value = !collapse.value
    }


    const menuList = ref<Menu[]>([])  // 菜单列表
    const finalMenuList = computed(() => menuList.value)
    // 请求菜单列表
    async function getMenuList(): Promise<Menu[]> {
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

        const _res = await queryMenuList({})

        return new Promise((resolve, reject) => {
            const { data = [], code } = _res
            if (code === '200') {
                resolve(formatMenu(data))
            } else {
                reject(_res)
            }
        })
    }
    function updateMenuList(list: Menu[]) {
        menuList.value = list
    }

    // 所有组件模块
    const modules = ref(import.meta.glob('../views/**/*.vue') || [])

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
    function updateActiveTab(id: number) {
        activeTab.value = id
    }

    return {
        collapse,
        tabList,
        menuList,
        activeTab,
        modules,
        finalMenuList,
        getMenuList,
        updateCollapse,
        addTabToList,
        updateTabList,
        updateActiveTab,
        updateMenuList
    }
},
    {
        persist: true
    })
