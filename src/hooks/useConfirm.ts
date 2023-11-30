import { ElMessage, ElMessageBox } from 'element-plus'
import type { Res } from '@/api'

interface UseConfirmParams {
  title?: string
  message?: string
  action: () => Promise<Res>
  success: () => void
}

function useConfirm(opts: UseConfirmParams): void {
  const { message, title = '提示', action, success } = opts
  ElMessageBox.confirm(message, title, {
    distinguishCancelAndClose: true,
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(() => {
      action()
        .then((res) => {
          ElMessage.success(res.message || '操作成功')
          success && success()
        })
        .catch(({ message }) => {
          message && ElMessage.warning(message)
        })
    })
    .catch(() => ({}))
}

export function useDelete(opts: UseConfirmParams): void {
  if (!opts.message) {
    opts.message = '确定要删除所选数据吗？'
  }
  useConfirm(opts)
}

export default useConfirm
