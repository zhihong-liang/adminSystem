export type MenuItemProps = {
    // 字段还没确定，可更改，最终解释权是后台给的接口
    id: number,
    path: string,
    parentId?: number,
    title?: string,
    filePath?: string,
    children?: MenuItemProps[],
    icon?: string,
    url?: string,
    authCode?: string,
    route?: string,
    type?: string,
    description?: string,
    orderNumber?: number,
    hideMenu?: boolean,
    parentPaths?: string[],
    Component?: any
}