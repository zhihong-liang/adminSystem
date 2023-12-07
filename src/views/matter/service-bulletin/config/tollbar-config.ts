import type { dialogActionType } from './type'
export default function getTollbarConifg(
  clickCb: (handle: dialogActionType) => void
): CnPage.ToolbarProps {
  return {
    items: [
      {
        label: '新建',
        type: 'primary',
        onClick: () => {
          clickCb('add')
        }
      }
    ]
  }
}