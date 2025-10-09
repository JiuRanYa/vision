<script setup lang="ts">
import { KTDropdown } from '@keenthemes/ktui/src'
import { nextTick, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { generateImage, getHistoryImages } from '@/api/image'

const route = useRoute()

// 图片数据
const imageData = ref({
  id: null,
  imageUrl: '',
  prompt: '',
  originalPrompt: '',
})

// 编辑工具状态
const activeTool = ref('auto-enhance')

// 编辑提示词
const editPrompt = ref('')

// 历史图片数据
const historyImages = ref([])
const isLoadingHistory = ref(false)

// 选中的历史图片索引
const selectedHistoryIndex = ref(-1)

// 加载历史生成图片
async function loadHistoryImages() {
  isLoadingHistory.value = true
  try {
    const { data } = await getHistoryImages(1, 16)
    historyImages.value.splice(0, historyImages.value.length, ...data.value.data)
    selectedHistoryIndex.value = historyImages.value.findIndex(img => img.id === imageData.value.id * 1)
    console.log(selectedHistoryIndex.value)
  }
  catch (error) {
    console.error('Error loading history images:', error)
  }
  finally {
    isLoadingHistory.value = false
  }
}

// 初始化数据
onMounted(() => {
  // 从路由参数获取图片数据
  if (route.query.imageId) {
    imageData.value.id = route.query.imageId
    imageData.value.imageUrl = route.query.file_key ? `/api/s3/proxy?key=${route.query.file_key}` : ''
    imageData.value.prompt = route.query.prompt as string || ''
    imageData.value.originalPrompt = imageData.value.prompt
  }

  // 加载历史图片数据
  loadHistoryImages()
})

// 选择工具
function selectTool(toolId: string) {
  activeTool.value = toolId
}

// 选择历史图片
function selectHistoryImage(item: any) {
  selectedHistoryIndex.value = historyImages.value.findIndex(img => img.id === item.id)
  imageData.value.imageUrl = `/api/s3/proxy?key=${item.response.file_key}`
  imageData.value.prompt = item.prompt
}

// 处理发送编辑提示词
async function handleSendPrompt() {
  if (!editPrompt.value.trim()) {
    return
  }

  const prompt = editPrompt.value
  editPrompt.value = '' // 清空输入框
  const { data } = await generateImage(prompt, {
    attachment: historyImages.value[selectedHistoryIndex.value].response,
  })
  historyImages.value.push(data.value)
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
          class="max-h-[80vh] object-contain rounded-lg shadow-lg"
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
            <div class="kt-dropdown w-[500px] h-[100px] p-4 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg relative" data-kt-dropdown-menu="true">
              <!-- 输入框 -->
              <input
                v-model="editPrompt"
                class="w-full bg-transparent border-none hover:shadow-none outline-0 pr-12"
                placeholder="What you want to change"
              >
              <!-- 发送按钮 -->
              <button
                class="absolute right-2 bottom-2 w-8 h-8 bg-primary hover:bg-primary-dark text-white rounded-full flex items-center justify-center transition-colors"
                @click="handleSendPrompt"
              >
                <i class="ki-outline ki-paper-plane text-sm" />
              </button>
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
    <div class="w-24 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <!-- 历史图片列表 -->
      <div class="p-4 space-y-3 overflow-y-auto scrollbar-hide" style="height: calc(100vh - 64px);">
        <div
          v-for="(item, index) in historyImages"
          :key="index"
          class="relative group cursor-pointer"
          @click="selectHistoryImage(item)"
        >
          <div class="aspect-squar size-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
            <img
              :src="`/api/s3/proxy?key=${item.response.file_key}`"
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
