type RouterWhiteList = {
  [key: string]: any
}

const whiteList: RouterWhiteList = {
  '/views/matter/menu-manage/index.vue': [
    {
      path: '/matter/menuManage/chooseMatter',
      code: 'chooseMatter',
      name: '事项菜单查看详情',
      component: '/views/matter/menu-manage/selectMatter.vue'
    }
  ],
  '/views/device/records/accessAudit/index.vue': [
    {
      path: '/device/accessAudit/detail',
      code: 'devAccessAuditDetail',
      name: '设备接入审核记录详情',
      component: '/views/device/records/accessAudit/detail.vue'
    }
  ]
}

export default whiteList
