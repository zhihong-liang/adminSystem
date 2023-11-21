import { createRouter, createWebHistory } from 'vue-router'
import Routes from './routes'
import Demo from './demo'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...Routes,
    ...(import.meta.env.MODE === 'development' ? Demo : [])
  ]
})

export default router
