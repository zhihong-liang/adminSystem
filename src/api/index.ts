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
  (res) => {
    const { data } = res
    close()
    if (res.config.responseType === 'blob') {
      return res
    }
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

export interface UserInfo {
  accountSource?: number
  createTime?: string
  createUser?: string
  email?: string
  employeeId?: number
  headImage?: string
  id?: number
  isUpdatePassword?: number
  lastLoginTime?: string
  lockType?: number
  locked?: number
  name?: string
  password?: string
  phone?: string
  postName?: string
  pwdExpireTime?: string
  roleAuthList?: RoleAuthList[]
  sort?: number
  status?: string
  stopReason?: string
  telephone?: string
  unitLevel?: string
  unitName?: string
  unitType?: string
  updateTime?: string
  updateUser?: string
  userAuthType?: string
  userName?: string
  userNo?: string
  userType?: string
  roleIdList?: []
  currentRoleId?: number
  userId?: any
}
export interface RoleAuthList {
  authName?: string
  authNo?: string
  cityCode?: string
  createDate?: string
  createTime?: string
  createUser?: string
  districtCode?: string
  id?: number
  menuList?: Menu[]
  params?: Object
  postId?: number
  postName?: string
  provinceCode?: string
  roleId?: number
  roleName?: string
  streetCode?: string
  unitId?: number
  unitName?: string
  unitNo?: string
  unitType?: string
  updateDate?: string
  updateTime?: string
  updateUser?: string
  userAuthDataList?: UserAuthDataList[]
  userId?: number
  villageCode?: string
}

export interface UserAuthDataList {
  ahthId?: number
  createDate?: string
  createUser?: string
  dataPermissionPolicy?: string
  id?: number
  regionCode?: string
  unitId?: number
  updateDate?: string
  updateUser?: string
  userId?: number
}
// 修改用户信息
export const updateUserInfo = (params: UserInfo): Promise<Res> =>
  axios.put('/api/admin/personal/edit', params)
// 查询用户详情
export const queryUserInfo = (id: number): Promise<Res<UserInfo>> =>
  axios.get('/api/admin/user/get/' + id)

export * from './sys'
export * from './device'
export * from "./front"
