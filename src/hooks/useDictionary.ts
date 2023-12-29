import { computed, ref, type ComputedRef, type Ref } from 'vue'
import { getDictionary } from '@/api'
import { getUnitTypeList } from '@/api/admin'

// 定时器
let timer = 0
const timeout = 10
// 字典类型缓存
const types: string[] = []
// 响应式的字典对象
const dict: Record<string, Ref<CnPage.OptionProps[]>> = {}

// 请求字典选项
function useDictionary(type: string): Ref<CnPage.OptionProps[]>
// 解析字典选项，可以传入已有字典解析
function useDictionary(
  type: string | CnPage.OptionProps[],
  value: number | string | Array<number | string>,
  separator?: string
): ComputedRef<string>
function useDictionary(
  type: string | CnPage.OptionProps[],
  value?: number | string | Array<number | string>,
  separator = ','
): Ref<CnPage.OptionProps[]> | ComputedRef<string> {
  // 请求接口，获取字典
  if (typeof type === 'string') {
    if (!dict[type]) {
      dict[type] = ref<CnPage.OptionProps[]>([])

      // 单位类型调单独接口获取
      if (type === 'UNIT_TYPE') {
        getUnitTypeDict()
      } else {
        types.push(type)
      }
    }

    // 等一下，人齐了才发车
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      if (types.length === 0) return
      const newTypes = types.slice()
      types.length = 0
      getDictionary(newTypes).then((res) => {
        for (const key in res.data) {
          dict[key].value = res.data[key].map((v) => ({
            label: v.description,
            value: v.subtype
          }))
        }
      })
    }, timeout)
  }

  const options = typeof type === 'string' ? dict[type] : ref(type)
  const label = computed(() => {
    if (value === undefined || value === null) return ''
    const values = Array.isArray(value) ? value : [value]
    const items = values.map(
      (value) => {
        if (typeof value === 'number') value = value.toString()
        return options.value.find((v) => v.value === value) || { label: value }
      }
    )
    return items.map((v) => v.label).join(separator)
  })

  return value === undefined ? options : label
}

export default useDictionary

function getUnitTypeDict() {
  getUnitTypeList({ page: 1, size: 1000, obj: {} }).then((res) => {
    dict['UNIT_TYPE'].value = res.rows.map((v) => ({
      label: v.unitTypeName,
      value: v.id.toString()
    }))
  })
}

// 移除指定字典类型的数据
// TODO 如有使用场景，可以支持移除全部
export function removeDictionary(type?: string) {
  if (type && dict[type]) {
    delete dict[type]
  }
}
