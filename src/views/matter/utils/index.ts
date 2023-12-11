import { isString } from 'lodash-es'

export function handlesysCoverageOptionsTree(dirtList: any) {
  const list = dirtList
    .filter((v: any) => v.subtype.length <= 4)
    .map((item: any) => {
      const value = item.subtype
      let parentId
      // 暂时只处理到市一级
      if (value.length === 2) {
        parentId = '0'
      } else {
        parentId = value.substring(0, 2)
      }
      return { parentId, value: item.subtype, label: item.description }
    })
  return createTree([...list])
}

export function createTree(list: any) {
  const len = list.length
  for (let i = 0; i < len; i++) {
    let arrTemp = []
    for (let j = 0; j < list.length; j++) {
      if (list[i].value == list[j].parentId) {
        list[i].childen = arrTemp
        arrTemp.push(list[j])
      }
    }
  }
  const result = []
  for (let i = 0; i < list.length; i++) {
    if (list[i].parentId == 0) {
      result.push(list[i])
    }
  }
  return result
}

export function stringToArray(value: any) {
  return isString(value) ? value.split(',') : value
}
