export type ActionType =
  | 'add'
  | 'delete'
  | 'edit'
  | 'detail'
  | 'manyDelete'
  | 'enable'
  | 'deactivate'

export interface getDialogConfigParams {
  dialogSubmitSuccess?: () => void
  model?: Record<string, any>
}
