<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { mainNavItems, pinnedItems } from './config'

// 获取当前路由
const route = useRoute()

// 主题状态管理
const isDarkMode = ref(false)

// 判断菜单项是否激活
function isItemActive(link: string) {
  return route.path === link
}

// 切换主题
function toggleTheme() {
  isDarkMode.value = !isDarkMode.value
  // 更新HTML根元素的class
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  }
  else {
    document.documentElement.classList.remove('dark')
  }
}
</script>

<template>
  <div class="z-[50] h-dvh overflow-hidden lg:static relative transition-all duration-100 w-16 xl:w-60">
    <div class="bg-gray-50 dark:bg-gray-900 h-full flex flex-col">
      <!-- 顶部区域：标志和主导航 -->
      <div class="p-6">
        <div class="flex items-center space-x-2 mb-8">
          <span class="text-xl font-bold text-blue-600 dark:text-blue-400 hidden xl:block">Bole VISION</span>
        </div>

        <!-- 主导航菜单 -->
        <nav class="space-y-2">
          <router-link
            v-for="item in mainNavItems"
            :key="item.text"
            :to="item.link"
            class="flex items-center space-x-3 py-2 px-3 rounded-lg transition-colors"
            :class="[
              isItemActive(item.link)
                ? 'text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800',
            ]"
          >
            <i :class="`ki-outline ${item.icon} text-md`" />
            <span class="hidden text-sm xl:block" :class="{ 'font-medium': isItemActive(item.link) }">
              {{ item.text }}
            </span>
          </router-link>
        </nav>
      </div>

      <!-- 中间区域：Pinned -->
      <div class="px-6 flex-1">
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 hidden xl:block">
            Pinned
          </h3>
          <div class="space-y-2">
            <router-link
              v-for="item in pinnedItems"
              :key="item.text"
              :to="item.link"
              class="flex items-center space-x-3 py-2 px-3 rounded-lg transition-colors"
              :class="[
                isItemActive(item.link)
                  ? 'text-gray-900 dark:text-gray-100 bg-gray-200 dark:bg-gray-800'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800',
              ]"
            >
              <div class="relative">
                <i :class="`ki-outline ${item.icon} text-md`" />
              </div>
              <span class="hidden text-sm xl:block" :class="{ 'font-medium': isItemActive(item.link) }">
                {{ item.text }}
              </span>
            </router-link>
          </div>
        </div>
      </div>

      <!-- 底部区域：工具图标 -->
      <div class="p-6 space-y-4">
        <!-- 工具图标行 -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <button
              href="#"
              class="kt-btn kt-btn-icon kt-btn-ghost relative text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <i class="ki-outline ki-question text-lg" />
            </button>
            <button
              href="#"
              class="kt-btn kt-btn-icon kt-btn-ghost relative text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              @click="toggleTheme"
            >
              <i :class="isDarkMode ? 'ki-outline ki-moon text-lg' : 'ki-outline ki-sun text-lg'" />
            </button>
            <button
              href="#"
              class="kt-btn kt-btn-icon kt-btn-ghost relative text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <i class="ki-outline ki-notification text-lg" />
              <span class="absolute -top-1 -right-1 bg-blue-600 dark:bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                2
              </span>
            </button>
            <button
              href="#"
              class="kt-btn kt-btn-icon kt-btn-ghost relative text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <i class="ki-outline ki-more text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 自定义样式 */
</style>
