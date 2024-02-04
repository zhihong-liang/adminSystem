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
export const devGroupList = (data: any): Promise<Res> =>
  axios.post(device + `/devGroup/list`, data)
// 设备分组列表
export const mattersProgrammeListPage = (data: ListReq): Promise<ListRes> =>
  axios.post('/api/matters/mattersProgramme/listPage', data)
// 设备分组树
export const devGroupTree = (): Promise<Res> => axios.get(device + '/devGroup/tree')
// 批量修改
export const devBaseInfoEditList = (data: any): Promise<ListRes> =>
  axios.put(device + `/devBaseInfo/editList`, data)
// 修改设备基本信息
export const devBaseInfo = (data: any): Promise<ListRes> => axios.put(device + `/devBaseInfo`, data)
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
  devUnitText?: string
  hardIdentificationCode?: string
  id?: number
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

// 查询未绑定的设备数据(选择设备编号用的)
export const queryDevAuthListPageDev = (data: ListReq<any>): Promise<any> =>
  axios.post('/api/device/devAuth/listPageDev', data)

// 新增设备认证管理
export const queryDevAuth = (data: DevAuthObj, method: 'post' | 'put'): Promise<Res> => {
  const api = {
    post: (): Promise<Res> => axios.post('/api/device/devAuth', data),
    put: (): Promise<Res> => axios.put('/api/device/devAuth', data)
  }
  return api[method]()
}

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
// 查询设备组列表(不分页)
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

/**
 *设备接入审核记录
 */
export interface DeviceAccessRecord {
  applyNo?: string | number
  devAccessUnit?: number
  auditCurrentStep?: string
}

export interface DeviceAccessRecordResponse {
  applyFile?: string
  applyPerson?: string
  applyTime?: string
  auditCurrentStep?: string
  auditEndTime?: string
  auditStatus?: string
  batchNo?: string
  devAccessUnit?: number
  devNum?: number
  id?: number
}

// 查询设备接入申请表列表
export const queryDevAuditHistoryList = (
  data: ListReq<DeviceAccessRecord>
): Promise<ListRes<DeviceAccessRecordResponse[]>> =>
  axios.post('/api/device/devAccessApply/listPage', data)

export interface DevAccessAgreeOrReject {
  id: number
  expirationDate?: string
  hanlleTime?: string
  handleUser?: string
  handleOpinion?: string
  handleDept?: string
  flowId?: number
  auditStep?: string
}
// 同意 或 拒绝
export const queryDevAccessApplyAgreeOrReject = (
  data: DevAccessAgreeOrReject,
  action: 'agree' | 'reject'
): Promise<Res<DeviceAccessRecordResponse>> => {
  if (action === 'agree') {
    return axios.post(`/api/device/devAccessApply/success/${data.id}`, data)
  } else {
    return axios.post(`/api/device/devAccessApply/fail/${data.id}`, data)
  }
}

// 获取设备接入申请表详细信息
export const queryDevAccessDetail = (id: number): Promise<Res<DeviceAccessRecordResponse>> =>
  axios.get(`/api/device/devAccessApply/${id}`)

export interface DevAccessAuditFlowResponse {
  auditStep?: string
  handleDept?: number
  handleDeptText?: string
  handleOpinion?: string
  handleUser?: number
  handleUserText?: string
  hanlleTime?: string
  id?: number
}
// 获取设备接入流程信息
export const queryDevAccessGetHis = (id: number): Promise<Res<DevAccessAuditFlowResponse[]>> =>
  axios.get(`/api/device/devAccessApply/getHis/${id}`)

// 获取设备接入流程信息
export const queryDevAccessListPage = (data: {
  cityCode?: string
  devType?: string
  districtCode?: string
  flowId?: number
  id?: number
  provinceCode?: string
  siteName?: string
  streetCode?: string
  unitDevCode?: string
  villageCode?: string
}): Promise<ListRes<unknown[]>> => axios.post('/api/device/devBaseInfoHis/listPage', data)

/**
 * 设备注册码管理
 */
export interface DevLicenseInfo {
  authorizationContent?: string
  batchNo?: string
  createTime?: string
  createUser?: string
  dataUnits?: any[]
  devCode?: string
  devId?: number
  expirationDate?: string
  id?: number
  ids?: number[]
  macAddress?: string
  params?: any
  privateKey?: string
  publicKey?: string
  remark?: string
  serialNumber?: string
  status?: string
  unitDevCode?: string
  updateTime?: string
  updateUser?: string
}

export interface DevLicenseInfoResponse extends DevLicenseInfo {
  statusText?: string
  devUnit?: number
  devUnitText?: string
  regionDetail?: string
  siteName?: string
}
// 查询设备许可信息列表
export const queryDevLicenseListPage = (
  data: ListReq<DevLicenseInfo>
): Promise<ListRes<DevLicenseInfoResponse[]>> => axios.post('/api/device/devLicense/listPage', data)

// 修改设备许可信息
export const queryEditDevLicense = (data: DevLicenseInfo): Promise<Res> =>
  axios.put('/api/device/devLicense', data)

// 导出设备许可信息列表
export const queryExportDevLicense = (data: DevLicenseInfo): Promise<Res> =>
  axios.post('/api/device/devLicense/export', data, { responseType: 'blob' })

/*
 * 查询设备接入申请表列表
 */
interface DeviceAccessInfo {
  id?: string
  devAccessUnit?: string
  auditStatus?: string
}
interface ManagePerson {
  currentRoleId: string
  status: string
  name: string
}
// 查询事项信息列表
export const getDevAccessApplyList = (data: ListReq<DeviceAccessInfo>): Promise<ListRes> =>
  axios.post('/api/device/devAccessApply/listPage', data)
// 查询自助终端管理员
export const getManagePersonList = (data: ListReq<ManagePerson>): Promise<ListRes> =>
  axios.post('/api/admin/user/list', data)
// 新增设备接入申请表
export const devAccessApply = (data: any): Promise<Res> =>
  axios.post('/api/device/devAccessApply', data)
// 撤回申请
export const revokeDevApply = (ids: string, data: any): Promise<Res> =>
  axios.post(`/api/device/devAccessApply/revoke/${ids}`, data)
// 获取设备接入申请表详细信息
export const devAccessApplyDetail = (id: string): Promise<Res> =>
  axios.get(`/api/device/devAccessApply/${id}`)
// 查询设备基本信息-记录列表（分页)
export const devBaseInfoHisList = (data: any): Promise<Res> =>
  axios.post(`/api/device/devBaseInfoHis/listPage`, data)
// 获取设备接入流程信息
export const getDevAccessApplyHis = (id: string): Promise<Res> =>
  axios.get(`/api/device/devAccessApply/getHis/${id}`)
