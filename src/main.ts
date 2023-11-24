import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as ELIcons from "@element-plus/icons-vue";
import App from './App.vue'
import router from './router'

import './api/mock'

import 'normalize.css/normalize.css'  // 初始化样式
import 'element-plus/dist/index.css'  // 引入element-plus的样式
import './assets/styles/index.scss'   // 自定义样式
import 'nprogress/nprogress.css';

const app = createApp(App)

for (let iconName in ELIcons) {
    app.component(iconName, (ELIcons as any)[iconName]);
}

app.use(createPinia())
app.use(router)

app.mount('#app')
