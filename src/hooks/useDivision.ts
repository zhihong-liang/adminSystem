import { ref } from 'vue'
import { getDivisionList, type Division } from '@/api/admin'

export interface Division2 {
  label: string
  value: string
  children?: Division2[]
}

const division = ref<Division2[]>([])
let divisionFlat: Division2[] = []

export function queryAreaAll () {
  division.value = []
  divisionFlat = []
  getDivisionList().then((res) => {
    division.value.push(...trans(res.data))
  })
}

function trans(list: Division[]) {
  const division: Division2[] = []
  list.forEach((item) => {
    const item2: Division2 = {
      value: item.areaCode,
      label: item.areaName,
      children: item.children?.length ? trans(item.children) : undefined
    }
    division.push(item2)
    divisionFlat.push(item2)
  })
  return division
}

export default function useDivision(parentCode = '0') {
  if (parentCode === '0') return division
  return ref(divisionFlat.filter((item) => item.value === parentCode))
}
