export type Menu = {
    // 字段还没确定，可更改，最终解释权是后台给的接口
    id?: number,
    code?: string,
    component?: string,
    createTime?: string
    createUser?: string,
    description?: string,
    icon?: string,
    name?: string
    params?: Object,
    parentId?: number,
    path?: string,
    perms?: string,
    sort?: number
    status?: string,
    type?: string,
    updateTime?: string,
    updateUser?: string,
    visible?: string
    childList?: Menu[]
}