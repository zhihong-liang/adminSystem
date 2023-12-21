import axios from 'axios'
import type { ListReq, ListRes, Res } from '.'
const device = "/api/device"
const admin = "/api/admin"

// 设备列表（分页）
export const devBaseInfoListPage = (data: ListReq): Promise<ListRes> =>
  axios.post(device + '/devBaseInfo/listPage', data)
// 设备列表（不分页）
export const devBaseInfoList = (data: any): Promise<ListRes> =>
  axios.post(device + '/devBaseInfo/list', data)
// 启用
export const devBaseInfoStart = (ids: string): Promise<ListRes> =>
  axios.get(device + `/devBaseInfo/start/${ids}`)
// 停用
export const devBaseInfoStop = (ids: string): Promise<ListRes> =>
  axios.get(device + `/devBaseInfo/stop/${ids}`)
// 注销
export const devBaseInfoLogoff = (ids: string): Promise<ListRes> =>
  axios.get(device + `/devBaseInfo/logoff/${ids}`)
// 导出
export const devBaseInfoExport = (data: any): Promise<ListRes> =>
  axios.post(device + `/devBaseInfo/export`, data, { responseType: 'blob' })
// 获取设备基本信息详细信息
export const getDevBaseInfo = (ids: string): Promise<ListRes> =>
  axios.get(device + `/devBaseInfo/${ids}`)
// 设备单位列表
export const getUnitList = (data: ListReq): Promise<ListRes> =>
  axios.post(admin + `/unit/list`, data)
// 设备分组列表
export const devGroupList = (data: ListReq): Promise<ListRes> =>
  axios.post(device + `/devGroup/list`, data)
// 设备分组列表
export const mattersProgrammeListPage = (data: ListReq): Promise<ListRes> =>
  axios.post('/api/matters/mattersProgramme/listPage', data)
// 批量修改
export const devBaseInfoEditList = (data: any): Promise<ListRes> =>
  axios.post(device + `/devBaseInfo/editList`, data)
// 修改设备基本信息
export const devBaseInfo = (data: any): Promise<ListRes> =>
  axios.post(device + `/devBaseInfo`, data)
// 查询方案列表
export const mattersProgrammeList = (data: any): Promise<ListRes> =>
  axios.post('/api/matters/mattersProgramme/list', data)
// 查询方案-事项关联表列表(分页)
export const mattersProgrammeRelationList = (data: any): Promise<ListRes> =>
  axios.post('/api/matters/mattersProgrammeRelation/listPage', data)
  