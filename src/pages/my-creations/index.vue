<script setup lang="ts">
import { ref } from 'vue'

// 当前激活的导航项
const activeNavItem = ref('downloads')

// 导航菜单项
const navItems = [
  { id: 'history', label: 'History', icon: 'ki-outline ki-time' },
  { id: 'uploads', label: 'Uploads', icon: 'ki-outline ki-time' },
  { id: 'downloads', label: 'Downloads', icon: 'ki-outline ki-time' },
]

// 切换导航项
function setActiveNavItem(itemId: string) {
  activeNavItem.value = itemId
}

// 获取当前激活项的标签
const activeLabel = ref('Downloads')
</script>

<template>
  <div class="flex h-full bg-white dark:bg-gray-900">
    <!-- 左侧导航栏 -->
    <div class="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div class="p-6">
        <!-- 导航菜单 -->
        <nav class="space-y-1">
          <button
            v-for="item in navItems"
            :key="item.id"
            class="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors"
            :class="[
              activeNavItem === item.id
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
            ]"
            @click="setActiveNavItem(item.id)"
          >
            <i :class="`${item.icon} text-lg`" />
            <span class="text-sm font-medium">{{ item.label }}</span>
          </button>
        </nav>
      </div>
    </div>

    <!-- 右侧主内容区域 -->
    <div class="flex-1 flex flex-col">
      <!-- 顶部标题栏 -->
      <div class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- 左侧标题 -->
          <div class="flex items-center space-x-2">
            <i class="ki-outline ki-download text-xl text-gray-600 dark:text-gray-400" />
            <h1 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {{ activeLabel }}
            </h1>
            <i class="ki-outline ki-down text-sm text-gray-400" />
          </div>

          <!-- 右侧工具 -->
          <div class="flex items-center space-x-4">
            <button class="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
              <i class="ki-outline ki-element-equal" />
              <span>All</span>
            </button>
            <button class="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
              <i class="ki-outline ki-grid-2 text-lg" />
            </button>
            <button class="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
              <i class="ki-outline ki-filter text-lg" />
            </button>
            <button class="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
              <i class="ki-outline ki-magnifier text-lg" />
            </button>
          </div>
        </div>
      </div>

      <!-- 主内容区域 -->
      <div class="flex-1 flex items-center justify-center p-8">
        <div class="text-center">
          <!-- 下载图标 -->
          <div class="mb-6">
            <i class="ki-outline ki-arrow-down text-6xl text-gray-300 dark:text-gray-600" />
          </div>

          <!-- 提示文字 -->
          <h2 class="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
            Downloaded images will appear here
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Start creating amazing images with your words and save or download them!
          </p>

          <!-- 行动按钮 -->
          <button class="kt-btn kt-btn-primary">
            <i class="ki-outline ki-plus" />
            Start Creating
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
