import type { ActionType } from './type'
export default function getTollbarConifg(): CnPage.ToolbarProps {
  return {
    items: [
      {
        label: '新建',
        type: 'primary',
        onClick: () => {}
      },
      {
        label: '上线',
        type: '',
        onClick: () => {}
      },
      {
        label: '下线',
        type: '',
        onClick: () => {}
      },
      {
        label: '删除',
        type: '',
        onClick: () => {}
      }
    ]
  }
}
