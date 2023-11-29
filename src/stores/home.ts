import { computed, ref } from 'vue'
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
    const tabList = ref<TabItem[]>([]) // tabs数据列表

    function addTabToList(tab: TabItem) {
        const isExit = !!tabList.value.find(t => t.path === tab.path)
        if (!isExit) tabList.value.push(tab)
    }

    function updateTabList(list: TabItem[]) {
        tabList.value = list
    }

    const currentActiveTabPath = ref('')  // 当前激活状态的tab路径

    const getActiveTab = computed(() => currentActiveTabPath.value)
    function updateCurrentActiveTab(path: string) {
        currentActiveTabPath.value = path
    }

    // -------tabs---------

    return { collapse, tabList, menuList, currentActiveTabPath, getActiveTab, updateCollapse, addTabToList, updateTabList, updateCurrentActiveTab, updateMenuList }
}, {
    persist: true
})
