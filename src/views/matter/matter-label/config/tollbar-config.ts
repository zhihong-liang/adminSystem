import type { handleType } from './type'
export default function getTollbarConifg(
  clickCb: (handle: handleType) => void
): CnPage.ToolbarProps {
  return {
    items: [
      {
        label: '新建',
        type: 'primary',
        onClick: () => {
          clickCb('add')
        }
      },
      {
        label: '删除',
        type: '',
        onClick: () => {
          clickCb('delete')
        }
      }
    ]
  }
}
