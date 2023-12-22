export interface MatterMenuRes<T = any> {
  obj?: T
  orderClause?: string
  page?: number
  requestData?: Object
  size?: number
}

export interface MatterMenu {
  id?: number
  parentId?: number
  createTime?: string
  createUser?: string
  description?: string
  backColor?: string
  menuIcon?: string
  menuLevel?: number
  menuName?: string
  menuCode?: string
  menuRelationList?: MenuRelationItem[]
  status?: string
  params?: Object
  remark?: string
  sort?: number
  sortTop?: number
  updateTime?: string
  updateUser?: string
}

export interface MenuRelationItem {
  id?: number
  matterCode?: string
  matterName?: string
  entryUnit?: number
  handleType?: string
  matterAlias?: string
  matterStatus?: string
  mattersId?: number
  menuId?: number
  sort?: number
  sortTop?: number
  status?: string
}

export interface MatterMenuResponse {
  backColor?: string
  children?: MatterMenuResponse[]
  createTime?: string
  createUser?: string
  description?: string
  id?: number
  mattersCount?: number
  menuCode?: string
  menuIcon?: string
  menuLevel?: number
  menuName?: string
  open?: true
  parentId?: number
  remark?: string
  sort?: number
  sortTop?: number
  status?: string
  themeCount?: number
  updateTime?: string
  updateUser?: string
}

export interface MatterMenuRelation {
  entryUnit?: number
  entryUnitText?: string
  handleType?: string
  id?: number
  matterAlias?: string
  matterCode?: string
  matterName?: string
  matterStatus?: string
  mattersId?: number
  menuId?: number | string
  sort?: number
  sortTop?: number
  status?: string
}

export interface MatterThemeMenuItem {
  editStatus?: string
  entryUnit?: number
  handleType?: string
  id?: number
  matterAlias?: string
  matterCode?: string
  matterName?: string
  matterStatus?: string
  mattersId?: number
  menuId?: number
  sort?: number
  sortTop?: number
  status?: string
}
