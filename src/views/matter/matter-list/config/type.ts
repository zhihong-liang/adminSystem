export type ActionType =
  | 'add'
  | 'label'
  | 'delLabel'
  | 'export'
  | 'detail'
  | 'edit'
  | 'online'
  | 'Offline'
  | 'deactivate'

export type tabsActivateName = 'basicInfo' | 'configInfo'

export interface visibleMap {
  [key: string]: () => boolean
}

export interface optionsMap {
  [key: string]: any
}

export interface getDialogConfigParams {
  dialogSubmitSuccess?: () => void
  optionsMap?: optionsMap
  activeName?: tabsActivateName
  model?: Record<string, any>
  visible?: visibleMap
  onClose?: () => void
}
