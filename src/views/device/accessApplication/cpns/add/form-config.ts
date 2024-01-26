export default function getSearchConfig(
  unitOptions: any,
  managePersonValidator: any
): CnPage.FormProps {
  return {
    model: {
      businessHours: '2',
      timeSlot: [],
      businessHoursList: [
        { label: '周一', startTime: '', endTime: '' },
        { label: '周二', startTime: '', endTime: '' },
        { label: '周三', startTime: '', endTime: '' },
        { label: '周四', startTime: '', endTime: '' },
        { label: '周五', startTime: '', endTime: '' },
        { label: '周六', startTime: '', endTime: '' },
        { label: '周日', startTime: '', endTime: '' }
      ]
    },
    labelPosition: 'left',
    items: [
      { label: '', prop: 'basicInfo', component: 'slot', labelWidth: 0.1, span: 24 },
      { label: '设备接入单位设备编号', prop: 'unitDevCode', component: 'input' },
      {
        label: '设备接入单位',
        prop: 'devUnit',
        component: 'select',
        props: {
          options: unitOptions,
          filterable: 'filterable'
        }
      },
      {
        label: '设备类型',
        prop: 'devType',
        component: 'select',
        dict: 'DEV_TYPE'
      },
      {
        label: '设备型号',
        prop: 'devModelNo',
        component: 'input'
      },
      {
        label: '硬件模块',
        prop: 'hardware',
        component: 'select',
        props: {
          multiple: 'multiple',
          'collapse-tags': 'collapse-tags',
          'collapse-tags-tooltip': 'collapse-tags-tooltip',
          'max-collapse-tags': 2
        },
        dict: 'HARDWARE_MODULE'
      },
      {
        label: '设备接入方式',
        prop: 'accesType',
        component: 'select',
        dict: 'DEV_ACCES_TYPE'
      },
      {
        label: '设备来源',
        prop: 'devSource',
        component: 'select',
        dict: 'DEV_SOURCE'
      },
      {
        label: '设备用途',
        prop: 'devUsage',
        component: 'select',
        dict: 'DEV_USAGE'
      },
      {
        label: '到货时间',
        prop: 'comeTime',
        component: 'datepicker',
        span: 12
      },
      { label: '', prop: 'site', component: 'slot', labelWidth: 0.1, span: 24 },
      {
        label: '行政区划',
        prop: 'provinceCode',
        component: 'ad',
        props: { props: { checkStrictly: true } }
      },
      {
        label: '详细地址',
        prop: 'detailAddress',
        component: 'input'
      },
      {
        label: '地理坐标',
        prop: 'point',
        component: 'input',
        props: {
          placeholder: '填写格式：纬度,经度'
        }
      },
      {
        label: '部署场所名称',
        prop: 'siteName',
        component: 'input'
      },
      {
        label: '部署场所类型',
        prop: 'siteType',
        component: 'select',
        dict: 'DEV_SITE_TYPE'
      },
      {
        label: '网络策略',
        prop: 'networkPolicy',
        component: 'select',
        props: {
          multiple: 'multiple',
          'collapse-tags': 'collapse-tags',
          'collapse-tags-tooltip': 'collapse-tags-tooltip',
          'max-collapse-tags': 2
        },
        dict: 'NETWORD_POLICY'
      },
      {
        label: '设备营业时间',
        prop: 'businessHours',
        component: 'select',
        props: {
          options: [
            {
              label: '7*24小时',
              value: '1'
            },
            {
              label: '周一至周五 9:00-17:00',
              value: '2'
            },
            {
              label: '自定义',
              value: '3'
            }
          ]
        }
      },
      {
        label: '定时开关机',
        prop: 'timerOnOff',
        component: 'select',
        dict: 'YES_NO'
      },
      {
        label: '',
        prop: 'timeSlot',
        component: 'slot',
        span: 18
      },
      { label: '', prop: 'unitInfo', component: 'slot', labelWidth: 0.1, span: 24 },
      {
        label: '设备管理单位',
        prop: 'devManageUnit',
        component: 'select',
        props: {
          options: unitOptions,
          filterable: 'filterable'
        }
      },
      {
        label: '自助终端管理员',
        prop: 'managePersonId',
        component: 'slot'
      },
      {
        label: '自助终端管理员联系方式',
        prop: 'managePersonContact'
      },
      {
        label: '生产厂商',
        prop: 'manufacturer',
        component: 'select',
        props: {
          options: unitOptions,
          filterable: 'filterable'
        }
      },
      {
        label: '设备技术支撑单位',
        prop: 'supportingUnit',
        component: 'select',
        props: {
          options: unitOptions,
          filterable: 'filterable'
        }
      },
      {
        label: '运维人员',
        prop: 'operationPersonName',
        component: 'input'
      },
      {
        label: '运维人员联系方式',
        prop: 'operationPersonContact',
        component: 'input'
      }
    ],
    rules: {
      devUnit: [{ required: true, message: '请选择设备接入单位' }],
      devType: [{ required: true, message: '请选择设备类型' }],
      devModelNo: [{ required: true, message: '请输入设备型号' }],
      hardware: [{ required: true, message: '请选择硬件模块' }],
      accesType: [{ required: true, message: '请选择设备接入方式' }],
      devSource: [{ required: true, message: '请选择设备来源' }],
      devUsage: [{ required: true, message: '请选择设备用途' }],

      provinceCode: [{ required: true, message: '请选择行政区划' }],
      detailAddress: [{ required: true, message: '请输入详细地址' }],
      point: [
        { required: true, message: '请输入地理坐标' },
        {
          pattern:
            /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)\s*[,]\s*[-+]?((1?\d{1,2}|2[0-4]\d|25[0-5])(\.\d+)?|0+(\.0+)?|0)\s*$/,
          message: '请输入正确的地理坐标'
        }
      ],
      siteName: [{ required: true, message: '请输入部署场所名称' }],
      siteType: [{ required: true, message: '请选择部署场所类型' }],
      businessHours: [{ required: true, message: '请选择设备营业时间' }],
      managePersonId: [{ required: false, validator: managePersonValidator, trigger: 'blur' }]
    },
    colSpan: 12,
    footerSpan: 0,
    labelWidth: 170
  }
}
