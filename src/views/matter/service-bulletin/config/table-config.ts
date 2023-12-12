export default function getTableConfig(): CnPage.TableProps {
  return {
    data: [],
    columns: [
      { label: '公告标题', prop: 'noticeName', slot: 'noticeName' },
      { label: '类型', prop: 'noticeTyle', dict: 'NOTICE_TYPE' },
      { label: '开始时间', prop: 'startDate' },
      { label: '结束时间', prop: 'endDate' },
      { label: '来源', prop: 'noticeSource' },
      { label: '发布时间', prop: 'pushDate' },
      { label: '发布状态', prop: 'noticeStatus', slot: 'noticeStatus' },
      {
        label: '操作',
        prop: 'action',
        slot: 'action',
        width: 140,
        align: 'center'
      }
    ]
  }
}
