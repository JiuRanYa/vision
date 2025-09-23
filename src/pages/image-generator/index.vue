<script setup lang="ts">
import { reactive, ref } from 'vue'
import ImageConfig from '@/pages/image-generator/ImageConfig.vue'

// Image Generator 侧边栏配置面板

// 图片生成配置
const imageConfig = reactive({
  prompt: '',
  model: 'Classic Fast',
  style: '',
  composition: '',
  effects: '',
  character: '',
  object: '',
  colors: '',
})

// 生成状态
const isGenerating = ref(false)

// 生成结果数据
const generatedImages = reactive([
  // 示例生成结果
])

// 生成图片处理函数
function handleGenerate() {
  console.warn('Generating image with config:', imageConfig)

  // 开始生成
  isGenerating.value = true

  // 模拟生成过程
  setTimeout(() => {
    // 添加新的生成结果
    const newImage = {
      id: Date.now(),
      height: 'h-80',
      gradient: 'from-orange-200 to-red-300',
      emoji: '🎨',
      status: 'completed',
    }
    generatedImages.unshift(newImage)

    // 结束生成
    isGenerating.value = false
  }, 3000)
}

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

      <!-- 配置组件 -->
      <ImageConfig
        v-model:config="imageConfig"
        @generate="handleGenerate"
      />
    </div>

    <!-- 右侧瀑布流区域 -->
    <div class="flex-1 p-6 overflow-y-auto">
      <!-- 生成结果区域 -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-md font-bold text-gray-900">
            Generated Images
          </h2>
          <div class="flex items-center space-x-2">
            <button class="kt-btn kt-btn-sm kt-btn-ghost text-gray-600 hover:text-gray-900">
              <i class="ki-outline ki-refresh text-sm" />
              <span class="ml-1">Regenerate</span>
            </button>
            <button class="kt-btn kt-btn-sm kt-btn-ghost text-gray-600 hover:text-gray-900">
              <i class="ki-outline ki-download text-sm" />
              <span class="ml-1">Download All</span>
            </button>
          </div>
        </div>

        <!-- Loading状态 -->
        <div v-if="isGenerating" class="text-center py-12">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
            <i class="ki-outline ki-loading text-2xl text-blue-600" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            Generating your image...
          </h3>
          <p class="text-gray-500 text-sm">
            This may take a few moments
          </p>
        </div>

        <!-- 生成结果布局 -->
        <div v-else-if="generatedImages.length > 0" class="flex gap-4">
          <!-- 左侧：上次生成结果（只有多张图片时才显示） -->
          <div v-if="generatedImages.length > 1" class="flex-1">
            <div class="mb-2">
              <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Previous</span>
            </div>
            <div class="relative group rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer h-80">
              <div
                class="w-full h-full bg-gradient-to-br flex items-center justify-center text-4xl"
                :class="generatedImages[1].gradient"
              >
                {{ generatedImages[1].emoji }}
              </div>
              <!-- 悬停操作按钮 -->
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div class="flex space-x-2">
                  <button class="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <i class="ki-outline ki-download text-gray-600 text-sm" />
                  </button>
                  <button class="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <i class="ki-outline ki-share text-gray-600 text-sm" />
                  </button>
                  <button class="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <i class="ki-outline ki-heart text-gray-600 text-sm" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧：最新生成结果（单张图片时占据全宽，多张图片时占据一半） -->
          <div :class="generatedImages.length === 1 ? 'w-full' : 'flex-1'">
            <div class="mb-2">
              <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Latest</span>
            </div>
            <div class="relative group rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer h-80">
              <div
                class="w-full h-full bg-gradient-to-br flex items-center justify-center text-4xl"
                :class="generatedImages[0].gradient"
              >
                {{ generatedImages[0].emoji }}
              </div>
              <!-- 悬停操作按钮 -->
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div class="flex space-x-2">
                  <button class="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <i class="ki-outline ki-download text-gray-600 text-sm" />
                  </button>
                  <button class="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <i class="ki-outline ki-share text-gray-600 text-sm" />
                  </button>
                  <button class="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <i class="ki-outline ki-heart text-gray-600 text-sm" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="text-center py-12">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="ki-outline ki-picture text-2xl text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            No images generated yet
          </h3>
          <p class="text-gray-500 text-sm">
            Click "Generate" to create your first AI image
          </p>
        </div>
      </div>

      <!-- 社区瀑布流标题区域 -->
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
