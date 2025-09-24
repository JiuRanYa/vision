<script setup lang="ts">
import { reactive } from 'vue'
import WaterfallGrid from '@/components/WaterfallGrid.vue'

// 社区瀑布流数据
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

// 处理重新创建
function handleRecreate(item: typeof communityImages[0]) {
  console.warn('Recreating from community item:', item)
  // 这里可以添加跳转到生成页面的逻辑
}
</script>

<template>
  <div class="p-6 overflow-y-auto">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">
        Community
      </h1>
      <p class="text-gray-600">
        Discover amazing creations from our community
      </p>
    </div>

    <!-- 瀑布流组件 -->
    <WaterfallGrid
      :items="communityImages"
      @recreate="handleRecreate"
    />
  </div>
</template>

<style scoped>
/* 自定义样式 */
</style>
