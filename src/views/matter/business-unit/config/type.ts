export type ActionType = 'add' | 'delete' | 'edit' | 'detail'

export interface getDialogConfigParams {
  dialogSubmitSuccess?: () => void
  model?: Record<string, any>
}
