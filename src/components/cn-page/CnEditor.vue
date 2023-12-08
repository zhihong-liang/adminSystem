<template>
  <div style="border: 1px solid #ccc">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="props.toolbarConfig"
    />
    <Editor
      :style="{ height: props.height, 'overflow-y': 'hidden' }"
      v-model="valueHtml"
      :defaultConfig="props.editorConfig"
      @onCreated="handleCreated"
    />
  </div>
</template>

<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { computed, onBeforeUnmount, shallowRef, withDefaults } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import type { IToolbarConfig, IDomEditor } from '@wangeditor/editor'
import type { IEditorConfig } from '@wangeditor/editor'

interface Props {
  height?: string
  modelValue: string | undefined
  toolbarConfig?: Partial<IToolbarConfig>
  editorConfig?: Partial<IEditorConfig>
}

const props = withDefaults(defineProps<Props>(), {
  height: '300px'
})

const emit = defineEmits(['update:modelValue'])

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef<IDomEditor>()

// 内容 HTML
const valueHtml = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor: any) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}
</script>

<style scoped></style>
