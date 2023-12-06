/// <reference types="vite/client" />

declare module 'element-plus/dist/locale/zh-cn.mjs'

declare module '@wangeditor/editor-for-vue' {
  import { Editor } from 'node_modules/@wangeditor/editor-for-vue/dist/src'
  import { Toolbar } from 'node_modules/@wangeditor/editor-for-vue/dist/src'
  export { Editor, Toolbar }
}
