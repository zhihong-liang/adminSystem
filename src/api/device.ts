import axios from 'axios'
import type { ListReq, ListRes, Res } from '.'
const device = '/api/device'
const admin = '/api/admin'

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
  axios.put(device + `/devBaseInfo/editList`, data)
// 修改设备基本信息
export const devBaseInfo = (data: any): Promise<ListRes> =>
  axios.post(device + `/devBaseInfo`, data)
// 查询方案列表
export const mattersProgrammeList = (data: any): Promise<ListRes> =>
  axios.post('/api/matters/mattersProgramme/list', data)
// 查询方案-事项关联表列表(分页)
export const mattersProgrammeRelationList = (data: any): Promise<ListRes> =>
  axios.post('/api/matters/mattersProgrammeRelation/listPage', data)

/**
 * 设备认证管理
 */
export interface DevAuthObj {
  createTime?: string
  createUser?: string
  detailAddress?: string
  devCode?: string
  devUnit?: number
  devUnitText: string
  hardIdentificationCode?: string
  id: number
  params?: Object
  privateKey?: string
  publicKey?: string
  regionDetail?: string
  siteName?: string
  status?: string
  updateTime?: string
  updateUser?: string
}

// 查询设备认证管理列表
export const queryDevAuthList = (data: ListReq<DevAuthObj>): Promise<ListRes> =>
  axios.post('/api/device/devAuth/listPage', data)

// 导出设备认证管理列表
export const queryDevAuthExport = (
  data: Pick<
    DevAuthObj,
    'devCode' | 'hardIdentificationCode' | 'publicKey' | 'privateKey' | 'status'
  >
): Promise<ListRes> => axios.post('/api/device/devAuth/export', data, { responseType: 'blob' })

// 绑定和解绑设备
export const queryDevAuthBind = (data: { ids: string; isBind: Boolean }): Promise<any> =>
  axios.get(`/api/device/devAuth/bind/${data.ids}`, { params: { isBind: data.isBind } })

/**
 * 设备分组
 */
export interface DeviceInfo {
  createTime?: string
  createUser?: string
  defaultStatus?: string
  groupName?: string
  groupRemark?: string
  id?: number
  open?: boolean
  parentId?: number
  params?: Object
  status?: string
  updateTime?: string
  updateUser?: string
  children?: DeviceInfo[]
}
// 查询设备认证管理列表
export const queryDevGroupList = (data: {
  parentId?: number
  groupName?: string
  groupRemark?: string
}): Promise<Res<DeviceInfo[]>> => axios.post('/api/device/devGroup/list', data)

// 新增设备组
export const querAddDevGroup = (data: DeviceInfo): Promise<Res> =>
  axios.post('/api/device/devGroup', data)

// 删除设备组
export const queryDeleteDevGroup = (ids: string): Promise<Res> =>
  axios.delete(`/api/device/devGroup/${ids}`)
