export default function getDeleteActionDialogConfig(): CnPage.DialogProps {
  return {
    title: '删除',
    formProps: {
      model: {},
      labelPosition: 'left',
      requireAsteriskPosition: 'right',
      items: [{ label: '', prop: 'deleteTitle', component: 'slot' }],
      labelWidth: 0
    }
  }
}
