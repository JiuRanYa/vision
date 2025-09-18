<script setup lang="ts">
// Image Generator 侧边栏配置面板
</script>

<template>
  <div class="h-full w-80 border-r border-gray-100 bg-white p-6 overflow-y-auto">
    <!-- 标题 -->
    <h1 class="text-lg font-bold text-gray-900 mb-6">
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
              <i class="ki-outline ki-lightning text-lg text-gray-600" />
              <span class="text-sm font-medium">Model</span>
              <div class="w-2 h-2 bg-blue-500 rounded-full" />
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-600">Classic Fast</span>
              <i class="ki-outline ki-right text-sm text-gray-500" />
            </div>
          </div>
        </div>

        <!-- Style -->
        <div class="kt-card cursor-pointer hover:bg-gray-50 transition-colors">
          <div class="flex items-center justify-between p-3">
            <div class="flex items-center space-x-3">
              <i class="ki-outline ki-star text-lg text-gray-600" />
              <span class="text-sm font-medium">Style</span>
            </div>
            <div class="flex items-center space-x-2">
              <i class="ki-outline ki-shuffle text-sm text-gray-500" />
              <i class="ki-outline ki-plus text-sm text-gray-500" />
              <i class="ki-outline ki-right text-sm text-gray-500" />
            </div>
          </div>
        </div>

        <!-- Composition -->
        <div class="kt-card cursor-pointer hover:bg-gray-50 transition-colors">
          <div class="flex items-center justify-between p-3">
            <div class="flex items-center space-x-3">
              <i class="ki-outline ki-element-8 text-lg text-gray-600" />
              <span class="text-sm font-medium">Composition</span>
            </div>
            <i class="ki-outline ki-right text-sm text-gray-500" />
          </div>
        </div>

        <!-- Effects -->
        <div class="kt-card cursor-pointer hover:bg-gray-50 transition-colors">
          <div class="flex items-center justify-between p-3">
            <div class="flex items-center space-x-3">
              <i class="ki-outline ki-picture text-lg text-gray-600" />
              <span class="text-sm font-medium">Effects</span>
            </div>
            <i class="ki-outline ki-right text-sm text-gray-500" />
          </div>
        </div>

        <!-- Character -->
        <div class="kt-card cursor-pointer hover:bg-gray-50 transition-colors">
          <div class="flex items-center justify-between p-3">
            <div class="flex items-center space-x-3">
              <i class="ki-outline ki-user text-lg text-gray-600" />
              <span class="text-sm font-medium">Character</span>
            </div>
            <i class="ki-outline ki-right text-sm text-gray-500" />
          </div>
        </div>

        <!-- Object -->
        <div class="kt-card cursor-pointer hover:bg-gray-50 transition-colors">
          <div class="flex items-center justify-between p-3">
            <div class="flex items-center space-x-3">
              <i class="ki-outline ki-tshirt text-lg text-gray-600" />
              <span class="text-sm font-medium">Object</span>
            </div>
            <i class="ki-outline ki-right text-sm text-gray-500" />
          </div>
        </div>

        <!-- Colors -->
        <div class="kt-card cursor-pointer hover:bg-gray-50 transition-colors">
          <div class="flex items-center justify-between p-3">
            <div class="flex items-center space-x-3">
              <i class="ki-outline ki-paintbucket text-lg text-gray-600" />
              <span class="text-sm font-medium">Colors</span>
            </div>
            <i class="ki-outline ki-right text-sm text-gray-500" />
          </div>
        </div>
      </div>

      <!-- Generate按钮 -->
      <button class="kt-btn kt-btn-primary w-full flex items-center justify-center space-x-2 py-3">
        <span>Generate</span>
        <i class="ki-outline ki-star text-sm" />
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 自定义样式 */
</style>
