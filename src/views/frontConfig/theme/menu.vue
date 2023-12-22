<template>
  <CnDialog v-bind="dialogProps" ref="dialogRef" style="min-width: 85%">
    <template #addmenu>
      <div class="wrap" v-loading="loading">
        <div class="table-left">
          <el-table
            ref="tableRef"
            :data="tableData1"
            style="width: 100%"
            max-height="700px"
            row-key="mattersMenuId"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="40" :reserve-selection="true" />
            <el-table-column prop="menuName" label="菜单名称" width="250" />
            <el-table-column prop="mattersCount" label="包含事项数" width="100" />
            <el-table-column prop="remark" label="备注" />
          </el-table>
          <!-- <CnPagination v-bind="pagination" :total="total" @update="handleQuery" /> -->
        </div>
        <div class="table-icon">
          <el-icon>
            <DArrowRight />
          </el-icon>
        </div>
        <div class="table-right">
          <el-table
            :data="tableData2"
            style="width: 100%"
            max-height="700px"
            row-key="mattersMenuId"
          >
            <el-table-column prop="menuName" label="菜单名称" width="250" />
            <el-table-column prop="mattersCount" label="包含事项数" width="100" />
            <el-table-column prop="remark" label="备注" />
            <el-table-column label="操作" fixed="right" width="90">
              <template #default="{ row }">
                <el-button text type="danger" @click="hanldeDelItem(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </template>
  </CnDialog>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick, watch, onMounted, computed } from 'vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'
import CnTable from '@/components/cn-page//CnTable.vue'
import { getThemeLabelMenuList, mattersThemeMenuRelationAddList } from '@/api'
import { DArrowRight } from '@element-plus/icons-vue'
const dialogProps = reactive({
  title: '添加菜单',
  formProps: {
    model: {},
    items: [{ label: '', component: 'slot', prop: 'addmenu' }],
    colSpan: 24,
    rules: {}
  },
  action: () => {
    setData(tableData2.value)
    function setData(tree) {
      console.log('tree: ', tree)
      tree.forEach((item) => {
        if (item.children && item.children.length) {
          item.relationList = item.children
          setData(item.children)
        }
      })
    }
    return mattersThemeMenuRelationAddList(tableData2.value)
  }
})

const dialogRef = ref()
let menuParams = {}
const open = (val) => {
  menuParams = val
  dialogRef.value.open()
  tableData2.value = []
  getTable1List()
}
defineExpose({ open })

// table1
const loading = ref(false)
const tableRef = ref()
const tableData1 = ref([])
let tableDataClone: any = []
const pagination = ref({
  page: 1,
  size: 999
})
const total = ref(0)
const getTable1List = () => {
  loading.value = true
  getThemeLabelMenuList({
    page: pagination.value.page,
    size: pagination.value.size,
    obj: {
      labelId: menuParams.labelId,
      themeId: menuParams.themeId
    }
  })
    .then((res) => {
      console.log('res: ', res)
      tableData1.value = res.rows
      tableDataClone = JSON.parse(JSON.stringify(res.rows))
      total.value = res.total
    })
    .finally(() => {
      loading.value = false
    })
}
// const handleQuery = (currentPage?: number, pageSize?: number) => {
//   if (currentPage) pagination.value.page = currentPage
//   if (pageSize) pagination.value.size = pageSize
//   getTable1List()
// }

let ids: string[] = [] // 保存选中的id
const handleSelectionChange = (val: any) => {
  ids = val.map((item: any) => item.mattersMenuId)
  setTabledata2()
}

const setCloneData = (data: any) => {
  data.forEach((item: any) => {
    if (ids.includes(item.mattersMenuId)) {
      item.checked = true
    } else {
      item.checked = false
    }
    if (item.children && item.children?.length) {
      setCloneData(item.children)
    }
  })
}

const filterData = (data) => {
  for (let i = 0; i < data.length; i++) {
    if (!data[i].checked) {
      data.splice(i, 1)
      i--
    } else {
      if (data[i].children) {
        filterData(data[i].children)
      }
    }
  }
}

// 回显
const resetRow = (id) => {
  // 在tabledata1里找row
  let row = treeFind(tableData1.value, (data: any) => {
    return data.mattersMenuId == id
  })
  tableRef.value.toggleRowSelection(row)
}

const treeFind = (tree: any, func: any) => {
  for (const data of tree) {
    if (func(data)) return data
    if (data.children) {
      const res = treeFind(data.children, func)
      if (res) return res
    }
  }
  return null
}

// table2
const setTabledata2 = () => {
  setCloneData(tableDataClone)
  let _clone = JSON.parse(JSON.stringify(tableDataClone))
  filterData(_clone)
  tableData2.value = _clone
}

const tableData2 = ref([])
const hanldeDelItem = (row: any) => {
  ids = ids.filter((item) => item !== row.mattersMenuId)
  setTabledata2()
  // 对table1的回显
  // tableRef.value.toggleRowSelection(tableData1.value[0].children[0])
  resetRow(row.mattersMenuId)
}
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  width: 100%;

  .table-left {
    width: calc(50% - 20px);
    // border: 1px solid #ebeef5;
  }
  .table-icon {
    flex: 1;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .table-right {
    width: calc(50% - 20px);
    // border: 1px solid #ebeef5;
  }
}
</style>
