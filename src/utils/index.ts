
export function treeToArray(tree) {
  return tree.reduce((res, item) => {
    const { children, ...i } = item
    return res.concat(i, children && children.length ? treeToArray(children) : [])
  }, [])
}


