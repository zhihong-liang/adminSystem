import type { ListReq, ListRes, Res } from '.'
import axios from 'axios'


/**
 * 监控状态码
*/
export interface monitorcodeType {
  id?: string,
  moduleName?: string,
  params?: any,
  status?: boolean,
  statusCode?: string,
  statusDescription?: string,
  type?: string,
}

// 查询状态码监控列表
export const monitorCodeList = (data: ListReq<monitorcodeType>): Promise<ListRes> =>
  axios.post('/api/monitor/code/list', data)

// 获取状态码监控详细信息
export const monitorCodeGet = (id: string): Promise<Res> => axios.get(`/api/monitor/code/get/` + id)

// 新增状态码监控
export const monitorCodeAdd = (data: monitorcodeType): Promise<Res> => axios.post('/api/monitor/code/add', data)

// 修改状态码监控
export const monitorCodeEdit = (data: monitorcodeType): Promise<Res> => axios.put('/api/monitor/code/edit', data)

// 导出状态码监控列表
export const monitorCodeExport = (data: monitorcodeType): Promise<ListRes> =>
  axios.post('/api/monitor/code/export', data, { responseType: 'blob' })

// 删除状态码监控
export const monitorCodeRemove = (ids: string | number): Promise<Res> => axios.delete('/api/monitor/code/remove/' + ids)


/**
 * 设备状态监控
*/
// 查询设备监控记录统计列表
export const monitorHeartStatisticsList = (data: ListReq<any>): Promise<ListRes> =>
  axios.post('/api/monitor/heartStatistics/list', data)

// 获取设备监控记录统计详细信息
export const monitorHeartStatisticsGet = (id: string): Promise<Res> => axios.get(`/api/monitor/heartStatistics/get/` + id)

// 新增设备监控记录统计
export const monitorHeartStatisticsAdd = (data: any): Promise<Res> => axios.post('/api/monitor/heartStatistics/add', data)

// 修改设备监控记录统计
export const monitorHeartStatisticsEdit = (data: any): Promise<Res> => axios.put('/api/monitor/heartStatistics/edit', data)

// 导出设备监控记录统计列表
export const monitorHeartStatisticsExport = (data: any): Promise<ListRes> =>
  axios.post('/api/monitor/heartStatistics/export', data)

// 导出设备在线趋势图
export const monitorHeartStatisticsChartexport = (data: any): Promise<ListRes> =>
  axios.post('/api/monitor/heartStatistics/chartexport', data)


// 删除设备监控记录统计
export const monitorHeartStatisticsRemove = (ids: string | number): Promise<Res> => axios.delete('/api/monitor/heartStatistics/remove/' + ids)

// 查询设备量和离线告警
export const monitorHeartStatisticsStatusMonitor = (data: any): Promise<Res> => axios.post('/api/monitor/heartStatistics/statusMonitor', data)

// 查询设备趋势图
export const monitorHeartStatisticsTrendChart = (data: any): Promise<Res> => axios.post('/api/monitor/heartStatistics/trendChart', data)


/**
 * 设备业务量
*/

// 查询业务办理统计列表
export const monitorBusinessStatisticsList = (data: ListReq<any>): Promise<ListRes> =>
  axios.post('/api/monitor/businessStatistics/list', data)

// 获取业务办理统计详细信息
export const monitorBusinessStatisticsGet = (id: string): Promise<Res> => axios.get(`/api/monitor/businessStatistics/get/` + id)

// 新增业务办理统计
export const monitorBusinessStatisticsAdd = (data: any): Promise<Res> => axios.post('/api/monitor/businessStatistics/add', data)

// 修改业务办理统计
export const monitorBusinessStatisticsEdit = (data: any): Promise<Res> => axios.put('/api/monitor/businessStatistics/edit', data)

// 导出业务办理统计列表
export const monitorBusinessStatisticsExport = (data: any): Promise<ListRes> =>
  axios.post('/api/monitor/businessStatistics/export', data)

// 查询设备无业务告警
export const monitorBusinessStatisticsNoBusinessMonitor = (data: any): Promise<ListRes> =>
  axios.post('/api/monitor/businessStatistics/noBusinessMonitor', data)

// 删除业务办理统计
export const monitorBusinessStatisticsRemove = (ids: string | number): Promise<Res> => axios.delete('/api/monitor/businessStatistics/remove/' + ids)
