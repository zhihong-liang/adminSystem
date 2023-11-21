/**
 * 字典集合，后续从接口获取数据
 */
import { ref, type Ref } from "vue"

// 写死一个示例的字典对象
const dict: Record<string, CnPage.OptionProps[]> = {
  SEX: [
    { label: '男', value: 0 },
    { label: '女', value: 1 }
  ]
}

function useDictionary(type: string): Ref<CnPage.OptionProps[]>
function useDictionary(
  type: string | CnPage.OptionProps[],
  value: number | string | Array<number | string>,
  separator?: string
): Ref<string>
function useDictionary(
  type: string | CnPage.OptionProps[],
  value?: number | string | Array<number | string>,
  separator = ','
): Ref<CnPage.OptionProps[] | string> {
  const options = (typeof type === 'string' ? dict[type] : type) || []
  if (value === undefined) return ref(options)
  if (separator && (value === undefined || value === null)) return ref('')
  const values = Array.isArray(value) ? value : [value]
  const items = values.map((value) => options.find((v) => v.value === value) || { label: value })
  console.log(items)
  return ref(items.map((v) => v.label).join(separator))
}

export default useDictionary
