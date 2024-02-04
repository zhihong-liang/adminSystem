<template>
  <CnDialog title="导出" ref="dialogRef">
    <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange"
      >全选</el-checkbox
    >

    <CnDict
      v-model="checkItems"
      component="checkbox"
      :options="dictList"
      @change="handleCheckedCitiesChange"
    />

    <template #footer>
      <el-button @click="dialogRef?.close()">取消</el-button>
      <el-button type="primary" @click="handleExport()">提交</el-button>
    </template>
  </CnDialog>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'
import useDictionary from '@/hooks/useDictionary'
import { ElMessage } from 'element-plus'

const checkAll = ref(false)
const isIndeterminate = ref(true)
const checkAllValue = ref()

interface dictTs {
  value: string
  label: string
}
const dictList = ref([])
const dict = ref()
const options = ref()
const action = ref() // 接口
const paramType = ref('columns') // 2种传参格式：columns,filedNameList
const otherParams = ref({} as Record<string, unknown>) // 搜索条件，列表id，其他自定义参数
const fileName = ref() // 导出文件名称

const dialogRef = ref()
const checkItems = ref<string[]>([])

watchEffect(() => {
  dictList.value = dict.value ? useDictionary(dict.value).value : options.value
  checkAllValue.value = dictList.value?.map((v: dictTs) => v.value) || []
})

const open = (data: any) => {
  checkItems.value = []

  dict.value = data.dict
  options.value = data.options
  action.value = data.action
  paramType.value = data.paramType || 'columns'
  otherParams.value = data.otherParams
  fileName.value = data.fileName

  dialogRef.value.open()
}
defineExpose({ open })

const handleCheckAllChange = (val: boolean) => {
  checkItems.value = val ? checkAllValue.value : []
  isIndeterminate.value = false
}

const handleCheckedCitiesChange = (value: string[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === checkAllValue.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < checkAllValue.value.length
}

const handleExport = () => {
  if (checkItems.value.length === 0) {
    ElMessage.error('请选择导出字段！')
    return
  }
  const filedNameList = dictList.value
    .filter((v: dictTs) => checkItems.value.includes(v.value))
    .map((v: dictTs) => v.label)

  let params = {}
  if (paramType.value === 'filedNameList') {
    params = {
      filedList: checkItems.value,
      filedNameList,
      ...otherParams.value
    }
  } else {
    params = {
      columns: checkItems.value,
      ...otherParams.value
    }
  }

  if (action.value) {
    action.value(params).then((res: any) => {
      let blob = new Blob([res.data], {
        type: res.headers['content-type'] || 'application/vnd.ms-excel'
      })
      let downloadElement = document.createElement('a')
      let href = window.URL.createObjectURL(blob) //创建下载的链接
      downloadElement.href = href
      downloadElement.download = fileName.value + ".xls" //下载后文件名
      document.body.appendChild(downloadElement)
      downloadElement.click() //点击下载
      document.body.removeChild(downloadElement) //下载完成移除元素
      window.URL.revokeObjectURL(href) //释放掉blob对象
    })

    dialogRef.value.close()
  }
}
</script>
