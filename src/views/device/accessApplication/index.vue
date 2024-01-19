<template>
  <div class="list" v-if="cpnName === 'list'">
    <CnPage v-bind="props">
      <template #devAccessUnit="{ row }">
        {{ getUnitName(row.devAccessUnit) }}
      </template>
      <template #action="{ row }">
        <el-button type="text" @click="handleAction('detail', row)"> 查看 </el-button>
        <el-button
          v-if="row.auditCurrentStep === '100'"
          type="text"
          @click="handleAction('revoke', row)"
        >
          撤回
        </el-button>
      </template>
    </CnPage>
    <CnDialog ref="dialogRef" v-bind="dialogProps"> </CnDialog>
  </div>
  <div class="add" v-else-if="cpnName === 'add'">
    <Add :unitOptions="unitOptions" @success="cpnName = 'list'" @cancel="cpnName = 'list'"></Add>
  </div>
  <div class="detail" v-else-if="cpnName === 'detail'">
    <Detail @back="cpnName = 'list'" :id="detailId" :unitOptions="unitOptions!"></Detail>
  </div>
  <div class="import" v-else>
    <Import
      @cancel="cpnName = 'list'"
      @success="cpnName = 'list'"
      :unitOptions="unitOptions!"
    ></Import>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, toRaw, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'

import { useLoginStore } from '@/stores'

import CnPage from '@/components/cn-page/CnPage.vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'
import Add from './cpns/add/index.vue'
import Import from './cpns/import/index.vue'
import Detail from './cpns/detail/index.vue'

import getSearchConfig from './config/search-config'
import getTableConfig from './config/table-config'
import getTollbarConifg from './config/tollbar-config'

import type { ActionType } from './config/type'

import { getDevAccessApplyList, revokeDevApply } from '@/api/device'
import { getUnitList } from '@/api/admin'

const actionType = ref<ActionType>()
const cpnName = ref('list')
const tableSelection = ref<any[]>()
const detailId = ref('')
const dialogRef = ref<InstanceType<typeof CnDialog>>()
const dialogProps = reactive<CnPage.DialogProps>({})

const unitOptions = ref<CnPage.OptionProps[]>()

const userStore = useLoginStore()

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
  toolbar: getTollbarConifg(handleAction),
  table: getTableConfig(),
  pagination: {
    page: 1,
    size: 10
  }
})

function getUnitName(id: number) {
  if (unitOptions.value) {
    return unitOptions.value.find((v) => v.value === id)?.label ?? id
  } else {
    return id
  }
}

async function revokeAction(row: any) {
  try {
    const { userId, unitId } = userStore.userInfo
    const data = {
      handleDept: unitId + '',
      handleUser: userId
    }

    await revokeDevApply(row.id, data)
    ElMessage.success('操作成功')
    props.refresh = new Date().getTime()
  } catch (err) {}
}

// 显示添加/删除/标签弹窗
function handleAction(action: ActionType, row?: any) {
  actionType.value = action
  if (action === 'add' || action === 'import' || action === 'detail') {
    if (action === 'detail') detailId.value = row.id
    cpnName.value = action
  } else if (action === 'revoke') {
    revokeAction(row)
  }
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

:deep(.待审核) {
  color: #ff6600;
}
:deep(.同意) {
  color: #19b300;
}
:deep(.拒绝) {
  color: #f56c6c;
}
</style>
