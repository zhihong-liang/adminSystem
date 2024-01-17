<template>
  <!-- <div class="list">
    <CnPage v-bind="props"> </CnPage>
    <CnDialog ref="dialogRef" v-bind="dialogProps"> </CnDialog>
  </div> -->
  <div class="add">
    <Add :unitOptions="unitOptions"></Add>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, toRaw, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'

import CnPage from '@/components/cn-page/CnPage.vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'
import Add from './cpns/add/index.vue'

import getSearchConfig from './config/search-config'
import getTableConfig from './config/table-config'
import getTollbarConifg from './config/tollbar-config'
import { getDialogConfig } from './config/dialog-config'

import type { ActionType } from './config/type'

import { getDevAccessApplyList } from '@/api/device'
import { getUnitList } from '@/api/admin'

const actionType = ref<ActionType>()

const tableSelection = ref<any[]>()

const dialogRef = ref<InstanceType<typeof CnDialog>>()
const dialogProps = reactive<CnPage.DialogProps>({})

const unitOptions = ref<CnPage.OptionProps[]>()

onMounted(async () => {
  const res = await getUnitList({ page: 1, size: 1000, obj: {} })
  unitOptions.value = res.rows.map((i) => ({ value: i.id, label: i.fullName }))
})

const props = reactive<CnPage.Props>({
  refresh: 0,
  init: undefined,
  params: {
    page: 1,
    size: 10
  },
  action: getDevAccessApplyList,
  search: getSearchConfig(computed(() => unitOptions.value)),
  toolbar: getTollbarConifg(showDialog),
  table: getTableConfig(showDialog, selectionChange),
  pagination: {
    page: 1,
    size: 10
  }
})

// 弹窗确定按钮的点击
function dialogSubmitSuccess() {
  props.refresh = new Date().getTime()
}

function selectionChange(selection: any[]) {
  tableSelection.value = selection
}

// 显示添加/删除/标签弹窗
function showDialog(action: ActionType, row?: any) {
  actionType.value = action
  const dialogConfig = getDialogConfig(action)({})
  for (const key of Object.keys(dialogConfig)) {
    dialogProps[key] = dialogConfig[key]
  }
  dialogRef.value?.open()
}
</script>

<style scoped lang="scss">
.deleteTitle {
  width: 100%;
  display: flex;
  font-size: 20px;
  justify-content: center;
  .labelName {
    color: #409eff;
  }
}
.btns {
  width: 100%;
  justify-content: center;
  display: flex;
}

.add {
  width: 1200px;
}
</style>
