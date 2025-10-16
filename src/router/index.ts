import type { Component } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import KTUI from '@keenthemes/ktui/src/index.ts'
import { nextTick } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import ImageEditHeaderActions from '@/pages/image-edit/HeaderActions.vue'
import { REDIRECT_PATH, useAuthStore } from '@/store/auth'
import { useUserStore } from '@/store/user'

// 扩展路由meta类型
declare module 'vue-router' {
  interface RouteMeta {
    middleware?: string
    headerActions?: Component
  }
}

const routes = [
  // 使用 SimpleLayout 的路由（无 Header）
  {
    path: '/',
    component: () => import('@/layout/simple.vue'),
    children: [
      {
        path: '/',
        component: () => import('@/pages/home/index.vue'),
      },
    ],
  },
  // 使用完整 Layout 的路由（有 Header）
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/image-generator',
        component: () => import('@/pages/image-generator/index.vue'),
      },
      {
        path: '/image-edit',
        component: () => import('@/pages/image-edit/index.vue'),
        meta: {
          headerActions: ImageEditHeaderActions,
        },
      },
      { path: '/video-generator', component: () => import('@/pages/video-generator/index.vue') },
      { path: '/community', component: () => import('@/pages/community/index.vue') },
      { path: '/my-creations', component: () => import('@/pages/my-creations/index.vue') },
      { path: '/admin-board', component: () => import('@/pages/admin/index.vue') },
    ],
  },
  {
    path: '/',
    component: () => import('../pages/error/layout.vue'),
    meta: {
      middleware: 'public',
    },
    children: [
      {
        path: '/sso',
        name: 'sso',
        component: () => import('../pages/auth/SSO.vue'),
      },
    ],
  },
] as RouteRecordRaw[]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, _from, next) => {
  if (to.meta.middleware === 'public') {
    return next()
  }

  const authStore = useAuthStore()
  await authStore.verifyAuth()
  if (!authStore.isAuthenticated) {
    localStorage.setItem(REDIRECT_PATH, to.fullPath)
    return next({ name: 'sso' })
  }

  const userStore = useUserStore()
  userStore.initUserRole()

  next()
})

router.afterEach(() => {
  nextTick(() => {
    KTUI.init()
  })
})
