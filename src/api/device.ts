import axios from 'axios'
import type { ListReq, ListRes, Res } from '.'
const device = "/api/device"

// 设备列表（分页）
export const devBaseInfoListPage = (data: ListReq): Promise<ListRes> =>
  axios.post(device + '/devBaseInfo/listPage', data)
// 设备列表（bu分页）
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