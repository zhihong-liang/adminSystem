const whiteList = {
  '/views/matter/menu-manage/index.vue': [
    {
      name: 'chooseMatter',
      path: 'matter/menuManage/chooseMatter',
      component: () => import('../views/matter/menu-manage/selectMatter.vue')
    }
  ]
}

export default whiteList
