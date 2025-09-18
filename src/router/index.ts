import { createMemoryHistory, createRouter } from 'vue-router'

const routes = [
  { path: '/', component: () => import('@/layout/index.vue') },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
