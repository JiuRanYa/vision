<script setup lang="ts">
import { reactive, ref } from 'vue'
import CommunityGrid from '@/components/CommunityGrid.vue'
import VideoConfig from './VideoConfig.vue'

// Video Generator 侧边栏配置面板

// 视频生成配置
const videoConfig = reactive({
  model: 'Auto',
  modelId: 1,
  startImage: '',
  endImage: '',
  promptType: 'text' as 'text' | 'visual',
  prompt: '',
  duration: 'Short (5-6s)',
  aspectRatio: '16:9',
})

// 生成状态
const isGenerating = ref(false)

const isTyping = ref(false)

const generatedVideos = reactive([])

function handleGenerate() {
  console.warn('Generating video with config:', videoConfig)

  isGenerating.value = true

  setTimeout(() => {
    // 添加新的生成结果
    const newVideo = {
      id: Date.now(),
      height: 'h-80',
      gradient: 'from-purple-200 to-pink-300',
      emoji: '🎬',
      status: 'completed',
    }
    generatedVideos.unshift(newVideo)

    isGenerating.value = false
  }, 5000)
}

// 瀑布流视频数据
const communityImages = reactive([
  { id: 1, height: 'h-80', gradient: 'from-pink-200 to-red-300', emoji: '🎬', prompt: 'Cinematic video of a woman walking through a flower field, golden hour lighting, slow motion', type: 'video' as const },
  { id: 2, height: 'h-64', gradient: 'from-blue-200 to-purple-300', emoji: '🌊', prompt: 'Underwater video of jellyfish swimming gracefully, blue ocean theme, ethereal movement', type: 'video' as const },
  { id: 3, height: 'h-72', gradient: 'from-orange-200 to-yellow-300', emoji: '🌅', prompt: 'Time-lapse video of sunset over mountains, warm tones, cinematic style', type: 'video' as const },
  { id: 4, height: 'h-96', gradient: 'from-gray-200 to-blue-300', emoji: '⚔️', prompt: 'Epic fantasy video of warrior in battle, dramatic lighting, action sequence', type: 'video' as const },
  { id: 5, height: 'h-56', gradient: 'from-white to-gray-200', emoji: '🚗', prompt: 'Smooth video of luxury car driving through city streets, professional cinematography', type: 'video' as const },
  { id: 6, height: 'h-80', gradient: 'from-pink-200 to-purple-300', emoji: '🦥', prompt: 'Cute video of sloth moving slowly on tree branch, adorable animal behavior', type: 'video' as const },
  { id: 7, height: 'h-88', gradient: 'from-blue-200 to-gray-300', emoji: '👩', prompt: 'Professional video portrait of businesswoman, clean background, corporate style', type: 'video' as const },
  { id: 8, height: 'h-64', gradient: 'from-yellow-200 to-orange-300', emoji: '🎨', prompt: 'Artistic video with creative transitions, warm lighting, artistic cinematography', type: 'video' as const },
  { id: 9, height: 'h-72', gradient: 'from-blue-200 to-white', emoji: '✨', prompt: 'Minimalist video with clean lines, soft lighting, modern cinematography', type: 'video' as const },
  { id: 10, height: 'h-56', gradient: 'from-gray-200 to-gray-300', emoji: '⬜', prompt: 'Abstract video with geometric patterns, minimalist design, modern art style', type: 'video' as const },
  { id: 11, height: 'h-80', gradient: 'from-white to-yellow-200', emoji: '👨', prompt: 'Confident video portrait of a man, professional lighting, business cinematography', type: 'video' as const },
])

// 打字机动画函数
function typewriterEffect(text: string, callback?: () => void) {
  if (isTyping.value) {
    return // 防止重复触发
  }

  isTyping.value = true
  videoConfig.prompt = ''

  let index = 0
  const typeNextChar = () => {
    if (index < text.length) {
      videoConfig.prompt += text[index]
      index++
      setTimeout(typeNextChar, 5) // 50ms间隔，可调整速度
    }
    else {
      isTyping.value = false
      if (callback) {
        callback()
      }
    }
  }

  typeNextChar()
}

function handleRecreate(item: typeof communityImages[0]) {
  console.warn('Recreating from community item:', item)
  typewriterEffect(item.prompt)
}
</script>

<template>
  <div class="flex h-full min-h-0">
    <!-- 左侧配置面板 -->
    <div class="w-80 border-r border-gray-100 bg-white p-6 overflow-y-auto">
      <!-- 标题 -->
      <h1 class="text-sm font-bold text-gray-900 mb-6">
        Generate video
      </h1>

      <!-- 配置组件 -->
      <VideoConfig
        v-model:config="videoConfig"
        @generate="handleGenerate"
      />
    </div>

    <!-- 右侧瀑布流区域 -->
    <div class="flex-1 p-6 overflow-y-auto">
      <!-- 生成结果区域 -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-md font-bold text-gray-900">
            Generated Videos
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
            Generating your video...
          </h3>
          <p class="text-gray-500 text-sm">
            This may take a few moments
          </p>
        </div>

        <!-- 生成结果布局 -->
        <div v-else-if="generatedVideos.length > 0" class="flex gap-4">
          <!-- 左侧：上次生成结果（只有多张图片时才显示） -->
          <div v-if="generatedVideos.length > 1" class="flex-1">
            <div class="mb-2">
              <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Previous</span>
            </div>
            <div class="relative group rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer h-80">
              <div
                class="w-full h-full bg-gradient-to-br flex items-center justify-center text-4xl"
                :class="generatedVideos[1].gradient"
              >
                {{ generatedVideos[1].emoji }}
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
          <div :class="generatedVideos.length === 1 ? 'w-full' : 'flex-1'">
            <div class="mb-2">
              <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Latest</span>
            </div>
            <div class="relative group rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer h-80">
              <div
                class="w-full h-full bg-gradient-to-br flex items-center justify-center text-4xl"
                :class="generatedVideos[0].gradient"
              >
                {{ generatedVideos[0].emoji }}
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
            <i class="ki-outline ki-youtube text-2xl text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            No videos generated yet
          </h3>
          <p class="text-gray-500 text-sm">
            Click "Generate" to create your first AI video
          </p>
        </div>
      </div>

      <!-- 社区组件 -->
      <CommunityGrid
        :items="communityImages"
        @recreate="handleRecreate"
      />
    </div>
  </div>
</template>

<style scoped>
/* 自定义样式 */
</style>
