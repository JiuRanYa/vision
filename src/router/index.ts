import type { RouteRecordRaw } from 'vue-router'
import KTUI from '@keenthemes/ktui/src/index.ts'
import { nextTick } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    children: [
      { path: '/', redirect: '/image-generator' },
      { path: '/image-generator', component: () => import('@/pages/image-generator/index.vue') },
      { path: '/video-generator', component: () => import('@/pages/video-generator/index.vue') },
      { path: '/community', component: () => import('@/pages/community/index.vue') },
      { path: '/my-creations', component: () => import('@/pages/my-creations/index.vue') },
      { path: '/admin', component: () => import('@/pages/admin/index.vue') },
    ],
  },
] as RouteRecordRaw[]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.afterEach(() => {
  nextTick(() => {
    KTUI.init()
  })
})
