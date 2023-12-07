import axios from 'axios'
import type { ListReq, ListRes, Res } from '.'

/**
 * 区划管理
 */
export interface Division {
  areaCode: string
  areaName: string
  areaLevel: number
  children?: Division[]
}
export const getDivisionList = (): Promise<Res<Division[]>> => axios.get('/api/admin/area/tree')

/**
 * 单位管理
 */
export interface Unit {
  id?: number
  fullName?: string
  provinceCode?: string
  cityCode?: string
  districtCode?: string
  streetCode?: string
  villageCode?: string
  permissions?: UnitPermission[]
}
interface UnitPermission {
  regionCode: string
  dataPermissionPolicy: string
}
// 单位列表
export const getUnitList = (data: ListReq<Unit>): Promise<ListRes> =>
  axios.post('/api/admin/unit/list', data)
// 新增
export const addUnit = (data: Unit): Promise<Res> => axios.post('/api/admin/unit', data)
// 编辑
export const editUnit = (data: Unit): Promise<Res> => axios.put('/api/admin/unit', data)
// 删除
export const delUnit = (ids: string): Promise<Res> => axios.delete(`/api/admin/unit/${ids}`)
// 获取详情
export const getUnitDetail = (id: Unit['id']): Promise<Res<Unit>> =>
  axios.get(`/api/admin/unit/${id}`)

/**
 * 单位类型
 */
export interface UnitType {
  id?: number
  unitTypeName?: string
  dataPermissionPolicy?: string
  status?: string // 0停用，1启用
  createUser?: string
  createTime?: string
}
// 单位类型列表
export const getUnitTypeList = (data: ListReq<UnitType>): Promise<ListRes> =>
  axios.post('/api/admin/unitType/list', data)
// 更新排序
export const updateUnitTypeSort = (type: 'upper' | 'below', id: UnitType['id']): Promise<Res> =>
  axios.get(`/api/admin/unitType/${type}/${id}`)
// 新增
export const addUnitType = (data: UnitType): Promise<Res> => axios.post('/api/admin/unitType', data)
// 编辑
export const editUnitType = (data: UnitType): Promise<Res> => axios.put('/api/admin/unitType', data)
// 删除
export const delUnitType = (ids: string): Promise<Res> => axios.delete(`/api/admin/unitType/${ids}`)

/**
 * 日志管理
 */
// 操作日志
export interface OperationLog {
  logNo?: string
  moduleName?: string
  logType?: string
  operatorNo?: string
  operatorUsername?: string
  status?: string
  createTime?: string
  operatorIp?: string
  browser?: string
  msg?: string
}
export const getOperationLog = (data: ListReq): Promise<ListRes> =>
  axios.post('/api/admin/operationLog/getPageList', data)
// 登录日志
export interface LoginLog {
  logNo?: string
  logType?: string
  userNo?: string
  loginName?: string
  status?: string
  createTime?: string
  loginIp?: string
  browser?: string
  msg?: string
}
export const getLoginLog = (data: ListReq<LoginLog>): Promise<ListRes<LoginLog>> =>
  axios.post('/api/admin/loginLog/ajaxList', data)