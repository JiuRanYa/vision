<script setup lang="ts">
import { mainNavItems, pinnedItems, toolIcons } from './config'
</script>

<template>
  <div class="z-[100] h-dvh overflow-hidden lg:static relative transition-all duration-100 w-16 xl:w-60">
    <div class="bg-gray-50 h-full flex flex-col">
      <!-- 顶部区域：标志和主导航 -->
      <div class="p-6">
        <!-- FREEPIK标志 -->
        <div class="flex items-center space-x-2 mb-8">
          <i class="ki-outline ki-picture text-2xl text-blue-600" />
          <span class="text-xl font-bold text-blue-600 hidden xl:block">VISION</span>
        </div>

        <!-- 主导航菜单 -->
        <nav class="space-y-2">
          <a
            v-for="item in mainNavItems"
            :key="item.text"
            :href="item.link"
            class="flex items-center space-x-3 text-gray-700 hover:text-gray-900 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <i :class="`ki-outline ${item.icon} text-lg`" />
            <span class="hidden text-sm xl:block">{{ item.text }}</span>
          </a>
        </nav>
      </div>

      <!-- 中间区域：Pinned -->
      <div class="px-6 flex-1">
        <div class="border-t border-gray-200 pt-6">
          <h3 class="text-sm font-medium text-gray-500 mb-4 hidden xl:block">
            Pinned
          </h3>
          <div class="space-y-2">
            <a
              v-for="item in pinnedItems"
              :key="item.text"
              :href="item.link"
              class="flex items-center space-x-3 py-2 px-3 rounded-lg transition-colors"
              :class="[
                item.isActive
                  ? 'text-gray-900 bg-gray-200'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200',
              ]"
            >
              <div class="relative">
                <i :class="`ki-outline ${item.icon} text-lg`" />
              </div>
              <span class="hidden text-sm xl:block" :class="{ 'font-medium': item.isActive }">
                {{ item.text }}
              </span>
            </a>
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
