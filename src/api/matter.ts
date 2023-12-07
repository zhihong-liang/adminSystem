import axios from 'axios'
import type { ListReq, ListRes, Res } from '.'

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

export interface BusinessUnit {
  businessDeptName?: string
  remark?: string
}

export interface MatterLabel {
  lableName?: string
  remark?: string
}

// 查询事项信息列表
export const getMatterList = (data: ListReq<MatterInfo>): Promise<ListRes> =>
  axios.post('/api/matters/info/list', data)

// 新增事项信息
export const addMatter = (data: any): Promise<Res> => axios.post('/api/matters/info/add', data)

// 查询业务部门列表
export const getDeptList = (data: ListReq<BusinessUnit>): Promise<ListRes> =>
  axios.post('/api/matters/dept/list', data)

// 新建业务部门
export const addDept = (data: BusinessUnit): Promise<Res> =>
  axios.post('/api/matters/dept/add', data)

// 查询事项标签
export const getMatterLabelList = (data: ListReq<any>): Promise<ListRes> =>
  axios.post('/api/matters/label/list', data)

// 新增事项标签
export const addMatterLabel = (data: MatterLabel): Promise<ListRes> =>
  axios.post('/api/matters/label/add', data)
