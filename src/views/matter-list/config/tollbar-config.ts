import type { tollbarActionType } from './type'
export default function getTollbarConifg(
  clickCb: (handle: tollbarActionType) => void
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
        label: '所属标签',
        type: '',
        onClick: () => {
          clickCb('label')
        }
      },
      {
        label: '导出',
        type: '',
        onClick: () => {
          clickCb('export')
        }
      }
    ]
  }
}
