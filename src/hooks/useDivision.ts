import { ref } from 'vue'
import { getDivisionList, type Division } from '@/api/admin'

export interface Division2 {
  label: string
  value: string
  children?: Division2[]
}

const division = ref<Division2[]>([])

getDivisionList().then(res => {
  division.value.push(...trans(res.data))
})

function trans(list: Division[]) {
  const division: Division2[] = []
  list.forEach(item => {
    division.push({
      value: item.areaCode,
      label: item.areaName,
      children: item.children?.length ? trans(item.children) : undefined
    })
  })
  return division
}

export default function useDivision() {
  return division
}
