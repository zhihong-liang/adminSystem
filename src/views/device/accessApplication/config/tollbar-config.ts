import type { ActionType } from './type'
export default function getTollbarConifg(
  clickCb: (handle: ActionType) => void
): CnPage.ToolbarProps {
  return {
    items: [
      {
        label: '新建',
        type: 'success',
        onClick: () => {
          clickCb('add')
        }
      },
      {
        label: '导入',
        type: '',
        onClick: () => {
          clickCb('import')
        }
      }
    ]
  }
}
