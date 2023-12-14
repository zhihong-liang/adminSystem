import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import * as ElIcons from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import moment from 'moment'
// import './api/mock'

import 'normalize.css/normalize.css' // 初始化样式
import 'element-plus/dist/index.css' // 引入element-plus的样式
import './assets/styles/index.scss' // 自定义样式
import 'nprogress/nprogress.css'

moment.locale('zh-cn')

const app = createApp(App)
axios.defaults.baseURL = '/selfHelp'

for (let iconName in ElIcons) {
  app.component(iconName, (ElIcons as any)[iconName])
}

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

app.mount('#app')
