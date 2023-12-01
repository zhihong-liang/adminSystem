import { createRouter, createWebHistory } from 'vue-router'
import { start, close } from '@/utils/nprogress'
import { useHomeStore } from '@/stores/home'
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

router.afterEach((to, from) => {
  // const { updateActiveTab } = useHomeStore()

  // if (to.path !== from.path) {
  //   updateActiveTab(to.meta.id as number)
  // }

  close();
})

export default router
