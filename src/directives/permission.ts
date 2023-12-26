import { useUserStore } from '@/stores'
import { storeToRefs } from 'pinia'

export const vPermission = {
  mounted(el: HTMLElement, binding: { value: any }) {
    const { value } = binding

    if (!value) return

    const store = useUserStore()
    const { authButtons } = storeToRefs(store)

    const exite = authButtons.value.some((b) => b.code === value && b.status === '1')

    if (!exite) el.parentElement?.removeChild(el)
  }
}
