import { ref } from 'vue'
import { defineStore } from 'pinia'

import type { TabItem } from '@/layout/tabs/type'
import type { MenuItemProps } from '@/layout/slider/type'

export const useHomeStore = defineStore('home', () => {
    // -------slider---------
    const collapse = ref(false) // 菜单是否折叠

    function updateCollapse() { // 更新菜单折叠
        collapse.value = !collapse.value
    }


    const menuList = ref<MenuItemProps[]>([])  // 菜单列表

    function updateMenuList(list: MenuItemProps[]) {
        menuList.value = list
    }
    // -------slider---------

    // -------tabs---------
    const tabList = ref<TabItem[]>([
        {
            name: 'home',
            title: '首页',
            path: "/home"
        },
        {
            name: 'division',
            title: '区划管理',
            path: "/division"
        },
        {
            name: 'log',
            title: '日志管理',
            path: "/log"
        },
    ]) // tabs数据列表

    function addTabToList(tab: TabItem) {
        const isExit = !!tabList.value.find(t => t.name === tab.name)
        if (!isExit) tabList.value.push(tab)
    }

    const currentActiveTabPath = ref('')  // 当前激活状态的tab路径
    function updateCurrentActiveTab(path: string) {
        currentActiveTabPath.value = path
    }

    // -------tabs---------

    return { collapse, tabList, menuList, currentActiveTabPath, updateCollapse, addTabToList, updateCurrentActiveTab, updateMenuList }
})
