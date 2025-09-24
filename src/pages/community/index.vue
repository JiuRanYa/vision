<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import WaterfallGrid from '@/components/WaterfallGrid.vue'

// 当前选中的标签
const activeTab = ref('image')

// 标签页配置
const tabs = [
  { id: 'image', label: 'Image' },
  { id: 'video', label: 'Video' },
  { id: 'styles', label: 'Styles' },
  { id: 'top-creators', label: 'Top Creators' },
]

// 社区图片数据
const communityImages = reactive([
  { id: 1, imageUrl: 'https://picsum.photos/400/600?random=1', prompt: 'A beautiful portrait of a woman with flowing hair, soft lighting, professional photography style', type: 'image' as const },
  { id: 2, imageUrl: 'https://picsum.photos/400/500?random=2', prompt: 'Underwater scene with jellyfish floating gracefully, blue ocean theme, ethereal lighting', type: 'image' as const },
  { id: 3, imageUrl: 'https://picsum.photos/400/550?random=3', prompt: 'Sunset portrait of a woman with golden hour lighting, warm tones, cinematic style', type: 'image' as const },
  { id: 4, imageUrl: 'https://picsum.photos/400/700?random=4', prompt: 'Medieval fantasy warrior with sword, dramatic lighting, epic fantasy art style', type: 'image' as const },
  { id: 5, imageUrl: 'https://picsum.photos/400/450?random=5', prompt: 'Modern luxury car in urban setting, sleek design, professional automotive photography', type: 'image' as const },
  { id: 6, imageUrl: 'https://picsum.photos/400/600?random=6', prompt: 'Cute sloth hanging from tree branch, soft pastel colors, adorable animal illustration', type: 'image' as const },
  { id: 7, imageUrl: 'https://picsum.photos/400/650?random=7', prompt: 'Professional headshot of businesswoman, clean background, corporate photography style', type: 'image' as const },
  { id: 8, imageUrl: 'https://picsum.photos/400/500?random=8', prompt: 'Artistic portrait with warm lighting, creative composition, artistic photography', type: 'image' as const },
  { id: 9, imageUrl: 'https://picsum.photos/400/550?random=9', prompt: 'Minimalist portrait with clean lines, soft lighting, modern photography style', type: 'image' as const },
  { id: 10, imageUrl: 'https://picsum.photos/400/450?random=10', prompt: 'Abstract geometric composition, minimalist design, modern art style', type: 'image' as const },
  { id: 11, imageUrl: 'https://picsum.photos/400/600?random=11', prompt: 'Portrait of a man with confident expression, professional lighting, business photography', type: 'image' as const },
  { id: 12, imageUrl: 'https://picsum.photos/400/700?random=12', prompt: 'Fantasy landscape with mountains and magical creatures, epic fantasy art', type: 'image' as const },
  { id: 13, imageUrl: 'https://picsum.photos/400/500?random=13', prompt: 'Urban street photography with dramatic shadows and lighting', type: 'image' as const },
  { id: 14, imageUrl: 'https://picsum.photos/400/600?random=14', prompt: 'Nature photography of forest with sunlight filtering through trees', type: 'image' as const },
  { id: 15, imageUrl: 'https://picsum.photos/400/550?random=15', prompt: 'Architectural photography of modern building with geometric patterns', type: 'image' as const },
  { id: 16, imageUrl: 'https://picsum.photos/400/650?random=16', prompt: 'Food photography with artistic presentation and lighting', type: 'image' as const },
  { id: 17, imageUrl: 'https://picsum.photos/400/500?random=17', prompt: 'Wildlife photography of exotic bird in natural habitat', type: 'image' as const },
  { id: 18, imageUrl: 'https://picsum.photos/400/600?random=18', prompt: 'Fashion photography with creative styling and composition', type: 'image' as const },
  { id: 19, imageUrl: 'https://picsum.photos/400/700?random=19', prompt: 'Travel photography of famous landmark with unique perspective', type: 'image' as const },
  { id: 20, imageUrl: 'https://picsum.photos/400/450?random=20', prompt: 'Macro photography of flower with intricate details and colors', type: 'image' as const },
])

// 社区视频数据
const communityVideos = reactive([
  { id: 21, imageUrl: 'https://picsum.photos/400/600?random=21', prompt: 'Cinematic video of ocean waves crashing against rocks, dramatic lighting', type: 'video' as const },
  { id: 22, imageUrl: 'https://picsum.photos/400/500?random=22', prompt: 'Time-lapse video of city traffic at night, neon lights and movement', type: 'video' as const },
  { id: 23, imageUrl: 'https://picsum.photos/400/550?random=23', prompt: 'Nature documentary style video of birds flying in formation', type: 'video' as const },
  { id: 24, imageUrl: 'https://picsum.photos/400/700?random=24', prompt: 'Artistic video of dancer performing contemporary choreography', type: 'video' as const },
  { id: 25, imageUrl: 'https://picsum.photos/400/450?random=25', prompt: 'Food preparation video with close-up shots and smooth transitions', type: 'video' as const },
  { id: 26, imageUrl: 'https://picsum.photos/400/600?random=26', prompt: 'Travel video showcasing beautiful landscapes and cultural moments', type: 'video' as const },
  { id: 27, imageUrl: 'https://picsum.photos/400/650?random=27', prompt: 'Fashion video with model walking through urban environment', type: 'video' as const },
  { id: 28, imageUrl: 'https://picsum.photos/400/500?random=28', prompt: 'Architectural video tour of modern building with dynamic camera movements', type: 'video' as const },
  { id: 29, imageUrl: 'https://picsum.photos/400/550?random=29', prompt: 'Sports video capturing athlete in action with slow motion effects', type: 'video' as const },
  { id: 30, imageUrl: 'https://picsum.photos/400/450?random=30', prompt: 'Music video with creative visual effects and storytelling', type: 'video' as const },
])

// 根据当前标签过滤内容
const filteredContent = computed(() => {
  switch (activeTab.value) {
    case 'image':
      return communityImages
    case 'video':
      return communityVideos
    case 'styles':
      return [...communityImages, ...communityVideos].slice(0, 10) // 混合内容
    case 'top-creators':
      return [...communityImages, ...communityVideos].slice(0, 8) // 精选内容
    default:
      return communityImages
  }
})

// 切换标签
function switchTab(tabId: string) {
  activeTab.value = tabId
}

// 处理重新创建
function handleRecreate(item: typeof communityImages[0]) {
  console.warn('Recreating from community item:', item)
  // 这里可以添加跳转到生成页面的逻辑
}
</script>

<template>
  <div class="p-6 overflow-y-auto bg-white dark:bg-gray-900">
    <!-- 页面标题 -->
    <div class="text-center py-16">
      <h1 class="text-3xl text-gray-900 dark:text-gray-100">
        Get inspired by hundreds of amazing<br>
        community artists
      </h1>
    </div>

    <!-- 标签页导航 -->
    <div class="flex items-center justify-between mb-8">
      <!-- 标签页 -->
      <div class="flex space-x-2">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
          :class="[
            activeTab === tab.id
              ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700',
          ]"
          @click="switchTab(tab.id)"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- My profile链接 -->
      <a href="#" class="text-gray-900 dark:text-gray-100 text-sm font-medium hover:text-gray-600 dark:hover:text-gray-400">
        My profile
      </a>
    </div>

    <!-- 瀑布流组件 -->
    <WaterfallGrid
      :items="filteredContent"
      @recreate="handleRecreate"
    />
  </div>
</template>

<style scoped>
/* 自定义样式 */
</style>
