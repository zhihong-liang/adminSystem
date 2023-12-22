import type { ListReq, ListRes, Res } from '.'
import axios from 'axios'

/**
 * 主题
*/
export interface ThemeType {
  status?: string | number,
  themeCode?: string,
  themeName?: string,
  params?: any,
  remark?: string
  id?: string
  copyId?: string | number
}
// 查询事项主题列表（分页）
export const mattersThemeInfoListPage = (data: ListReq<ThemeType>): Promise<ListRes> =>
  axios.post('/api/matters/mattersThemeInfo/listPage', data)

// 新增事项主题
export const addMattersThemeInfo = (data: ThemeType): Promise<Res> => axios.post('/api/matters/mattersThemeInfo', data)

// 修改数据字典类型
export const editMattersThemeInfo = (data: ThemeType): Promise<Res> => axios.put('/api/matters/mattersThemeInfo', data)

// 删除数据字典类型
export const delMattersThemeInfo = (ids: string | number): Promise<Res> => axios.delete('/api/matters/mattersThemeInfo/' + ids)

// 是否存在主题名称
export const isExistThemeName = (params: ThemeType): Promise<Res> => axios.get(`/api/matters/mattersThemeInfo/isExistThemeName`, { params })

// 复制事项主题
export const copyThemeInfo = (data: ThemeType): Promise<Res> => axios.post('/api/matters/copytheme', data)

/**
 * 主题标签
*/
export interface ThemeLabelType {
  id?: string | number
  labelName?: string,
  themeId?: string
}

// 主题标签表列表(不分页)
export const mattersThemeLabelList = (data: ListReq<ThemeType>): Promise<ListRes> =>
  axios.post('/api/matters/mattersThemeLabel/list', data)

// 主题标签新增
export const addMattersThemeLabel = (data: ThemeLabelType): Promise<Res> => axios.post('/api/matters/mattersThemeLabel', data)

// 主题标签新增
export const editMattersThemeLabel = (data: ThemeLabelType): Promise<Res> => axios.put('/api/matters/mattersThemeLabel', data)

// 主题标签删除
export const delMattersThemeLabel = (ids: string): Promise<Res> => axios.delete('/api/matters/mattersThemeLabel/' + ids)

/**
 * 主题标签 关联菜单
*/

// 查询菜单 
export const getThemeLabelMenuList = (data: ListReq<{ labelId: string, themeId: string }>): Promise<ListRes> =>
  axios.post('/api/matters/mattersThemeMenuRelation/listPageThemeMenu', data)

// 新增事项主题菜单列表关联
export const mattersThemeMenuRelationAddList = (data: any[]): Promise<Res> => axios.post('/api/matters/mattersThemeMenuRelation/addList', data)

// 查询事项主题菜单列表关联表列表(分页)
export const mattersThemeMenuRelationListPage = (data: ListReq<{ labelId: string, themeId: string }>): Promise<ListRes> =>
  axios.post('/api/matters/mattersThemeMenuRelation/listPage', data)

// 查询事项主题菜单列表关联表列表(不分页)
export const mattersThemeMenuRelationList = (data: any): Promise<ListRes> =>
  axios.post('/api/matters/mattersThemeMenuRelation/list', data)

// 删除事项主题菜单列表关联表 
export const delMattersThemeMenuRelation = (ids: string): Promise<Res> => axios.delete('/api/matters/mattersThemeMenuRelation/' + ids)


// 主题关联菜单 是否置顶
export const mattersThemeMenuRelationTop = (id: string, params: any): Promise<Res> => axios.get(`/api/matters/mattersThemeMenuRelation/top/` + id, { params })

// 主题关联菜单 排序上升
export const mattersThemeMenuRelationUp = (id: string): Promise<Res> => axios.get(`/api/matters/mattersThemeMenuRelation/upper/` + id)


// 主题关联菜单 排序下移
export const mattersThemeMenuRelationDown = (id: string): Promise<Res> => axios.get(`/api/matters/mattersThemeMenuRelation/below/` + id)


