<script setup lang="ts">
import { reactive, ref } from 'vue'
import CommunityGrid from '@/components/CommunityGrid.vue'
import VideoConfig from './VideoConfig.vue'

// Video Generator 侧边栏配置面板

// 视频生成配置
const videoConfig = ref({
  model: 'Auto',
  modelId: 1,
  startImage: '',
  endImage: '',
  promptType: 'text' as 'text' | 'visual',
  prompt: '',
  duration: '5-6s',
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
  { id: 1, imageUrl: 'https://picsum.photos/400/600?random=21', prompt: 'Cinematic video of a woman walking through a flower field, golden hour lighting, slow motion', type: 'video' as const },
  { id: 2, imageUrl: 'https://picsum.photos/400/500?random=22', prompt: 'Underwater video of jellyfish swimming gracefully, blue ocean theme, ethereal movement', type: 'video' as const },
  { id: 3, imageUrl: 'https://picsum.photos/400/550?random=23', prompt: 'Time-lapse video of sunset over mountains, warm tones, cinematic style', type: 'video' as const },
  { id: 4, imageUrl: 'https://picsum.photos/400/700?random=24', prompt: 'Epic fantasy video of warrior in battle, dramatic lighting, action sequence', type: 'video' as const },
  { id: 5, imageUrl: 'https://picsum.photos/400/450?random=25', prompt: 'Smooth video of luxury car driving through city streets, professional cinematography', type: 'video' as const },
  { id: 6, imageUrl: 'https://picsum.photos/400/600?random=26', prompt: 'Cute video of sloth moving slowly on tree branch, adorable animal behavior', type: 'video' as const },
  { id: 7, imageUrl: 'https://picsum.photos/400/650?random=27', prompt: 'Professional video portrait of businesswoman, clean background, corporate style', type: 'video' as const },
  { id: 8, imageUrl: 'https://picsum.photos/400/500?random=28', prompt: 'Artistic video with creative transitions, warm lighting, artistic cinematography', type: 'video' as const },
  { id: 9, imageUrl: 'https://picsum.photos/400/550?random=29', prompt: 'Minimalist video with clean lines, soft lighting, modern cinematography', type: 'video' as const },
  { id: 10, imageUrl: 'https://picsum.photos/400/450?random=30', prompt: 'Abstract video with geometric patterns, minimalist design, modern art style', type: 'video' as const },
  { id: 11, imageUrl: 'https://picsum.photos/400/600?random=31', prompt: 'Confident video portrait of a man, professional lighting, business cinematography', type: 'video' as const },
])

// 打字机动画函数
function typewriterEffect(text: string, callback?: () => void) {
  if (isTyping.value) {
    return // 防止重复触发
  }

  isTyping.value = true
  videoConfig.value.prompt = ''

  let index = 0
  const typeNextChar = () => {
    if (index < text.length) {
      videoConfig.value.prompt += text[index]
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
    <div class="w-80 border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 overflow-y-auto">
      <!-- 标题 -->
      <h1 class="text-sm font-bold text-gray-900 dark:text-gray-100 mb-6">
        Generate video
      </h1>

      <!-- 配置组件 -->
      <VideoConfig
        v-model:config="videoConfig"
        @generate="handleGenerate"
      />
    </div>

    <!-- 右侧瀑布流区域 -->
    <div class="flex-1 p-6 overflow-y-auto bg-white dark:bg-gray-900">
      <!-- 生成结果区域 -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-md font-bold text-gray-900 dark:text-gray-100">
            Generated Videos
          </h2>
          <div class="flex items-center space-x-2">
            <button class="kt-btn kt-btn-sm kt-btn-ghost text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
              <span class="ml-1">Regenerate</span>
            </button>
            <button class="kt-btn kt-btn-sm kt-btn-ghost text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
              <span class="ml-1">Download All</span>
            </button>
          </div>
        </div>

        <!-- Loading状态 -->
        <div v-if="isGenerating" class="text-center py-12">
          <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
            <i class="ki-outline ki-loading text-2xl text-blue-600 dark:text-blue-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Generating your video...
          </h3>
          <p class="text-gray-500 dark:text-gray-400 text-sm">
            This may take a few moments
          </p>
        </div>

        <!-- 生成结果布局 -->
        <div v-else-if="generatedVideos.length > 0" class="flex gap-4">
          <!-- 左侧：上次生成结果（只有多张图片时才显示） -->
          <div v-if="generatedVideos.length > 1" class="flex-1">
            <div class="mb-2">
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Previous</span>
            </div>
            <div class="relative group rounded-lg overflow-hidden shadow-sm dark:shadow-gray-800 hover:shadow-md dark:hover:shadow-gray-700 transition-shadow cursor-pointer h-80">
              <div
                class="w-full h-full bg-gradient-to-br flex items-center justify-center text-4xl"
                :class="generatedVideos[1].gradient"
              >
                {{ generatedVideos[1].emoji }}
              </div>
              <!-- 悬停操作按钮 -->
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div class="flex space-x-2">
                  <button class="w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <i class="ki-outline ki-download text-gray-600 dark:text-gray-400 text-sm" />
                  </button>
                  <button class="w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <i class="ki-outline ki-exit-right-corner text-gray-600 dark:text-gray-400 text-sm" />
                  </button>
                  <button class="w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <i class="ki-outline ki-heart text-gray-600 dark:text-gray-400 text-sm" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧：最新生成结果（单张图片时占据全宽，多张图片时占据一半） -->
          <div :class="generatedVideos.length === 1 ? 'w-full' : 'flex-1'">
            <div class="mb-2">
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Latest</span>
            </div>
            <div class="relative group rounded-lg overflow-hidden shadow-sm dark:shadow-gray-800 hover:shadow-md dark:hover:shadow-gray-700 transition-shadow cursor-pointer h-80">
              <div
                class="w-full h-full bg-gradient-to-br flex items-center justify-center text-4xl"
                :class="generatedVideos[0].gradient"
              >
                {{ generatedVideos[0].emoji }}
              </div>
              <!-- 悬停操作按钮 -->
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-50">
                <div class="flex space-x-2">
                  <button class="w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <i class="ki-outline ki-exit-right-corner text-gray-600 dark:text-gray-400 text-sm" />
                  </button>
                  <button class="w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <i class="ki-outline ki-heart text-gray-600 dark:text-gray-400 text-sm" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="text-center py-12">
          <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="ki-outline ki-youtube text-2xl text-gray-400 dark:text-gray-500" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No videos generated yet
          </h3>
          <p class="text-gray-500 dark:text-gray-400 text-sm">
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
