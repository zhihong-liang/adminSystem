<template>
  <CnPage v-bind="props">
    <template #codeSlot="{ row }">
      <el-button link @click="handleOpen('Look', row)">{{ row.workOrderNumber }}</el-button>
    </template>

    <template #addition>
      <div class="tip">
        <div class="tip_num">
          <span class="tip_num_title">工单超时</span>
          <span
            >超时工单 {{ timeoutData?.timeOut }} 笔，即将超时工单
            {{ timeoutData?.soonTimeOut }} 笔</span
          >
          <span class="tip_num_cond" @click="messageRef?.open()"
            >查看<span>《服务标准》</span></span
          >
        </div>
      </div>
    </template>
  </CnPage>
  <detail
    ref="detailRef"
    @success="
      () => {
        props.refresh = Date.now()
      }
    "
  ></detail>
  <messageContext ref="messageRef" />
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { orderListPageAll, orderQueryWorkTimeout } from '@/api/order'
import CnPage from '@/components/cn-page/CnPage.vue'
import detail from './child/detail.vue'
import useSearch from './hooks/useSearch'
import messageContext from '../add/child/messageContext.vue'

const messageRef = ref()
const detailRef = ref()
const timeoutData = ref()

const props: CnPage.Props = reactive({
  params: {},
  action: orderListPageAll,
  search: {
    items: useSearch('All')
  },
  transformRequest(params, page, size) {
    const [orderApplyStartTime, orderApplyEndTime] = params?.orderApplyTime || []
    const [orderCloseStartTime, orderCloseEndTime] = params?.orderCloseTime || []
    const obj: any = {
      ...params,
      orderApplyStartTime,
      orderApplyEndTime,
      orderCloseStartTime,
      orderCloseEndTime
    }
    delete obj.orderApplyTime
    delete obj.orderCloseTime
    return {
      page,
      size,
      obj
    }
  },
  table: {
    columns: [
      { type: 'selection' },
      { slot: 'codeSlot', label: '工单编号', width: 140 },
      { prop: 'workTypeIdText', label: '工单类型' },
      { prop: 'orderSourceOs', label: '工单来源系统', dict: 'ORDER_SOURCE_OS' },
      { prop: 'orderSource', label: '工单来源', dict: 'ORDER_SOURCE' },
      { prop: 'description', label: '情况描述', dict: 'WORK_DESCIPTION' },
      { prop: 'devCode', label: '设备编号', width: 160 },
      { prop: 'createUnit', label: '创建人员单位', width: 160 },
      { prop: 'operationPersonName', label: '运维人员' },
      { prop: 'orderApplyTime', label: '创建时间', width: 165 },
      { prop: 'orderCloseTime', label: '完成时间' },
      { prop: 'takeUpTime', label: '工单耗时' },
      { prop: 'bpmNodeCode', label: '工单状态', dict: 'WORK_BPM_NODE_CODE' },
      { prop: 'customEvaluation', label: '客户评价', dict: 'WORK_CUSTOM_EVALUATION' },
      { prop: 'followUp', label: '回访情况', dict: 'WORK_FOLLOW_UP' },
      {
        prop: 'action',
        label: '操作',
        width: 220,
        buttons: [
          {
            label: '补充',
            type: 'primary',
            text: true,
            onClick: ({ row }) => handleOpen('Supply', row, '95'),
            visible: ({ row }) => row.bpmNodeCode === '1001'
          },
          {
            label: '分拨',
            type: 'primary',
            text: true,
            onClick: ({ row }) => handleOpen('Allocation', row, '2'),
            visible: ({ row }) => row.bpmNodeCode === '1001'
          },
          {
            label: '派单',
            type: 'primary',
            text: true,
            onClick: ({ row }) => handleOpen('Dispatch', row, '3'),
            visible: ({ row }) => row.bpmNodeCode === '1100'
          },
          {
            label: '转派',
            type: 'primary',
            text: true,
            onClick: ({ row }) => handleOpen('Transfer', row, '4'),
            visible: ({ row }) => ['1200', '1300'].includes(row.bpmNodeCode)
          },
          {
            label: '处理',
            type: 'primary',
            text: true,
            onClick: ({ row }) => handleOpen('Handle', row, '6'),
            visible: ({ row }) => row.bpmNodeCode === '1200'
          },
          {
            label: '完成处理',
            type: 'primary',
            text: true,
            onClick: ({ row }) => handleOpen('FinishDeal', row, '8'),
            visible: ({ row }) => row.bpmNodeCode === '1300'
          },
          {
            label: '退回工单',
            type: 'primary',
            text: true,
            onClick: ({ row }) => handleOpen('Back', row, '5'),
            visible: ({ row }) => ['1100', '1200'].includes(row.bpmNodeCode)
          },
          {
            label: '关闭工单',
            type: 'primary',
            text: true,
            onClick: ({ row }) => handleOpen('Close', row, '0'),
            visible: ({ row }) => ['1001', '1100', '1200'].includes(row.bpmNodeCode)
          },
          {
            label: '完成',
            type: 'primary',
            text: true,
            onClick: ({ row }) => handleOpen('Finish', row, '99'),
            visible: ({ row }) => row.bpmNodeCode === '1400'
          },
          {
            label: '评价',
            type: 'primary',
            text: true,
            onClick: ({ row }) => handleOpen('Evaluate', row, '96'),
            visible: ({ row }) => row.bpmNodeCode === '1500' && !row.customEvaluation
          },
          {
            label: '回访',
            type: 'primary',
            text: true,
            onClick: ({ row }) => handleOpen('Visit', row, '97'),
            visible: ({ row }) => row.bpmNodeCode === '1500' && !row.followUp
          },
          {
            label: '打回工单',
            type: 'primary',
            text: true,
            onClick: ({ row }) => handleOpen('Repulse', row, '98'),
            visible: ({ row }) => row.bpmNodeCode === '1400'
          }
        ]
      }
    ],
    data: [{}]
  }
})

const queryTimeout = () => {
  orderQueryWorkTimeout(props.params).then((res) => {
    if (res.code === '200') {
      timeoutData.value = res.data
    }
  })
}
queryTimeout()

const handleOpen = (type: string, data: any, workAuditType = '', all = false) => {
  detailRef.value.open(type, data, workAuditType, all)
}
</script>

<style lang="scss" scoped>
.tip {
  margin-bottom: 10px;
  &_num {
    border: 1px solid #e5e5e5;
    line-height: 56px;
    &_title {
      display: inline-block;
      background: var(--system-primary-color);
      color: #fff;
      padding: 0 20px;
      margin-right: 30px;
    }
    &_cond {
      float: right;
      span {
        color: var(--system-primary-color);
        cursor: pointer;
      }
    }
  }
}
</style>
