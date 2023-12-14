import axios from 'axios'
import type { ListReq, ListRes, Res } from '.'

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
