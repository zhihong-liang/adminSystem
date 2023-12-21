import axios from 'axios'
import type { ListReq, ListRes, Res } from '.'
import type {
  MatterMenu,
  MatterMenuResponse,
  MatterMenuRelation,
  MatterMenuRes,
  MatterThemeMenuItem
} from '@/views/matter/menu-manage/config/type'

/**
 * 事项列表管理
 */
export interface MatterInfo {
  matterCode?: string
  matterName?: string
  matterAlias?: string
  serviceObject?: string
  sysLevel?: string
  sysCoverage?: string
  businessUnit?: string
  handleType?: string
  matterStatus?: string
}
// 查询事项信息列表
export const getMatterList = (data: ListReq<MatterInfo>): Promise<ListRes> =>
  axios.post('/api/matters/info/list', data)
// 新增事项信息
export const addMatter = (data: any): Promise<Res> => axios.post('/api/matters/info/add', data)
// 获取事项信息详细信息
export const getMatterInfo = (id: string): Promise<Res> => axios.get(`/api/matters/info/get/${id}`)
// 所属标签
export const infoLabel = (data: any): Promise<Res> => axios.post(`/api/matters/info/label`, data)
// 导出事项信息列表
export const exportMatterList = (data: any): Promise<Res> =>
  axios.post(`/api/matters/info/export`, data, {
    responseType: 'blob'
  })
// 修改事项信息
export const editMatter = (data: any): Promise<Res> => axios.put('/api/matters/info/edit', data)

/**
 * 业务部门管理
 */
export interface BusinessUnit {
  businessDeptName?: string
  remark?: string
}
// 查询业务部门列表
export const getDeptList = (data: ListReq<BusinessUnit>): Promise<ListRes> =>
  axios.post('/api/matters/dept/list', data)
// 新建业务部门
export const addDept = (data: BusinessUnit): Promise<Res> =>
  axios.post('/api/matters/dept/add', data)
// 删除业务部门
export const removeDept = (ids: string): Promise<Res> =>
  axios.delete(`/api/matters/dept/remove/${ids}`)
// 修改业务部门
export const editDept = (data: any): Promise<Res> => axios.put(`/api/matters/dept/edit`, data)
// 停用-上线-下线事项信息
export const pushDownDept = (data: any): Promise<Res> =>
  axios.put(`/api/matters/info/pushDown`, data)

/**
 * 事项标签管理
 */
export interface MatterLabel {
  lableName?: string
  remark?: string
}
// 查询事项标签
export const getMatterLabelList = (data: ListReq<MatterLabel>): Promise<ListRes> =>
  axios.post('/api/matters/label/list', data)
// 新增事项标签
export const addMatterLabel = (data: MatterLabel): Promise<Res> =>
  axios.post('/api/matters/label/add', data)
// 修改事项标签
export const editMatterLabel = (data: MatterLabel): Promise<Res> =>
  axios.put('/api/matters/label/edit', data)
// 删除事项标签
export const removeMatterLabel = (ids: string): Promise<Res> =>
  axios.delete(`/api/matters/label/remove/${ids}`)

/**
 * 服务公告管理
 */
export interface ServiceNotice {
  noticeName?: string
  noticeTyle?: string
  noticeStatus?: string
}
// 查询服务公告列表
export const getServiceNoticeList = (data: ListReq<ServiceNotice>): Promise<ListRes> =>
  axios.post('/api/matters/serviceNotice/list', data)
// 新增服务公告
export const addServiceNotice = (data: any): Promise<Res> =>
  axios.post('/api/matters/serviceNotice/add', data)
// 修改服务公告
export const editServiceNotice = (data: any): Promise<Res> =>
  axios.put('/api/matters/serviceNotice/edit', data)
// 删除服务公告
export const deleteServiceNotice = (ids: string): Promise<Res> =>
  axios.delete(`/api/matters/serviceNotice/remove/${ids}`)
// 发布-下架服务公告
export const pushDownServiceNotice = (data: any): Promise<Res> =>
  axios.put('/api/matters/serviceNotice/pushDown', data, {})

/**
 * 菜单管理
 */

// 查询事项菜单列表(不分页)
export const queryMatterMenulist_No = (data: MatterMenu): Promise<Res<MatterMenuResponse[]>> =>
  axios.post('/api/matters/mattersMenu/list', data)

// 查询事项菜单列表(分页)
export const queryMatterMenulist = (
  data: MatterMenuRes<MatterMenu>
): Promise<ListRes<MatterMenuResponse>> => axios.post('/api/matters/mattersMenu/listPage', data)

// 新增/复制 事项菜单
export const addMatterMenu = (data: MatterMenu): Promise<Res> =>
  axios.post('/api/matters/mattersMenu', data)

// 删除事项菜单
export const delMatterMenu = (data: any): Promise<Res> =>
  axios.delete(`/api/matters/mattersMenu/${data.ids}`)

// 编辑 事项菜单
export const editMatterMenu = (data: MatterMenu): Promise<Res> =>
  axios.put('/api/matters/mattersMenu', data)

// 查询菜单-事项关联表列表(不分页)
export const queryMatterMenuRelation_No = (data: MatterMenu): Promise<Res> =>
  axios.post('/api/matters/mattersMenuRelation/list', data)

// 查询菜单-事项关联表列表(分页)
export const queryMatterMenuRelation = (
  data: MatterMenuRes<MatterMenuRelation>
): Promise<ListRes<MatterMenuRelation>> =>
  axios.post('/api/matters/mattersMenuRelation/listPage', data)

// 查询菜单-未加入该标签主题(不分页)
export const queryMatterRelationListThemeMenu = (
  data: MatterThemeMenuItem
): Promise<Res<MatterThemeMenuItem[]>> =>
  axios.post('/api/matters/mattersMenuRelation/listMenuMatters', data)

// 获取菜单-事项关联表详细信息
export const queryMatterDetail = (id: number): Promise<Res> =>
  axios.get(`/api/matters/mattersMenu/${id}`)

// 获取菜单-事项关联表详细信息
export const queryMatterRelationDetail = (id: number): Promise<Res<MatterThemeMenuItem[]>> =>
  axios.get(`/api/matters/mattersMenuRelation/${id}`)

// 新增菜单-事项关联表-批量
export const queryAddMatterRelationList = (data: MatterMenuRelation[]): Promise<Res> =>
  axios.post('/api/matters/mattersMenuRelation/addList', data)

// 删除菜单-事项关联表
export const deleteMatterRelationList = (data: Record<'ids', string>): Promise<Res> =>
  axios.delete(`/api/matters/mattersMenuRelation/${data.ids}`)

/*
 * 办理须知管理
 */
// 查询办理需知管理列表
export interface HandleNotice {
  matterCode?: string
  matterName?: string
  mattersHandleNoticeStatus?: string
}
export const getHandleNoticeList = (data: ListReq<ServiceNotice>): Promise<ListRes> =>
  axios.post('/api/matters/handleNotice/list', data)
