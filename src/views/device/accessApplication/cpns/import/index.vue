<template>
  <div class="export">
    <div class="header">
      <el-upload
        v-model:file-list="fileList"
        class="upload-demo"
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
      >
        <el-button type="primary" size="large">导入</el-button>
      </el-upload>
      <div class="desc">
        <div class="download">请先<span>下载模板</span></div>
        <div>仅支持 .xls / .xlsx文件格式 ，文件大小不能超过 10.0 MB</div>
      </div>
    </div>
  </div>
  <div class="footer">
    <el-button type="primary" size="large">撤回</el-button>
    <el-button size="large" @click="emits('cancel')">取消</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const fileList = ref<any[]>([])

const emits = defineEmits(['cancel', 'success'])
</script>

<style scoped lang="scss">
.header {
  display: flex;
  .desc {
    margin-left: 10px;
    .download {
      > span {
        color: #3399ff;
        cursor: pointer;
      }
    }
  }
}

.footer {
  margin-top: 30px;
}
</style>
