<template>
  <CnSearch
    v-bind="search"
    :model="params"
    @search="handleQuery()"
    @reset="handleQuery()"
  />
  <div class="role-list">
    <div class="add-card pointer" @click="handleAdd">
      <el-icon class="add-icon"><Plus /></el-icon>
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
  <Deal ref="dealRef" />
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import CnSearch from "@/components/cn-page/CnSearch.vue";
import { Plus } from "@element-plus/icons-vue";
import Deal from "./deal.vue";
import { getRoleList, sysRoleRemoveIids } from "@/api/admin";

// 搜索
const inited = ref(false);
const search = ref({
  items: [
    { label: "主类", prop: "type", component: "input" },
    { label: "角色状态", prop: "status", component: "select" },
  ],
});
const roleList = ref();
onMounted(() => {
  getData()
});
const params = ref();
const handleQuery = () => {};

const dealRef = ref();
const getData = () => {
  const params = {
    obj: {},
    page: 1,
    size: 999,
  };
  getRoleList(params).then((res: any) => {
    roleList.value = res.rows;
  });
}
// 新增
const handleAdd = () => {
  dealRef.value.open();
};
// 修改、查看
const handleModify = (data: any, type: string) => {
  dealRef.value.open(data, type);
};
// 删除
const handleDet = (row: { id: Record<string, unknown>; }) => {
  console.log(row);
  ElMessageBox.confirm("确定要删除该角色吗？", "提示", {
    type: "warning",
    closeOnClickModal: false,
    confirmButtonText: "确定",
  }).then(() => {
    sysRoleRemoveIids(row.id).then((res) => {
      if (res.code === "200") {
        ElMessage({
          type: "success",
          message: res.message,
        });
        getData()
      }
    });
  });
};
</script>

<style scoped lang="scss">
.role-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  .box-card {
    width: 200px;
    height: 160px;
    .card-content {
      height: 100px;
    }
  }
}
.add-card {
  width: 200px;
  height: 160px;
  border: 1px dashed #e4e7ed;
  display: flex;
  justify-content: center;
  align-items: center;
  .add-icon {
    font-size: 40px;
    color: rgba(0, 0, 0, 0.45);
  }
}
.role-card {
  width: 200px;
  height: 160px;
  box-shadow: var(--el-box-shadow-light);
  border-radius: 4px;
  border: 1px solid #e4e7ed;
  background-color: #fff;
  overflow: hidden;
  color: #303133;
  transition: 0.3s;
  box-sizing: border-box;
  padding: 2px;

  .role-main {
    height: 75%;
    overflow: hidden;
    border-bottom: 1px solid #e8e8e8;
    box-sizing: border-box;
    .role-name {
      text-align: center;
      font-weight: bold;
      margin-top: 15px;
    }
    .role-desc {
      padding: 10px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
    }
  }
  .card-footer {
    height: 25%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    text-align: center;
    .card-footer-item {
      flex: 1;
      padding: 2px;
      border-right: 1px solid #e8e8e8;
      font-size: 14px;
      &:last-child {
        border: none;
      }
      &.card-show {
        color: #67c23a;
      }
      &.card-edit {
        color: #409eff;
      }
      &.card-del {
        color: #f56c6c;
      }
    }
  }
}
</style>
