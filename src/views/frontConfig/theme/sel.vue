<template>
  <CnDialog v-bind="dialogProps" ref="dialogRef" @success="onSuccess" width="60%">
    <template #tabs>
      <div class="tab-list">
        <span v-for="(item, index) in tabs">
          <div
            v-if="item.showTab"
            class="mx-1 pointer tab-item"
            :class="{ checked: tabIndex == index }"
            :key="index"
            closable
            effect="plain"
            type="info"
            size="large"
            :disable-transitions="false"
            @click="onTabClick(index)"
            @dblclick="handleEditTab(item, index)"
          >
            <div class="item-close pointer" @click.stop="handleClose(item, index)">
              <el-icon><Close /></el-icon>
            </div>
            <span>{{ item.labelName }}</span>
            <!-- <el-icon><QuestionFilled /></el-icon> -->
          </div>
          <el-input
            v-else
            v-model="item.labelName"
            :ref="
              (el: any) => {
                inputs[index] = el
              }
            "
            class="ml-1 w-20 inputwidth"
            size="small"
            @keyup.enter="handleTabConfirm(item)"
            @blur="handleTabConfirm(item)"
          />
        </span>
        <el-input
          v-if="inputAddVisible"
          ref="AddInputRef"
          v-model="inputAddValue"
          class="ml-1 w-20 inputwidth"
          size="small"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
        />
        <el-button size="small" v-else @click="showAddInput" style="position: relative">
          + 添加标签
        </el-button>
      </div>
    </template>
    <template #addmenu>
      <el-button type="primary" @click="hanldeAddMenu" :disabled="tabs.length == 0">
        选择菜单
      </el-button>
      <el-table
        :data="tableData"
        ref="tableRef"
        style="width: 100%"
        row-key="id"
        lazy
        :load="load"
        :tree-props="{ children: 'children', hasChildren: 'open' }"
      >
        <el-table-column prop="menuCode" label="菜单编号" width="200" />
        <el-table-column prop="menuName" label="菜单名称" />
        <el-table-column prop="mattersCount" label="包含事项数" width="100" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="sort" label="排序" width="120" fixed="right">
          <template #default="{ row }">
            <div class="sort">
              <el-icon class="pointer" style="font-size: 1.3em" @click="setSortDown(row)">
                <SortDown />
              </el-icon>
              <el-icon class="pointer" style="font-size: 1.3em" @click="setSortUp(row)">
                <SortUp />
              </el-icon>
              <span
                class="pointer"
                v-if="!row.parentId && !row.menuSortTop"
                @click="setTop(row, true)"
              >
                置顶
              </span>
              <span
                class="pointer"
                v-if="!row.parentId && row.menuSortTop"
                @click="setTop(row, false)"
              >
                取消置顶
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="opera" label="操作" width="90" fixed="right">
          <template #default="{ row }">
            <el-button type="danger" text @click="delMenu(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <CnPagination v-bind="pagination" :total="total" @update="handleQuery" />
    </template>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
    </template>
  </CnDialog>
  <Menu ref="menuRef" @success="hanldeGetMenuFromSel" />
</template>

<script setup lang="ts">
import { reactive, ref, nextTick, watch, onMounted, computed, getCurrentInstance } from 'vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'
import CnTable from '@/components/cn-page//CnTable.vue'
import { SortDown, SortUp, Upload } from '@element-plus/icons-vue'
import Menu from './menu.vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  mattersThemeLabelList,
  addMattersThemeLabel,
  editMattersThemeLabel,
  delMattersThemeLabel,
  mattersThemeMenuRelationListPage,
  mattersThemeMenuRelationList,
  delMattersThemeMenuRelation,
  mattersThemeMenuRelationTop,
  mattersThemeMenuRelationUp,
  mattersThemeMenuRelationDown
} from '@/api'

