import type { ComputedRef } from 'vue'
export function getSearchConfig(sysCoverAgeList: any): CnPage.SearchProps {
  return {
    model: {},
    labelPosition: 'left',
    items: [
      { label: '粤智助事项编码', prop: 'matterCode', component: 'input' },
      { label: '事项名称', prop: 'matterName', component: 'input' },
      {
        label: '事项别名',
        prop: 'matterAlias',
        component: 'input'
      },
      {
        label: '服务对象',
        prop: 'serviceObject',
        component: 'select',
        dict: 'SERVICE_OBJECT'
      },
      {
        label: '系统层级',
        prop: 'sysLevel',
        component: 'select',
        dict: 'SYS_LEVEL'
      },
      {
        label: '系统覆盖范围',
        prop: 'sysCoverage',
        component: 'cascader',
        props: {
          options: sysCoverAgeList!,
          props: {
            checkStrictly: false,
            multiple: true,
            emitPath: false,
            label: 'label',
            value: 'value',
            children: 'childen'
          }
        }
      },
      {
        label: '业务部门',
        prop: 'businessUnit',
        component: 'input'
      },
      {
        label: '办理类型',
        prop: 'handleType',
        component: 'select',
        dict: 'HANDLE_TYPE'
      },
      {
        label: '事项状态',
        prop: 'matterStatus',
        component: 'select',
        props: {
          options: [
            { label: '有效', value: '1' },
            { label: '无效', value: '0' }
          ]
        }
      }
    ],
    colSpan: 8,
    footerSpan: 0,
    labelWidth: 120
  }
}
