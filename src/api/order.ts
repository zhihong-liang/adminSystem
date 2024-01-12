import axios from 'axios'
import type { ListReq, ListRes, Res } from '.'

export const getOrderType = (data: ListReq): Promise<ListRes> => axios.post('/api/work/workOrderType/listPage', data)

export const orderAddOperat = (data: Record<string, unknown>): Promise<Res> => axios.post('/api/work/workOrderOperational', data)
