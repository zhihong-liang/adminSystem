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
        label: '上线',
        type: '',
        onClick: () => {
          clickCb('online')
        }
      },
      {
        label: '下线',
        type: '',
        onClick: () => {
          clickCb('Offline')
        }
      },
      {
        label: '删除',
        type: 'danger',
        onClick: () => {
          clickCb('manyDelete')
        }
      }
    ]
  }
}
