<template>
  <div class="search">
    <CnSearch
      v-bind="search"
      :model="search.params"
      @search="handleQuery()"
      @reset="handleQuery()"
    />
  </div>

  <div class="role-list">
    <div class="add-card pointer" @click="handleAdd">
      <el-icon class="add-icon"><Plus /></el-icon>
      <div class="add-role">新增角色</div>
    </div>
    <div class="role-card" v-for="(item, index) in roleList" :key="index">
      <div class="role-main">
        <div class="role-name">
          {{ item.name }}
        </div>
        <div class="role-desc">{{ item.description }}</div>
      </div>
      <div class="card-footer">
        <div class="card-footer-item card-show pointer" @click="handleModify(item, 'view')">
          查看
        </div>
        <div
          class="card-footer-item card-edit pointer"
          @click="handleModify(item, 'modify')"
          v-if="item.id !== 1"
        >
          修改
        </div>
        <div
          class="card-footer-item card-del pointer"
          @click="handleDet(item)"
          v-if="item.isSys !== '1'"
        >
          删除
        </div>
      </div>
    </div>
  </div>

  <Deal
    ref="dealRef"
    @success="
      () => {
        getData()
      }
    "
  />
</template>

<script setup lang="ts">
import { reactive, ref, onUnmounted, onBeforeMount, onMounted } from 'vue'
import CnSearch from '@/components/cn-page/CnSearch.vue'
import { Plus } from '@element-plus/icons-vue'
import Deal from './deal.vue'
import { getRoleList, sysRoleRemoveIids } from '@/api/admin'
import { useHomeStore } from '@/stores/home'

const { updateContainerStyle } = useHomeStore()
// 搜索
const inited = ref(false)
const search = ref({
  params: {},
  items: [
    { label: '角色名称', prop: 'name', component: 'input' },
    { label: '状态', prop: 'status', component: 'select', dict: 'ROLE_STATUS' }
  ]
})
const roleList = ref()
onMounted(() => {
  getData()
})

const handleQuery = () => {
  getData(search.value.params)
}

const dealRef = ref()
const getData = (obj = {}) => {
  const params = {
    obj: obj,
    page: 1,
    size: 999
  }
  getRoleList(params).then((res: any) => {
    roleList.value = res.rows
  })
}
// 新增
const handleAdd = () => {
  dealRef.value.open()
}
// 修改、查看
const handleModify = (data: any, type: string) => {
  dealRef.value.open(data, type)
}
// 删除
const handleDet = (row: { id: Record<string, unknown> }) => {
  ElMessageBox.confirm('确定要删除该角色吗？', '提示', {
    type: 'warning',
    closeOnClickModal: false,
    confirmButtonText: '确定'
  }).then(() => {
    sysRoleRemoveIids(row.id).then((res) => {
      if (res.code === '200') {
        ElMessage({
          type: 'success',
          message: res.message
        })
        getData()
      }
    })
  })
}

onBeforeMount(() => {
  updateContainerStyle({
    'background-color': 'var(--system-container-background)',
    padding: '0px'
  })
})
onUnmounted(() => {
  updateContainerStyle({})
})
</script>

<style scoped lang="scss">
.search {
  background: #fff;
  padding: 20px;
  border-radius: 6px;
}
.role-list {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;

  gap: 20px;
  .box-card {
    width: 200px;
    height: 160px;
    box-sizing: border-box;
    overflow: hidden;
    .card-content {
      height: 100px;
    }
  }
}
.add-card {
  width: 222px;
  height: 160px;
  box-sizing: border-box;
  background: #ffffff;
  box-shadow: 0px 2px 6px 0px #dfe1e3;
  border-radius: 6px;
  overflow: hidden;
  color: #303133;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #165dff;
  .add-icon {
    font-size: 40px;
    font-weight: bold;
  }
  .add-role {
    line-height: 30px;
  }
}
.role-card {
  box-sizing: border-box;
  margin-bottom: 15px;
  width: 226px;
  height: 156px;
  background: #ffffff;
  box-shadow: 0px 2px 6px 0px #dfe1e3;
  border-radius: 6px;
  overflow: hidden;
  color: #303133;
  transition: 0.3s;
  box-sizing: border-box;
  padding: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .role-main {
    height: 70%;
    overflow: hidden;
    box-sizing: border-box;
    .role-name {
      text-align: center;
      font-weight: bold;
      margin-top: 15px;
    }
    .role-desc {
      padding: 10px 20px;
      font-size: 14px;
      color: #4e5969;
      line-height: 22px;
      display: inline-block;
      margin: 0 auto;
    }
  }
  .card-footer {
    height: 30%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    text-align: center;
    gap: 10px;

    .card-footer-item {
      flex: 1;
      padding: 2px;
      width: 60px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;

      border-radius: 6px;
      &:last-child {
        border: none;
      }
      &.card-show {
        background: #dae5ff;
        color: #165dff;
      }
      &.card-edit {
        background: #ffefdd;
        color: #ff9a2e;
      }
      &.card-del {
        background: #f2b8b8;
        color: #ec3535;
      }
    }
  }
}
</style>
