<script setup lang="ts">
import { KTDropdown } from '@keenthemes/ktui/src'
import { nextTick, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 图片数据
const imageData = ref({
  id: null,
  imageUrl: '',
  prompt: '',
  originalPrompt: '',
})

// 编辑状态
const isEditing = ref(false)
const editHistory = reactive([])

// 编辑工具状态
const activeTool = ref('auto-enhance')

// 历史图片数据
const historyImages = reactive([
  { id: 1, imageUrl: 'https://picsum.photos/400/400?random=1', prompt: 'A beautiful portrait of a woman with flowing hair' },
  { id: 2, imageUrl: 'https://picsum.photos/400/400?random=2', prompt: 'Underwater scene with jellyfish floating gracefully' },
  { id: 3, imageUrl: 'https://picsum.photos/400/400?random=3', prompt: 'Sunset portrait with golden hour lighting' },
  { id: 4, imageUrl: 'https://picsum.photos/400/400?random=4', prompt: 'Medieval fantasy warrior with sword' },
  { id: 5, imageUrl: 'https://picsum.photos/400/400?random=5', prompt: 'Modern luxury car in urban setting' },
  { id: 6, imageUrl: 'https://picsum.photos/400/400?random=6', prompt: 'Cute sloth hanging from tree branch' },
  { id: 7, imageUrl: 'https://picsum.photos/400/400?random=7', prompt: 'Professional headshot of businesswoman' },
  { id: 8, imageUrl: 'https://picsum.photos/400/400?random=8', prompt: 'Artistic portrait with warm lighting' },
  { id: 9, imageUrl: 'https://picsum.photos/400/400?random=9', prompt: 'Minimalist portrait with clean lines' },
  { id: 10, imageUrl: 'https://picsum.photos/400/400?random=10', prompt: 'Abstract geometric composition' },
  { id: 11, imageUrl: 'https://picsum.photos/400/400?random=11', prompt: 'Portrait of a man with confident expression' },
  { id: 12, imageUrl: 'https://picsum.photos/400/400?random=12', prompt: 'Landscape with mountains and lake' },
  { id: 13, imageUrl: 'https://picsum.photos/400/400?random=13', prompt: 'Urban street scene at night' },
  { id: 14, imageUrl: 'https://picsum.photos/400/400?random=14', prompt: 'Close-up of flower in garden' },
  { id: 15, imageUrl: 'https://picsum.photos/400/400?random=15', prompt: 'Architectural detail of modern building' },
  { id: 16, imageUrl: 'https://picsum.photos/400/400?random=16', prompt: 'Vintage car in classic setting' },
])

// 选中的历史图片索引
const selectedHistoryIndex = ref(-1)

// 初始化数据
onMounted(() => {
  // 从路由参数获取图片数据
  if (route.query.imageId) {
    imageData.value.id = route.query.imageId
    imageData.value.imageUrl = route.query.imageUrl as string || ''
    imageData.value.prompt = route.query.prompt as string || ''
    imageData.value.originalPrompt = imageData.value.prompt
  }
})

// 选择工具
function selectTool(toolId: string) {
  activeTool.value = toolId
}

// 选择历史图片
function selectHistoryImage(item: any) {
  selectedHistoryIndex.value = historyImages.findIndex(img => img.id === item.id)
  imageData.value.imageUrl = item.imageUrl
  imageData.value.prompt = item.prompt
}

// 应用滤镜
function applyFilter(filterId: string) {
  console.warn('Applying filter:', filterId)
  // 这里可以添加滤镜应用逻辑
}

// 保存编辑
function saveEdit() {
  console.warn('Saving edit:', imageData.value)
  // 这里可以添加保存逻辑
}

// 撤销操作
function undoEdit() {
  if (editHistory.length > 0) {
    editHistory.pop()
    console.warn('Undo edit')
  }
}

// 重做操作
function redoEdit() {
  console.warn('Redo edit')
  // 这里可以添加重做逻辑
}

// 导出图片
function exportImage() {
  console.warn('Exporting image')
  // 这里可以添加导出逻辑
}

// 返回上一页
function goBack() {
  router.back()
}

onMounted(() => {
  nextTick(() => {
    KTDropdown.init()
  })
})
</script>

<template>
  <div class="relative h-full min-h-0 bg-white dark:bg-gray-900 flex">
    <!-- 主编辑区域 -->
    <div class="relative flex-1 flex items-center justify-center p-8">
      <div class="max-w-full max-h-full">
        <img
          v-if="imageData.imageUrl"
          :src="imageData.imageUrl"
          :alt="imageData.prompt"
          class="max-w-full max-h-full object-contain rounded-lg shadow-lg"
        >
        <div v-else class="text-gray-400 dark:text-gray-500 text-center">
          <div class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="ki-outline ki-picture text-2xl" />
          </div>
          <p>没有图片可编辑</p>
        </div>
      </div>

      <!-- 悬浮工具栏 -->
      <div class="absolute bottom-6  bg-gray-100 dark:bg-gray-600 rounded-lg">
        <div class="flex items-center space-x-6">
          <!-- 自动增强 -->
          <div
            class="inline-flex me-0"
            data-kt-dropdown="true"
            data-kt-dropdown-trigger="click"
            data-kt-dropdown-placement="top"
          >
            <button
              class="w-10 h-10 flex items-center justify-center transition-colors me-0"
              :class="[
                activeTool === 'auto-enhance'
                  ? 'text-gray-900 dark:text-gray-100'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100',
              ]"
              title="自动增强"
              data-kt-dropdown-toggle="true"
              @click="selectTool('auto-enhance')"
            >
              <i class="ki-outline ki-star" />
            </button>

            <!-- Chat聊天框 -->
            <div class="kt-dropdown w-[500px] h-[100px] p-4 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg" data-kt-dropdown-menu="true">
              <!-- 标题 -->
              <input class="w-full bg-transparent border-none hover:shadow-none outline-0" placeholder="What you want to change">
            </div>
          </div>

          <!-- 修补 -->
          <button
            class="w-10 h-10 flex items-center justify-center transition-colors me-0"
            :class="[
              activeTool === 'patch'
                ? 'text-gray-900 dark:text-gray-100'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100',
            ]"
            title="修补"
            @click="selectTool('patch')"
          >
            <i class="ki-outline ki-paintbucket" />
          </button>

          <!-- 特效 -->
          <button
            class="w-10 h-10 flex items-center justify-center transition-colors me-0"
            :class="[
              activeTool === 'effects'
                ? 'text-gray-900 dark:text-gray-100'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100',
            ]"
            title="特效"
            @click="selectTool('effects')"
          >
            <i class="ki-outline ki-star" />
          </button>

          <!-- 对比 -->
          <button
            class="w-10 h-10 flex items-center justify-center transition-colors me-0"
            :class="[
              activeTool === 'compare'
                ? 'text-gray-900 dark:text-gray-100'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100',
            ]"
            title="对比"
            @click="selectTool('compare')"
          >
            <i class="ki-outline ki-element-8" />
          </button>

          <!-- 展开 -->
          <button
            class="w-10 h-10 flex items-center justify-center transition-colors me-0"
            :class="[
              activeTool === 'expand'
                ? 'text-gray-900 dark:text-gray-100'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100',
            ]"
            title="展开"
            @click="selectTool('expand')"
          >
            <i class="ki-outline ki-maximize" />
          </button>

          <!-- 调整 -->
          <button
            class="w-10 h-10 flex items-center justify-center transition-colors me-0"
            :class="[
              activeTool === 'adjust'
                ? 'text-gray-900 dark:text-gray-100'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100',
            ]"
            title="调整"
            @click="selectTool('adjust')"
          >
            <i class="ki-outline ki-setting-2" />
          </button>
        </div>
      </div>
    </div>

    <!-- 右侧历史图片区域 -->
    <div class="border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <!-- 历史图片列表 -->
      <div class="p-4 space-y-3 overflow-y-auto scrollbar-hide" style="height: calc(100vh - 32px);">
        <div
          v-for="(item, index) in historyImages"
          :key="index"
          class="relative group cursor-pointer"
          @click="selectHistoryImage(item)"
        >
          <div class="aspect-squar size-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
            <img
              :src="item.imageUrl"
              :alt="item.prompt"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            >
          </div>
          <!-- 选中状态指示器 -->
          <div
            v-if="selectedHistoryIndex === index"
            class="absolute inset-0 border-2 border-blue-500 rounded-lg"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 自定义样式 */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}
</style>
