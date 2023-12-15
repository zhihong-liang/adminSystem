export function treeToArray(tree) {
  return tree.reduce((res, item) => {
    const { children, ...i } = item
    return res.concat(i, children && children.length ? treeToArray(children) : [])
  }, [])
}

/**
 * 能把所有树状结构的数据扁平化，(有待完善)
 * @param tree 树状数据
 * @param opts 转换字段名称
 * @returns 扁平化后的数据
 */
export function Tree2Flat(tree: unknown[], opts: any) {
  const { children: _children = '' } = opts || {}

  const result: any = []

  tree.forEach((item: any) => {
    const obj = { ...item }

    if (obj[_children].length) obj[_children] = []

    result.push(obj)

    if (item[_children]?.length) {
      result.push(...Tree2Flat(item[_children], opts))
    }
  })

  return result
}
