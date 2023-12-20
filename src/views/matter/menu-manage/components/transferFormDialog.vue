<template>
  <CnDialog title="增加事项" width="70%" ref="dialogRef">
    <div class="transfer-form-dialog-root flex flex-around">
      <div>
        <h3>选择事项（共{{ leftTableProps.data.length }}项）</h3>
        <CnTable v-bind="leftTableProps" />
      </div>

      <div class="flex flex-center ml-lg mr-lg">
        <!-- <el-button
          type="primary"
          icon="Back"
          :disabled="buttons.left.disable"
          @click="buttons.left.onClick"
        /> -->
        <el-button
          type="primary"
          icon="Right"
          :disabled="buttons.right.disable"
          @click="buttons.right.onClick"
        />
      </div>

      <div>
        <h3>已选择{{ rightTableProps.data.length }}项</h3>
        <CnTable v-bind="rightTableProps" />
      </div>
    </div>

    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </CnDialog>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, reactive, ref } from 'vue'

import CnDialog from '@/components/cn-page/CnDialog.vue'
import CnTable from '@/components/cn-page/CnTable.vue'

const mockData = [
  {
    matterCode: '121',
    matterName: '某某事项办理',
    matterAlias: '社保清单打印',
    entryUnitText: '某某单位',
    handleType: '打印类',
    status: 1
  },
  {
    matterCode: '122',
    matterName: '某某事项办理',
    matterAlias: '社保清单打印',
    entryUnitText: '某某单位',
    handleType: '打印类',
    status: 1
  },
  {
    matterCode: '123',
    matterName: '某某事项办理',
    matterAlias: '社保清单打印',
    entryUnitText: '某某单位',
    handleType: '打印类',
    status: 1
  },
  {
    matterCode: '124',
    matterName: '某某事项办理',
    matterAlias: '社保清单打印',
    entryUnitText: '某某单位',
    handleType: '打印类',
    status: 1
  },
  {
    matterCode: '125',
    matterName: '某某事项办理',
    matterAlias: '社保清单打印',
    entryUnitText: '某某单位',
    handleType: '打印类',
    status: 1
  }
]

const DEFAULT_TABLE_COLUMNS = [
  { type: 'selection', width: '55' },
  { prop: 'matterCode', label: '事项编号' },
  { prop: 'matterName', label: '事项名称' },
  { prop: 'matterAlias', label: '事项别名', dict: 'MATTERS_MENU_LEVEL' },
  { prop: 'entryUnitText', label: '事项进驻单位', dict: 'MENU_STATUS' },
  { prop: 'handleType', label: '办理类型', dict: 'HANDLE_TYPE' },
  { prop: 'status', label: '事项状态', dict: 'START_STOP' },
  {
    prop: 'action',
    label: '操作',
    buttons: [{ label: '删除', type: 'primary', text: true, onClick: handleActionClick }]
  }
]

const leftTableProps = reactive<any>({
  data: [],
  columns: DEFAULT_TABLE_COLUMNS.filter((c) => c.prop !== 'action'),
  selectionChange: handleSelectionChange,
  selectedList: []
})

const rightTableProps = reactive<any>({
  data: [],
  columns: DEFAULT_TABLE_COLUMNS.filter((c) => !c.type)
})

const buttons = reactive({
  // left: {
  //   disable: computed(() => !rightTableProps.data.length),
  //   onClick: () => {}
  // },
  right: {
    disable: computed(() => !leftTableProps.selectedList.length),
    onClick: transferData4LeftForm
  }
})

function handleSelectionChange(selection: any) {
  leftTableProps.selectedList = selection
}

function transferData4LeftForm() {
  rightTableProps.data = leftTableProps.selectedList
}

function handleActionClick(params: any) {
  const { row } = params
  rightTableProps.data = rightTableProps.data.filter((t: any) => t.matterCode !== row.matterCode)
  console.log(leftTableProps.selectedList)
  // leftTableProps.selectedList = leftTableProps.selectedList.filter(
  //   (t: any) => t.matterCode !== row.matterCode
  // )
}

const dialogRef = ref()
function open() {
  dialogRef.value!.open()
}

function handleCancel() {}

function handleSubmit() {}

onBeforeMount(() => {
  leftTableProps.data = mockData
})

defineExpose({ open })
</script>

<style lang="scss" scoped></style>
