import axios from 'axios'

axios.interceptors.response.use(
  ({ data }: { data: Res<any> }) => {
    if (data.code === 200) return data.data
    return Promise.reject(data)
  },
  (err) => {
    return err
  }
)

export interface Res<T = any> {
  code: number
  message: string
  data: T
}
export type ListRes<T = any> = { list: T[]; total: number }
export type ListReq = {
  page?: number
  size?: number
}

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
export const getUsers = (params: ListReq): Promise<ListRes<User>> => axios.get('/users', { params })
