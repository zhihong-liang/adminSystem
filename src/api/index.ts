import axios from 'axios'
import type { Menu } from '@/layout/slider/type'
import { ElMessage } from 'element-plus'

axios.interceptors.request.use(
  (config) => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  },
  (err) => {
    return err
  }
)
axios.interceptors.response.use(
  ({ data }) => {
    if (data.code === '200') return data
    ElMessage.error(data.message);
    return Promise.reject(data)
  },
  (err) => {
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
export const addMenu = (params: Menu): Promise<any> => axios.post(menuBasePath + '/add', params)

export const editMenu = (params: Menu): Promise<any> => axios.put(menuBasePath + '/edit', params)

export const removeMenu = (params: Record<'ids', string>): Promise<any> => axios.delete(menuBasePath + `/remove/${params.ids}`)

// 查询菜单树
export const getMenuList = (params: Menu): Promise<Res<Menu[]>> => axios.post(menuBasePath + '/tree', params)

// 查询菜单列表
export const checkMenuList = (params: ListReq<Menu>): Promise<any> => axios.post(menuBasePath + '/list', params)
