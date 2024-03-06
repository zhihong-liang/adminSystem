<template>
  <div class="device-accessAudit-detail-root" style="padding: 20px">
    <el-tabs v-model="activeName" type="card" class="demo-tabs">
      <el-tab-pane label="基本信息" name="base" lazy>
        <h2 class="mb-lg">设备接入单位信息</h2>
        <CnForm style="width: 60%" v-bind="formProps"></CnForm>

        <el-divider />

        <h2 class="mb-lg">设备信息</h2>
        <CnPage v-bind="pageProps"></CnPage>
      </el-tab-pane>
      <el-tab-pane label="流程信息" name="flow" lazy>
        <CnTable v-bind="tableProps"></CnTable>
      </el-tab-pane>
    </el-tabs>
    <el-affix
      v-if="formProps.model.auditCurrentStep === '100'"
      class="mt-lg"
      position="bottom"
      :offset="40"
    >
      <el-button
        type="primary"
        @click="() => ActionDialogRef.open({ action: 'agree', row: formProps.model })"
        >同意</el-button
      >
      <el-button
        type="danger"
        @click="() => ActionDialogRef.open({ action: 'reject', row: formProps.model })"
        >拒绝</el-button
      >
    </el-affix>
  </div>
  <ActionDialog
    ref="ActionDialogRef"
    @on-success="init"
  />
</template>

<script setup lang="ts">
import { onBeforeMount, reactive, ref } from 'vue'
import { queryDevAccessDetail, queryDevAccessGetHis, queryDevAccessListPage } from '@/api/device'
import { useRoute } from 'vue-router'

import ActionDialog from './actionDialog.vue'
import CnForm from '@/components/cn-page/CnForm.vue'
import CnPage from '@/components/cn-page/CnPage.vue'
import CnTable from '@/components/cn-page/CnTable.vue'

const route = useRoute()

const activeName = ref('base')

const ActionDialogRef = ref()

const formProps: CnPage.FormProps = reactive({
  model: {},
  labelPosition: 'left',
  labelWidth: '100',
  items: [
    {
      label: '申请编号',
      prop: 'id'
    },
    {
      label: '设备接入单位',
      prop: 'devAccessUnitText'
    },
    {
      label: '接入类型',
      prop: 'menuCode'
    },
    {
      label: '批次号',
      prop: 'batchNo'
    },
    {
      label: '申请事由',
      prop: 'menuCode'
    },
    {
      label: '申请人',
      prop: 'applyPerson'
    },
    {
      label: '联系方式',
      prop: 'menuCode'
    },
    {
      label: '申请时间',
      prop: 'applyTime'
    }
  ],
  readonly: true,
  colSpan: 12
})

const pageProps: CnPage.Props = reactive({
  params: {},
  action: queryDevAccessListPage,
  internal: true,
  search: {
    items: [
      { label: '设备接入单位', prop: 'unitDevCode', component: 'input' },
      { label: '行政区划', prop: 'area', component: 'ad' },
      { label: '部署场所', prop: 'siteName', component: 'input' },
      {
        label: '设备类型',
        prop: 'devType',
        component: 'select',
        dict: 'DEV_TYPE'
      }
    ]
  },
  table: {
    rowKey: 'id',
    columns: [
      { prop: 'devModelNo', label: '设备编号' },
      { prop: 'devUnitText', label: '设备接入单位', dict: 'UNIT_TYPE' },
      { prop: 'devType', label: '设备类型', dict: 'DEV_TYPE' },
      { prop: 'siteName', label: '部署场所' },
      { prop: 'regionDetail', label: '行政区划' },
      { prop: 'detailAddress', label: '详细地址' }
    ]
  },
  pagination: true,
  refresh: new Date().getTime(),
  transformRequest: (_, page, size) => ({ obj: { flowId: route.query.id }, page, size })
})

const tableProps: CnPage.TableProps = reactive({
  data: [],
  columns: [
    {
      prop: 'auditStep',
      label: '流程节点',
      align: 'center',
      dict: 'DEV_ACCESS_AUDIT_TYPE'
    },
    { prop: 'handleDeptText', label: '处理单位', align: 'center' },
    { prop: 'handleUserText', label: '处理人', align: 'center' },
    { prop: 'handleOpinion', label: '处理说明', align: 'center' },
    { prop: 'hanlleTime', label: '处理时间', align: 'center' }
  ],
  border: true
})

function init() {
  const id: any = route.query.id

  // 获取设备接入审核详情
  queryDevAccessDetail(id).then((res) => {
    if (res.code === '200') {
      formProps.model = res.data
    }
  })

  // 获取设备接入审核流程
  queryDevAccessGetHis(id).then((res) => {
    if (res.code === '200') {
      tableProps.data = res.data
    }
  })
}

onBeforeMount(() => init())
</script>

<style scoped>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
