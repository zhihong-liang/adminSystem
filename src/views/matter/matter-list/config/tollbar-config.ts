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
        label: '所属标签',
        type: '',
        onClick: () => {
          clickCb('label')
        }
      },
      {
        label: '删除标签',
        type: 'danger',
        onClick: () => {
          clickCb('delLabel')
        }
      },
      {
        label: '导出',
        type: 'warning',
        onClick: () => {
          clickCb('export')
        }
      }
    ]
  }
}
