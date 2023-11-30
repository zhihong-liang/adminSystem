import axios from 'axios'
import type { ListRes } from '.'

/**
 * 单位类型
 */
interface UnitType {
  page: number
  size: number
  obj: {
    createTime?: string
    createUser?: string
    dataPermissionPolicy?: string
    status?: string // 0停用，1启用
    unitTypeName?: string
  }
}
export const getUnitTypeList = (data: UnitType): Promise<ListRes> => axios.post('/api/admin/unitType/list', data)
