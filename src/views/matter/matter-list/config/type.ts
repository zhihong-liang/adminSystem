export type ActionType = 'add' | 'label' | 'export' | 'detail' | 'edit'

export type tabsActivateName = 'basicInfo' | 'configInfo'

export interface visibleMap {
  [key: string]: () => boolean
}

export interface getDialogConfigParams {
  dialogSubmitSuccess: () => void
  sysCoverAgeList?: any
  activeName?: tabsActivateName
  model?: Record<string, any>
  visible?: visibleMap
}
