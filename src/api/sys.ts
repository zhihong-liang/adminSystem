import type { ListReq, ListRes, Res } from '.'
import axios from 'axios'

/**
 * 字典类型
*/
export interface DictType {
  type?: string;// 类型
  description?: string // 描述
}
// 查询数据字典类型列表(分页)
export const dictTypeList = (data: ListReq<DictType>): Promise<ListRes> =>
  axios.post('/api/admin/dictType/list', data)

// 新增字典类型
export const dictTypeAdd = (data: DictType): Promise<Res> => axios.post('/api/admin/dictType', data)

// 修改数据字典类型
export const dictTypeEdit = (data: DictType): Promise<Res> => axios.put('/api/admin/dictType', data)

// 删除数据字典类型
export const dictTypeDel = (data: string | number): Promise<Res> => axios.delete('/api/admin/dictType/' + data)

/**
 * 字典子类
*/

export interface SubDict {
  type?: string; // 主类
  subtype?: string; // 字典值
  description?: string;// 描述
  orderNum?: number | string// 排序
  remarks?: string// 备注

}
// 字典子类列表
export const dictList = (data: ListReq<SubDict>): Promise<ListRes> =>
  axios.post('/api/admin/dict/list', data)

// 新增字典类型
export const dictAdd = (data: SubDict): Promise<Res> => axios.post('/api/admin/dict', data)

// 修改数据字典类型
export const dictEdit = (data: SubDict): Promise<Res> => axios.put('/api/admin/dict', data)

// 删除数据字典类型
export const dictDel = (data: string | number): Promise<Res> => axios.delete('/api/admin/dict/' + data)

// 根据数据字典类型查询所有的数据字典(无分页,查多个字典)
export const dictAllList = (data: string[]): Promise<Res> =>
  axios.post('/api/admin/dict/getOptionsList', data)
