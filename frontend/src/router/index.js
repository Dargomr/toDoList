import { createRouter, createWebHistory } from 'vue-router'
import tasksView from '../views/TasksView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'tasks',
      component: tasksView,
    },
  ],
})

export default router
