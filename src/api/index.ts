import axios from 'axios'

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
 * 获取字典，demo 接口，后续替换成后端接口
 */
export const getDictionary = (params: string[]): Promise<any> =>
  axios.get('/dictionary', { params })

export const getMenuList = (params: Object): Promise<any> => axios.get('/menuList', { params })
