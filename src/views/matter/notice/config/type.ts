export type ActionType = 'add' | 'delete' | 'edit' | 'detail' | 'manyDelete' | 'online' | 'Offline'

export interface getDialogConfigParams {
  dialogSubmitSuccess?: () => void
  model?: Record<string, any>
}
