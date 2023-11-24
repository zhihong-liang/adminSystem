import { computed, ref, type ComputedRef, type Ref } from 'vue'
import { getDictionary } from '@/api'

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
      types.push(type)
    }

    // 等一下，人齐了才发车
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      if (types.length === 0) return
      const newTypes = types.slice()
      types.length = 0
      getDictionary(newTypes).then((res) => {
        for (const key in res.data) {
          dict[key].value = res.data[key]
        }
      })
    }, timeout)
  }

  const options = typeof type === 'string' ? dict[type] : ref(type)
  const label = computed(() => {
    if (value === undefined || value === null) return ''
    const values = Array.isArray(value) ? value : [value]
    const items = values.map(
      (value) => options.value.find((v) => v.value === value) || { label: value }
    )
    return items.map((v) => v.label).join(separator)
  })

  return value === undefined ? options : label
}

export default useDictionary