const handleCancel = () => {
  dialogRef.value.close()
}
const formData = ref({})
const dialogProps = reactive({
  title: '新增',
  formProps: {
    labelSuffix: '：',
    model: computed(() => formData.value),
    items: [
      { label: '包含菜单数', prop: 'menuCount', span: 12 },
      { label: '使用设备数', prop: 'devCount', span: 12 },
      { label: '创建人', prop: 'createUser', span: 12 },
      { label: '创建时间', prop: 'createTime', span: 12 },
      { label: '主题编号', prop: 'themeCode', span: 12 },
      { label: '主题名称', prop: 'themeName', span: 12 },
      { label: '状态', prop: 'status', dict: 'START_STOP', span: 12 },
      { label: '备注', prop: 'remark', span: 12 },
      { label: '', component: 'slot', prop: 'tabs' },
      { label: '', component: 'slot', prop: 'addmenu' }
    ],
    colSpan: 24,
    rules: {
      themeName: [{ required: true, message: '请输入主题名称' }]
    }
  }
})

const dialogRef = ref()
const open = (row: any) => {
  formData.value = row
  dialogRef.value.open()
  initDia()
}
defineExpose({ open })

const initDia = () => {
  tableData.value = []
  getTabList(() => {
    tabIndex.value = 0
    getMenuFromLabel()
  })
}

// tabs
const tabs: any = ref([])
let timer = null
const getTabList = (func = () => {}) => {
  mattersThemeLabelList({ themeId: formData.value.id }).then((res) => {
    tabs.value = res.data.map((item: any) => {
      return {
        ...item,
        showTab: true,
        checked: true
      }
    })
    func && func()
  })
}
// 点击选中 tab
const onTabClick = (index: any) => {
  if (timer) {
    clearTimeout(timer)
  }
  // 设置延时器 超过300ms为单击 300ms内点击则为双击事件
  timer = setTimeout(() => {
    tabIndex.value = index
    getMenuFromLabel()
  }, 300)
}
// tab add
const inputAddVisible = ref(false)
const inputAddValue = ref('')
const AddInputRef = ref()
const tabIndex = ref(0)

const handleInputConfirm = () => {
  // 添加 tab
  inputAddVisible.value = false
  if (!inputAddValue.value) return
  addMattersThemeLabel({
    themeId: formData.value.id,
    labelName: inputAddValue.value
  }).then(() => {
    ElMessage.success('操作成功')
    getTabList()
  })
}
const showAddInput = () => {
  inputAddVisible.value = true
  inputAddValue.value = ''
  nextTick(() => {
    AddInputRef.value.input.focus()
  })
}
// tab close
const handleClose = (item, index) => {
  ElMessageBox.confirm(`确定要删除${item.labelName}?`, {
    title: '删除',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  }).then(() => {
    delMattersThemeLabel(item.id).then((res) => {
      ElMessage.success('操作成功')
      getTabList()
      if (tabIndex.value == index) {
        tabIndex.value = 0
        pagination.value = {
          page: 1,
          size: 10
        }
        getMenuFromLabel()
      }
    })
  })
}
// tab edit
const inputs = ref([])
let oldItemLabelName: string = ''
const handleEditTab = (item: any, index: number) => {
  // 双击
  if (timer) {
    // 清除延时器
    clearTimeout(timer)
  }
  // 需要执行的逻辑代码...

  item.showTab = false
  nextTick(() => {
    inputs.value[index].focus()
  })
  oldItemLabelName = item.labelName
}

const handleTabConfirm = (item: any) => {
  item.showTab = true
  if (oldItemLabelName == item.labelName) return
  editMattersThemeLabel({
    ...item,
    id: item.id,
    labelName: item.labelName
  }).then((res) => {
    ElMessage.success('修改成功')
    getTabList()
  })
}

// 菜单
const tableData = ref([])
const tableRef = ref()

const pagination = ref({
  page: 1,
  size: 10
})
const total = ref(0)
const menuRef = ref()
const hanldeAddMenu = () => {
  let menuParams = {
    labelId: tabs.value[tabIndex.value].id,
    themeId: formData.value.id
  }
  menuRef.value.open(menuParams)
}
// 菜单选中返回
const hanldeGetMenuFromSel = () => {
  tableData.value = []
  getMenuFromLabel()
}

