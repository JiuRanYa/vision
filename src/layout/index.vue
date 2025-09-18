<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { mainNavItems, pinnedItems } from './config'
import Sidebar from './sidebar.vue'

// 获取当前路由
const route = useRoute()

// 生成面包屑导航
const breadcrumbs = computed(() => {
  const currentPath = route.path

  // 检查是否匹配pinnedItems中的link
  const pinnedItem = pinnedItems.find(item => item.link === currentPath)
  if (pinnedItem) {
    return [
      { text: 'AI Suite', link: '#' },
      { text: pinnedItem.text, link: pinnedItem.link, isActive: true },
    ]
  }

  // 检查是否匹配mainNavItems中的link
  const mainItem = mainNavItems.find(item => item.link === currentPath)
  if (mainItem) {
    return [
      { text: mainItem.text, link: mainItem.link, isActive: true },
    ]
  }

  // 默认面包屑
  return [
    { text: 'AI Suite', link: '#' },
    { text: 'Image Generator', link: '/ai-image-generator', isActive: true },
  ]
})
</script>

<template>
  <div class="flex">
    <Sidebar />

    <div class="bg-surface-0 flex flex-1 flex-col overflow-hidden md:h-screen">
      <!-- 顶部导航栏 -->
      <header class="h-16 border-b border-gray-100 bg-white px-6 flex items-center justify-between flex-shrink-0">
        <!-- 中间：面包屑导航 -->
        <div class="flex items-center space-x-2 text-sm text-gray-600">
          <template v-for="(crumb, index) in breadcrumbs" :key="crumb.text">
            <span
              class="transition-colors"
              :class="[
                crumb.isActive
                  ? 'text-gray-900 font-medium'
                  : 'text-gray-600 hover:text-gray-900',
              ]"
            >
              {{ crumb.text }}
            </span>
            <span v-if="index < breadcrumbs.length - 1" class="text-gray-400">/</span>
          </template>
        </div>
      </header>

      <!-- 主内容区域 -->
      <RouterView />
    </div>
  </div>
</template>
