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

interface exportFileOpts {
  fileName: string // 文件名称
  headers?: string // blob请求头的content-type
  fileType?: string // 导出文件类型（xlsx、word ...）
}
/**
 * @param data blob文件流
 * @param opts 可选项
 */
export function exportBlob(data: BlobPart, opts: exportFileOpts) {
  let { fileName, fileType = 'xlsx' } = opts

  fileName = (fileName?.match(/(\S*)\./)?.[0] || '文件') + fileType

  let blob = new Blob([data], {
    type: opts.headers || 'application/vnd.ms-excel'
  })

  let href = window.URL.createObjectURL(blob)
  let downloadElement = document.createElement('a')
  downloadElement.href = href
  downloadElement.download = opts.fileName
  document.body.appendChild(downloadElement)
  downloadElement.click() //点击下载
  document.body.removeChild(downloadElement) //下载完成移除元素
}
