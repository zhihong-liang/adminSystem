import { createRouter, createWebHistory } from 'vue-router'
import { start, close } from '@/utils/nprogress'
import Routes from './routes'
import Demo from './demo'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...Routes,
    ...(import.meta.env.MODE === 'development' ? Demo : [])
  ]
})


router.beforeEach(() => {
  start();
})

router.afterEach(() => {
  close();
})

export default router
