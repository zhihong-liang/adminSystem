<template>
  <div>查看<span @click="messageRef?.open()" style="color: var(--system-primary-color);cursor: pointer">《服务标准》</span></div>
  <el-row :gutter="20">
    <el-col :span="24" style="font-size: 22px">请选择工单类型</el-col>
    <el-col :span="8" v-for="(item, index) in list" :key="item.id">
      <el-card class="card" @click="openDialog(item)">
        <img class="card-img" :src="item.imgUrl" alt="粤智助开放平台" />
        <span>{{item.workTypeName}}</span>
      </el-card>
    </el-col>
  </el-row>

  <addOrder ref="orderRef" />
  <messageContext ref="messageRef" />
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import addOrder from './child/addOrder.vue'
import { getOrderType } from '@/api/order'
import messageContext from './child/messageContext.vue'

const messageRef = ref()
const orderRef = ref()
const list = ref([] as any)

const openDialog = (data: any) => {
  orderRef.value.open(data)
}

getOrderType({
  page: 1,
  size: 1000,
  obj: {}
}).then((res) => {
  if (res.code === '200') {
    list.value = res.rows
  }
})
</script>

<style lang="scss" scoped>
.card {
  font-size: 28px;
  cursor: pointer;
  &-img {
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
