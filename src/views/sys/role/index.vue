<template>
  <CnSearch v-bind="search" :model="params" @search="handleQuery()" @reset="handleQuery()" />
  <div class="role-list">
    <el-card class="box-card" v-for="item in 12">
      <div>card</div>
      <template #footer>Footer cdfdfdfdfontent</template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import CnSearch from '@/components/cn-page/CnSearch.vue'

// 搜索
const inited = ref(false)
const search = ref({
  items: [
    { label: '主类', prop: 'type', component: 'input' },
    { label: '角色状态', prop: 'status', component: 'select' }
  ]
})
const params = ref()
const handleQuery = () => {}
</script>

<style scoped lang="scss">
.role-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  .box-card {
    width: 200px;
    height: 180px;
  }
}
</style>
