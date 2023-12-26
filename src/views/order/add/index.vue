<template>
  <div>查看<span style="color: var(--system-primary-color)">《服务标准》</span></div>
  <el-row :gutter="20">
    <el-col :span="24" style="font-size: 22px">请选择工单类型</el-col>
    <el-col :span="8">
      <el-card class="card" @click="openDialog('yw', '运维工单')">
        <img class="card-img" src="@/assets/images/logo.png" alt="粤智助开放平台" />
        <span>运维工单</span>
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card class="card" @click="openDialog('hc', '耗材工单')">
        <img class="card-img" src="@/assets/images/logo.png" alt="粤智助开放平台" />
        <span>耗材工单</span>
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card class="card" @click="openDialog('az', '安装工单')">
        <img class="card-img" src="@/assets/images/logo.png" alt="粤智助开放平台" />
        <span>安装工单</span>
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card class="card" @click="openDialog('sj', '升级工单')">
        <img class="card-img" src="@/assets/images/logo.png" alt="粤智助开放平台" />
        <span>升级工单</span>
      </el-card>
    </el-col>
  </el-row>

  <addDetail ref="detailRef" />
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue';
import addDetail from './child/addDetail.vue'

const detailRef = ref()
const openDialog = (type: string, title: string) => {
  detailRef.value.open(type, title)
}
</script>

<style lang="scss" scoped>
.card {
    font-size: 28px;
    cursor: pointer;
    &-img{
        width: 95px;
        vertical-align: middle;
        margin-right: 20%;
    }
}
.el-col {
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>
