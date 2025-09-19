<script setup lang="ts">
import { reactive } from 'vue'

// Image Generator 侧边栏配置面板

// 瀑布流图片数据
const communityImages = reactive([
  { id: 1, height: 'h-80', gradient: 'from-pink-200 to-red-300', emoji: '👩' },
  { id: 2, height: 'h-64', gradient: 'from-blue-200 to-purple-300', emoji: '🪼' },
  { id: 3, height: 'h-72', gradient: 'from-orange-200 to-yellow-300', emoji: '👩' },
  { id: 4, height: 'h-96', gradient: 'from-gray-200 to-blue-300', emoji: '⚔️' },
  { id: 5, height: 'h-56', gradient: 'from-white to-gray-200', emoji: '🚗' },
  { id: 6, height: 'h-80', gradient: 'from-pink-200 to-purple-300', emoji: '🦥' },
  { id: 7, height: 'h-88', gradient: 'from-blue-200 to-gray-300', emoji: '👩' },
  { id: 8, height: 'h-64', gradient: 'from-yellow-200 to-orange-300', emoji: '👩' },
  { id: 9, height: 'h-72', gradient: 'from-blue-200 to-white', emoji: '👩' },
  { id: 10, height: 'h-56', gradient: 'from-gray-200 to-gray-300', emoji: '⬜' },
  { id: 11, height: 'h-80', gradient: 'from-white to-yellow-200', emoji: '👨' },
])
</script>

<template>
  <div class="flex h-full min-h-0">
    <!-- 左侧配置面板 -->
    <div class="w-80 border-r border-gray-100 bg-white p-6 overflow-y-auto">
      <!-- 标题 -->
      <h1 class="text-sm font-bold text-gray-900 mb-6">
        Generate images
      </h1>

      <!-- 输入区域 -->
      <div class="space-y-6">
        <!-- 文本输入框 -->
        <div class="relative">
          <input
            type="text"
            placeholder="Describe your image or"
            class="kt-input w-full pr-20 focus:border-blue-500"
          >
          <button class="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700 text-sm">
            upload
          </button>
        </div>

        <!-- 设置选项 -->
        <div class="space-y-3">
          <!-- Model -->
          <div class="kt-card cursor-pointer hover:bg-gray-50 transition-colors">
            <div class="flex items-center justify-between p-3">
              <div class="flex items-center space-x-3">
                <i class="ki-outline ki-star text-xs text-gray-600" />
                <span class="text-xs font-medium">Model</span>
                <div class="w-2 h-2 bg-blue-500 rounded-full" />
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-xs text-gray-600">Classic Fast</span>
                <i class="ki-outline ki-right text-xs text-gray-500" />
              </div>
            </div>
          </div>

          <!-- Style -->
          <div class="kt-card cursor-pointer hover:bg-gray-50 transition-colors">
            <div class="flex items-center justify-between p-3">
              <div class="flex items-center space-x-3">
                <i class="ki-outline ki-star text-xs text-gray-600" />
                <span class="text-xs font-medium">Style</span>
              </div>
              <div class="flex items-center space-x-2">
                <i class="ki-outline ki-shuffle text-xs text-gray-500" />
                <i class="ki-outline ki-plus text-xs text-gray-500" />
                <i class="ki-outline ki-right text-xs text-gray-500" />
              </div>
            </div>
          </div>

          <!-- Composition -->
          <div class="kt-card cursor-pointer hover:bg-gray-50 transition-colors">
            <div class="flex items-center justify-between p-3">
              <div class="flex items-center space-x-3">
                <i class="ki-outline ki-element-8 text-xs text-gray-600" />
                <span class="text-xs font-medium">Composition</span>
              </div>
              <i class="ki-outline ki-right text-xs text-gray-500" />
            </div>
          </div>

          <!-- Effects -->
          <div class="kt-card cursor-pointer hover:bg-gray-50 transition-colors">
            <div class="flex items-center justify-between p-3">
              <div class="flex items-center space-x-3">
                <i class="ki-outline ki-picture text-xs text-gray-600" />
                <span class="text-xs font-medium">Effects</span>
              </div>
              <i class="ki-outline ki-right text-xs text-gray-500" />
            </div>
          </div>

          <!-- Character -->
          <div class="kt-card cursor-pointer hover:bg-gray-50 transition-colors">
            <div class="flex items-center justify-between p-3">
              <div class="flex items-center space-x-3">
                <i class="ki-outline ki-user text-xs text-gray-600" />
                <span class="text-xs font-medium">Character</span>
              </div>
              <i class="ki-outline ki-right text-xs text-gray-500" />
            </div>
          </div>

          <!-- Object -->
          <div class="kt-card cursor-pointer hover:bg-gray-50 transition-colors">
            <div class="flex items-center justify-between p-3">
              <div class="flex items-center space-x-3">
                <i class="ki-outline ki-paintbucket text-xs text-gray-600" />
                <span class="text-xs font-medium">Object</span>
              </div>
              <i class="ki-outline ki-right text-xs text-gray-500" />
            </div>
          </div>

          <!-- Colors -->
          <div class="kt-card cursor-pointer hover:bg-gray-50 transition-colors">
            <div class="flex items-center justify-between p-3">
              <div class="flex items-center space-x-3">
                <i class="ki-outline ki-paintbucket text-xs text-gray-600" />
                <span class="text-xs font-medium">Colors</span>
              </div>
              <i class="ki-outline ki-right text-xs text-gray-500" />
            </div>
          </div>
        </div>

        <!-- Generate按钮 -->
        <button class="kt-btn kt-btn-primary w-full flex items-center justify-center space-x-2 py-3">
          <i class="ki-filled ki-click" />
          <span>Generate</span>
        </button>
      </div>
    </div>

    <!-- 右侧瀑布流区域 -->
    <div class="flex-1 p-6 overflow-y-auto">
      <!-- 标题区域 -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-md font-bold text-gray-900">
          Get inspired by the community
        </h2>
        <a href="#" class="text-blue-600 hover:text-blue-700 text-xs font-medium">My profile</a>
      </div>

      <!-- 瀑布流网格 -->
      <div class="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        <div
          v-for="image in communityImages"
          :key="image.id"
          class="group break-inside-avoid mb-4 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer relative"
          :class="image.height"
        >
          <div
            class="w-full h-full bg-gradient-to-br flex items-center justify-center text-6xl"
            :class="image.gradient"
          >
            {{ image.emoji }}
          </div>

          <!-- Hover遮罩层 -->
          <div class="absolute inset-0 bg-black group-hover:bg-opacity-30 transition-all duration-200 opacity-0 group-hover:opacity-20" />

          <!-- ReCreate按钮 -->
          <div class="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button class="kt-btn kt-btn-mono rounded-full">
              ReCreate
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
