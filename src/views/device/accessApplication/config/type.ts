export type ActionType = 'add' | 'delete' | 'revoke' | 'detail' | 'import'

export interface getDialogConfigParams {
  dialogSubmitSuccess?: () => void
  model?: Record<string, any>
}
