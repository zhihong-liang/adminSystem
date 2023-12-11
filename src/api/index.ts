import axios from 'axios'
import type { Menu } from '@/layout/slider/type'
import { ElMessage } from 'element-plus'
import { getToken } from '@/utils/auth'
import router from '@/router'
import { start, close } from '@/utils/nprogress'
axios.interceptors.request.use(
  (config) => {
    start()
    config.headers.Authorization = getToken()
    return config
  },
  (err) => {
    return err
  }
)
axios.interceptors.response.use(
  ({ data }) => {
    close()
    if (data.code === '200') {
      return data
    }
    if (data.code === '600') {
      router.replace('/login')
    }
    ElMessage.error(data.message)
    return Promise.reject(data)
  },
  (err) => {
    close()
    return err
  }
)

export interface Res<T = any> {
  code: string
  message: string
  data: T
}
export type ListRes<T = Record<string, any>> = {
  code: string
  rows: T[]
  total: number
  msg: string
}
export type ListReq<T = Record<string, any>> = {
  page?: number
  size?: number
  obj: T
}

/**
 * mock 接口，用于 demo 页面
 */
export interface User {
  id: number
  avatar: string
  username: string
  realname: string
  birthday: string
  sex: number
  height: number
  weight: number
}
export const getUsers = (params: ListReq): Promise<Res<ListRes<User>>> =>
  axios.get('/users', { params })

/**
 * 登录
 */
interface Login {
  userName: string
  password: string
}
export const login = (data: Login): Promise<Res> => axios.post('/api/auth/jwt/logon', data)

/**
 * 获取字典接口
 */
interface Dict {
  subtype: string
  description: string
}
export const getDictionary = (typeList: string[]): Promise<Res<Record<string, Dict[]>>> =>
  axios.post('/api/admin/dict/getOptionsList', typeList)

// export const getMenuList = (params: Object): Promise<any> => axios.get('/menuList', { params })

/**
 * 菜单管理
 */
const menuBasePath = '/api/admin/sys/sysMenu'
export const addMenu = (params: Menu): Promise<Res> => axios.post(menuBasePath + '/add', params)

export const editMenu = (params: Menu): Promise<Res> => axios.put(menuBasePath + '/edit', params)

export const removeMenu = (params: Record<'ids', string>): Promise<Res> =>
  axios.delete(menuBasePath + `/remove/${params.ids}`)

// 查询菜单树
export const getMenuList = (params: Menu): Promise<Res<Menu[]>> =>
  axios.post(menuBasePath + '/tree', params)

// 查询菜单列表
export const checkMenuList = (params: ListReq<Menu>): Promise<any> =>
  axios.post(menuBasePath + '/list', params)

/**
 *  个人中心
 */

export interface RoleAuth { // 权限集合
  authName?: string
  authNo?: string
  createTime?: string
  createUser?: string
  id?: number
  menuList?: Menu[]
  params?: object
  postId?: number
  roleId?: number
  unitId?: number
  unitNo?: string
  updateTime?: string
  updateUser?: string
  userAuthDataList?: object // userAuthDataList	数据权限
  userId?: number

}
export interface UserInfo { // 用户信息
  accountLevel?: number
  accountSource?: number
  address?: string
  birth?: string
  cityCode?: string
  countyCode?: string
  createTime?: string
  createUser?: string
  currentAuthId?: number
  currentPost?: string
  deptId?: string
  education?: string
  email?: string
  employeeId?: number
  headImage?: string
  id?: number
  idNumber?: string
  isUpdatePassword?: number
  lastLoginTime?: string
  lockType?: number
  locked?: number
  marry?: string
  name?: string
  nation?: string
  params?: {}
  password?: string
  phone?: string
  provinceCode?: string
  pwdExpireTime?: string
  roleAuthList?: RoleAuth
  sex?: string
  sort?: number
  status?: string
  stopReason?: string
  telephone?: string
  townCode?: string
  unitCode?: string
  unitId?: number
  unitName?: string
  updateTime?: string
  updateUser?: string
  userName?: string
  userNo?: string
  villageCode?: string
}
// 修改用户信息
export const updateUserInfo = (params: UserInfo): Promise<Res> =>
  axios.put('/api/admin/personal/edit', params)

export * from './sys'
export * from './device'
