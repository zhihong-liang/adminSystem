export type MenuItemProps = {
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