export type ActionType = 'add' | 'label' | 'export' | 'detail' | 'edit'

export type tabsActivateName = 'basicInfo' | 'configInfo'

export interface visibleMap {
  [key: string]: () => boolean
}
