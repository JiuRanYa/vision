import { createMemoryHistory, createRouter } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    children: [
      { path: '/', component: () => import('@/pages/image-generator/index.vue') },
    ],
  },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
