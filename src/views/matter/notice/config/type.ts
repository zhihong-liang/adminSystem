export type ActionType = 'add' | 'delete' | 'edit' | 'detail' | 'manyDelete'

export interface getDialogConfigParams {
  dialogSubmitSuccess?: () => void
  model?: Record<string, any>
}