// 获取当前标签的菜单
const getMenuFromLabel = (func = () => {}) => {
  mattersThemeMenuRelationListPage({
    page: pagination.value.page,
    size: pagination.value.size,
    obj: {
      labelId: tabs.value[tabIndex.value].id,
      themeId: formData.value.id
    }
  }).then((res) => {
    tableData.value = res.rows
    total.value = res.total
    func && func()
  })
}

const handleQuery = () => {
  getMenuFromLabel()
}
const loadMap = new Map()
const load = (row: any, treeNode: unknown, resolve: () => void) => {
  loadMap.set(row.id, { row, treeNode, resolve })
  mattersThemeMenuRelationList({
    parentId: row.id,
    labelId: tabs.value[tabIndex.value].id,
    themeId: formData.value.id
  }).then((res: any) => {
    resolve(res.data)
  })
}

// 删除菜单
const delMenu = (item) => {
  console.log('row: ', item.parentId)
  ElMessageBox.confirm(`确定要删除${item.menuName}?`, {
    title: '删除',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  }).then(() => {
    delMattersThemeMenuRelation(item.id).then(() => {
      ElMessage.success({ message: '删除成功' })
      getMenuFromLabel(() => {
        if (item.parentId) {
          const { row, treeNode, resolve } = loadMap.get(item.parentId)
          if (tableRef.value.store.states.lazyTreeNodeMap.value[item.parentId].length > 1) {
            //说明该节点下有多个子节点
            load(row, treeNode, resolve)
          }
        }
      })
    })
  })
}

// 置顶菜单
const setTop = (row: any, status: boolean) => {
  ElMessageBox.confirm(`确定要${status ? '置顶' : '取消置顶'}${row.menuName}?`, {
    title: '删除',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  }).then(() => {
    mattersThemeMenuRelationTop(row.id, { isTop: status }).then(() => {
      ElMessage.success({ message: '操作成功' })
      getMenuFromLabel()
    })
  })
}

// 排序上升
const setSortUp = (item: any) => {
  mattersThemeMenuRelationUp(item.id).then(() => {
    ElMessage.success({ message: '操作成功' })
    getMenuFromLabel(() => {
      if (item.parentId) {
        const { row, treeNode, resolve } = loadMap.get(item.parentId)
        if (tableRef.value.store.states.lazyTreeNodeMap.value[item.parentId].length > 1) {
          //说明该节点下有多个子节点
          load(row, treeNode, resolve)
        }
      }
    })
  })
}

// 排序上升
const setSortDown = (item: any) => {
  mattersThemeMenuRelationDown(item.id).then(() => {
    ElMessage.success({ message: '操作成功' })
    getMenuFromLabel(() => {
      if (item.parentId) {
        const { row, treeNode, resolve } = loadMap.get(item.parentId)
        if (tableRef.value.store.states.lazyTreeNodeMap.value[item.parentId].length > 1) {
          //说明该节点下有多个子节点
          load(row, treeNode, resolve)
        }
      }
    })
  })
}
</script>

<style lang="scss" scoped>
.tab-list {
  display: flex;
  gap: 8px;
  flex-direction: wrap;
  align-items: center;
  flex-wrap: wrap;
  border-bottom: 1px solid #dcdfe6;
  width: 100%;
  .tab-item {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border: 1px solid #dcdfe6;
    border-bottom: none;
    padding: 0 5px;
    position: relative;
    .item-close {
      background: #f56c6c;
      color: #fff;
      position: absolute;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      top: -7px;
      right: -7px;
      font-size: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
.checked {
  background: #409eff;
  color: #fff;
  &:deep(.el-icon) {
    color: #fff;
  }
}

.inputwidth {
  width: 100px;
}

.sort {
  display: flex;
  gap: 5px;
  align-items: center;
}
</style>
