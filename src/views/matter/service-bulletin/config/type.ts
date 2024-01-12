export type ActionType = 'add' | 'edit' | 'delete' | 'offShelf' | 'detail' | 'grounding'

export interface optionsMap {
  [key: string]: any
}

export interface getDialogConfigParams {
  dialogSubmitSuccess?: () => void
  optionsMap?: optionsMap
  model?: Record<string, any>
  handle?: ActionType
}
