export type ItemProps = {
    id: number,
    parentId: number,
    children: ItemProps[] | [],
    icon?: string,
    title: string,
    href: string,
    spread: boolean,
    path: string,
    code: string,
    type: string,
    attr1?: string,
    attr2?: string,
    attr3?: string,
    description?: string,
    orderNum: number,
    hideMenu?: boolean
}