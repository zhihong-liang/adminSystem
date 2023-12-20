<template>
  <div>已选权限</div>
  <CnTable v-bind="tableProp" style="margin:0 0 15px" />
</template>

<script lang="ts" setup>
import { reactive, ref, defineProps, PropType, watch } from 'vue'
import CnTable from '@/components/cn-page/CnTable.vue'

const props = defineProps({
  data: {
    type: Array as PropType<any[]>,
    default: () => []
  }
})

const tableProp = reactive<CnPage.TableProps<User>>({
  columns: [
    { type: 'index', label: '序号', width: 60 },
    { label: '区域', prop: 'areaName' },
    { label: '授权', prop: 'authName', dict: 'DATA_PERMISSION_POLICY' },
  ],
  data: props.data
})

watch(() => props.data, (val) => {
  tableProp.data = val
})

</script>
