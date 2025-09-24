import type { RouteRecordRaw } from 'vue-router'
import KTUI from '@keenthemes/ktui/src/index.ts'
import { nextTick } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    children: [
      { path: '/', redirect: '/image-generator' },
      { path: '/image-generator', component: () => import('@/pages/image-generator/index.vue') },
      { path: '/video-generator', component: () => import('@/pages/video-generator/index.vue') },
      { path: '/community', component: () => import('@/pages/community/index.vue') },
    ],
  },
] as RouteRecordRaw[]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

router.afterEach(() => {
  nextTick(() => {
    KTUI.init()
  })
})
