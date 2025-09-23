<script setup lang="ts">
import { } from 'vue'
import { useRoute } from 'vue-router'
import { mainNavItems, pinnedItems, toolIcons } from './config'

// 获取当前路由
const route = useRoute()

// 判断菜单项是否激活
function isItemActive(link: string) {
  return route.path === link
}
</script>

<template>
  <div class="z-[50] h-dvh overflow-hidden lg:static relative transition-all duration-100 w-16 xl:w-60">
    <div class="bg-gray-50 h-full flex flex-col">
      <!-- 顶部区域：标志和主导航 -->
      <div class="p-6">
        <!-- FREEPIK标志 -->
        <div class="flex items-center space-x-2 mb-8">
          <span class="text-xl font-bold text-blue-600 hidden xl:block">Bole VISION</span>
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
                ? 'text-gray-700 bg-gray-100'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200',
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
        <div class="border-t border-gray-200 pt-6">
          <h3 class="text-sm font-medium text-gray-500 mb-4 hidden xl:block">
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
                  ? 'text-gray-900 bg-gray-200'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200',
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

      <!-- 底部区域：Get a plan 和工具图标 -->
      <div class="p-6 space-y-4">
        <!-- 工具图标行 -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <button
              v-for="tool in toolIcons"
              :key="tool.icon"
              :href="tool.link"
              class="kt-btn kt-btn-icon kt-btn-ghost relative"
            >
              <i :class="`ki-outline ${tool.icon} text-lg`" />
              <span
                v-if="tool.badge"
                class="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
              >
                {{ tool.badge }}
              </span>
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
