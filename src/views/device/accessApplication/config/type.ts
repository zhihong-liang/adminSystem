export type ActionType = 'add' | 'delete' | 'edit' | 'detail' | 'import'

export interface getDialogConfigParams {
  dialogSubmitSuccess?: () => void
  model?: Record<string, any>
}
