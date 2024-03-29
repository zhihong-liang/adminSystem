import axios from 'axios'
import type { ListReq, ListRes, Res } from '.'

export interface typeItem {
  id: string
  imgUrl?: string
  workTypeName: string
  defId: string
}
export interface dictTs {
  value: string
  label: string
}

export interface orderItemTs {
  id: string
  workOrderNumber: string
  workTypeIdText: string
  orderSourceOs: string
  orderSource: string
  description: string
  devCode: string
  createUnit: string
  operationPersonName: string
  orderApplyTime: string
  orderCloseTime: string
  takeUpTime: string
  bpmNodeCode: string
  customEvaluation: string
  followUp: string
  remark: string
}

// 查询工单类型
export const getOrderType = (data: ListReq): Promise<ListRes<typeItem>> =>
  axios.post('/api/work/workOrderType/listPage', data)

// 新增运维工单
export const orderAddOperat = (data: Record<string, unknown>): Promise<Res> =>
  axios.post('/api/work/workOrderOperational', data)

// 新增耗材工单
export const orderAddConsumable = (data: Record<string, unknown>): Promise<Res> =>
  axios.post('/api/work/workOrderConsumable', data)

// 新增安装工单
export const orderAddInstallation = (data: Record<string, unknown>): Promise<Res> =>
  axios.post('/api/work/workOrderInstallation', data)

// 新增升级工单
export const orderAddUpgrade = (data: Record<string, unknown>): Promise<Res> =>
  axios.post('/api/work/workOrderUpgrade', data)

// 查询工单一览
export const orderListPageAll = (data: ListReq): Promise<ListRes<orderItemTs>> =>
  axios.post('/api/work/workOrderBase/listPage2', data)

// 查询超时数量
export const orderQueryWorkTimeout = (data: Record<string, unknown>): Promise<Res> =>
  axios.post('/api/work/workOrderBase/queryWorkTimeout', data)

// 查询工单基本信息表列表
export const orderBaseListPage = (data: ListReq): Promise<ListRes> =>
  axios.post('/api/work/workOrderBase/listPage', data)

// 查询工单历史
export const orderHistoryList = (data: ListReq): Promise<ListRes> =>
  axios.post('/api/work/workOrderBase/listPage3', data)

// 查询关闭工单列表
export const orderCloseList = (data: ListReq): Promise<ListRes> =>
  axios.post('/api/work/workOrderBase/listPage4', data)

// 查询基本信息和工单信息
export const orderBaseDetail = (id: string): Promise<Res> =>
  axios.get('/api/work/workOrderBase/' + id)

// 工单流程
export const orderProcess = (id: string): Promise<Res> =>
  axios.get('/api/work/workOrderBase/getHis/' + id)

// 审核工单
export const orderAudit = (data: Record<string, unknown>): Promise<Res> =>
  axios.post('/api/work/workOrderBase/audit', data)

// 打回工单提交
export const orderRepulse = (data: Record<string, unknown>): Promise<Res> =>
  axios.post('/api/work/workOrderBase/repulse', data)

// 导出
export const orderInfoExport = (params: Record<string, unknown>): Promise<Res> =>
  axios.post("/api/work/workOrderBase/export", params, {
    responseType: "blob",
  });
