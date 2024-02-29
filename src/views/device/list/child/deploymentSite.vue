<template>
  <CnForm ref="basisRef" v-bind="basisForm" :value="basisForm.model">
    <template #divider>
      <h3>部署场所</h3>
    </template>
    <template #coordinate>
      <!-- <el-form :model="basisForm.model" label-width="120px">
        <el-form-item label="经度">
          <el-input v-model="basisForm.model.pointLat" />
          <el-input v-model="basisForm.model.pointLng" />
        </el-form-item>
      </el-form> -->
      <span>经度：{{ basisForm.model?.pointLat }}</span
      >，
      <span>纬度：{{ basisForm.model?.pointLng }}</span>
    </template>
    <template #divider2>
      <h3>管理单位、技术支持单位</h3>
    </template>
    <template #businessHours>
      <BusinessHours v-model="businessHoursWeek" />
    </template>
  </CnForm>
</template>
<script lang="ts" setup>
import { reactive, ref, watchEffect } from 'vue'
import CnForm from '@/components/cn-page/CnForm.vue'
import { getUserList, type UserTs } from '@/api/admin'
import BusinessHours from './BusinessHours.vue'

const businessHoursWeek = ref<Record<string, string>>()

const props = defineProps({
  model: {
    type: Object,
    default: () => ({})
  }
})

const basisRef = ref()
const managePersonOptions = ref<UserTs[]>([])
const basisForm: any = reactive({
  labelWidth: 120,
  colSpan: 12,
  model: {},
  disabled: props.model.type === 'view' ? true : false,
  rules: {
    regionDetail: [{ required: true, message: '请选择行政区域' }],
    detailAddress: [{ required: true, message: '请输入详细地址' }],
    coordinate: [{ required: true, message: '请输入地理坐标' }],
    siteName: [{ required: true, message: '请输入部署场所名称' }],
    siteType: [{ required: true, message: '请选择部署场所类型' }],
    networkPolicy: [{ required: true, message: '请选择网络策略' }],
    // mac: [{ required: true, message: "请输入mac地址" }],
    // ip: [{ required: true, message: "请输入IP地址" }],
    businessHours: [{ required: true, message: '请选择营业时间' }],
    timerOnOff: [{ required: true, message: '请选择是否定时开关机' }],
    devManageUnit: [{ required: true, message: '请选择设备管理单位' }],
    managePersonName: [{ required: true, message: '请选择自助终端管理员' }],
    // managePersonContact: [{ required: true, message: "请输入自助终端管理员" }],
    manufacturer: [{ required: true, message: '请输入生产厂商' }],
    supportingUnit: [{ required: true, message: '请输入设备技术支撑单位' }],
    operationPersonName: [{ required: true, message: '请输入运维人员' }],
    operationPersonContact: [{ required: true, message: '请输入运维人员联系方式' }]
  },
  items: [
    {
      component: 'slot',
      prop: 'divider',
      span: 24
    },
    {
      label: '行政区划',
      prop: 'ad',
      component: 'ad'
    },
    {
      label: '详细地址',
      prop: 'detailAddress',
      component: 'input'
    },
    // {
    //   label: "地理坐标",
    //   prop: "coordinate",
    //   component: "slot",
    //   span: 24,
    //   visible: () => props.model.type === "view",
    // },
    {
      label: '地理坐标',
      prop: 'pointLatLng',
      component: 'input'
      // visible: () => props.model.type !== "view",
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
      props: { multiple: true },
      dict: 'NETWORD_POLICY'
    },
    {
      label: 'mac地址',
      prop: 'mac',
      component: 'input',
      readonly: true
    },
    {
      label: 'IP地址',
      prop: 'ip',
      component: 'input',
      readonly: true
    },
    {
      label: '设备营业时间',
      prop: 'businessHours',
      component: 'select',
      dict: 'DEV_BUSINESS_HOURS'
    },
    {
      label: '定时开关机',
      prop: 'timerOnOff',
      component: 'select',
      dict: 'YES_NO'
    },
    {
      label: '设备营业时间',
      prop: 'businessHours',
      component: 'slot',
      span: 24,
      visible: () => basisForm.model?.businessHours === '3'
    },

    {
      component: 'slot',
      prop: 'divider2',
      span: 24
    },
    {
      label: '设备管理单位',
      prop: 'devManageUnit',
      component: 'select',
      dict: 'UNIT_LIST'
    },
    {
      label: '自助终端管理员',
      prop: 'managePersonName',
      component: 'select',
      props: {
        options: managePersonOptions,
        filterable: true,
        remote: true,
        remoteMethod: (query: string) => {
          if (query) {
            getUserList({ page: 1, size: 10, obj: { name: query } }).then((res) => {
              managePersonOptions.value = res.rows.map((v) => ({
                ...v,
                label: v.name,
                value: v.id
              }))
            })
          }
        },
        onChange: (val: number) => {
          const person = managePersonOptions.value.find((v) => v.id === val) || { phone: undefined }
          basisForm.model.managePersonContact = person.phone
        }
      }
    },
    {
      label: '自助终端管理员联系方式',
      prop: 'managePersonContact'
    },
    {
      label: '生产厂商',
      prop: 'manufacturer',
      component: 'select',
      dict: 'UNIT_LIST'
    },
    {
      label: '设备技术支撑单位',
      prop: 'supportingUnit',
      component: 'select',
      dict: 'UNIT_LIST'
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
  ]
})

const validateForm = () => {
  return basisRef.value.formRef.validate((valid: boolean) => {
    if (valid) {
      return true
    } else {
      return false
    }
  })
}
const getFormData = () => {
  const managePerson = managePersonOptions.value.find(
    (v) => v.id === basisForm.model.managePersonName
  )
  return {
    ...basisForm.model,
    ...businessHoursWeek.value,
    managePersonName: managePerson?.name
  }
}
defineExpose({ validateForm, getFormData })

watchEffect(async () => {
  if (props.model) {
    basisForm.model = { ...props.model, networkPolicy: props.model.networkPolicy.split(',') }
    // 传的时候还是字符串，取的时候变成数字了
    // if (typeof props.model.supportingUnit === 'number') basisForm.model.supportingUnit = String(props.model.supportingUnit)

    if (!businessHoursWeek.value) {
      const {
        businessHours1,
        businessHours2,
        businessHours3,
        businessHours4,
        businessHours5,
        businessHours6,
        businessHours7
      } = props.model
      businessHoursWeek.value = {
        businessHours1,
        businessHours2,
        businessHours3,
        businessHours4,
        businessHours5,
        businessHours6,
        businessHours7
      }
    }
  }
})
</script>
<style lang="scss" scoped>
.time-slotlit {
  width: 100%;
}
.refuse-bottom {
  border-bottom: 1px solid #cdd0d6;
  div,
  span {
    color: var(--gray9);
  }
}
</style>
