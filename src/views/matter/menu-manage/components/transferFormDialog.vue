<template>
  <CnDialog :style="{width: 'fit-content'}" title="增加事项" ref="dialogRef">
    <div class="transfer-form-dialog-root flex flex-around">
      <div>
        <h3>选择事项（共{{ leftTableProps.data.length }}项）</h3>
        <CnTable v-bind="leftTableProps"> </CnTable>
      </div>

      <div class="flex flex-center ml-lg mr-lg">
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
import { computed, reactive, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { queryMatterRelationListThemeMenu, queryAddMatterRelationList } from '@/api/matter'

import CnDialog from '@/components/cn-page/CnDialog.vue'
import CnTable from '@/components/cn-page/CnTable.vue'
import type { MatterMenuRelation } from '../config/type'

const route = useRoute()
const emits = defineEmits(['onSuccess'])

const DEFAULT_TABLE_COLUMNS = [
  { type: 'selection' },
  { prop: 'matterCode', label: '事项编号' },
  { prop: 'matterName', label: '事项名称' },
  { prop: 'matterAlias', label: '事项别名', dict: 'MATTERS_MENU_LEVEL' },
  { prop: 'entryUnitText', label: '事项进驻单位', dict: 'MENU_STATUS' },
  { prop: 'handleType', label: '办理类型', dict: 'HANDLE_TYPE' },
  { prop: 'matterStatus', label: '事项状态', dict: 'START_STOP' },
  {
    prop: 'action',
    label: '操作',
    buttons: [{ label: '删除', type: 'primary', text: true, onClick: handleActionClick }]
  }
]

const leftTableProps = reactive<any>({
  data: [],
  columns: DEFAULT_TABLE_COLUMNS.filter((c) => c.prop !== 'action'),
  rowKey: 'id',
  reserveSelection: true,
  maxHeight: '500px',
  selectedList: [],
  selectionChange: (selection: any) => leftTableProps.selectedList = selection
})

const rightTableProps = reactive<any>({
  data: [],
  columns: DEFAULT_TABLE_COLUMNS.filter((c) => !c.type),
  maxHeight: '500px'
})

const buttons = reactive({
  right: {
    disable: computed(() => !leftTableProps.selectedList.length),
    onClick: () => rightTableProps.data = leftTableProps.selectedList
  }
})

function handleActionClick(params: any) {
  const { row } = params
  rightTableProps.data = rightTableProps.data.filter((t: any) => t.matterCode !== row.matterCode)
}

function handleCancel() {
  reset()
  close()
}

function reset() {
  leftTableProps.selectedList = []
  rightTableProps.data = []
}

function handleSubmit() {
  const params = rightTableProps.data.map((matter: MatterMenuRelation) => ({
    ...matter,
    menuId: route.query.id,
  }))

  queryAddMatterRelationList(params).then((res) => {
    if (res.code === '200') {
      emits('onSuccess')
      close()
    }
  })
}

function getMatterMenuList() {
  queryMatterRelationListThemeMenu({ menuId: route.query.id } as any).then((res) => {
    if (res.code === '200') {
      leftTableProps.data = res.data
    }
  })
}

const dialogRef = ref()
function open() {
  dialogRef.value!.open()
  getMatterMenuList()
}
function close() {
  dialogRef.value!.close()
}

defineExpose({ open })
</script>

<style lang="scss" scoped></style>
