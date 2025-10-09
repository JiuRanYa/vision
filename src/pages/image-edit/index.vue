<script setup lang="ts">
import type { Creation } from '@/types/creation'
import { KTDropdown } from '@keenthemes/ktui/src'
import { nextTick, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { generateImage, getHistoryImages } from '@/api/image'
import { ApiService } from '@/service/fetch'

const route = useRoute()

// 图片数据
const imageData = ref<Creation>()

// 编辑工具状态
const activeTool = ref('auto-enhance')

// 编辑提示词
const editPrompt = ref('')

// 历史图片数据
const historyImages = ref<Creation[]>([])
const isLoadingHistory = ref(false)
const confirmSaving = ref(true)

const imageEditHistoryImages = ref([
  {
    id: 30,
    prompt: 'remove the black cat',
    metadata: {
      attachment: {
        text: '',
        file_key: 'vision/同思远/png/226ea18f-c139-4602-9068-6720d207176d-1759998763711.png',
        mimeType: 'image/png',
        file_name: '226ea18f-c139-4602-9068-6720d207176d',
        file_size: 2446288,
        file_extension: 'png',
      },
    },
    response: {
      text: '',
      file_key: 'vision/同思远/png/fce8ca86-74e2-42c4-9704-cb69d04071b2-1759998821414.png',
      mimeType: 'image/png',
      file_name: 'fce8ca86-74e2-42c4-9704-cb69d04071b2',
      file_size: 2397207,
      file_extension: 'png',
    },
    created_at: '2025-10-09T08:33:42.385Z',
    creator: {
      _id: '01231629201321476459',
      name: '同思远',
      email: 'tongsiyuan@bolegames.com',
      title: '全栈开发工程师',
    },
    is_archived: false,
  },
  {
    id: 30,
    prompt: 'remove the black cat',
    metadata: {
      attachment: {
        text: '',
        file_key: 'vision/同思远/png/226ea18f-c139-4602-9068-6720d207176d-1759998763711.png',
        mimeType: 'image/png',
        file_name: '226ea18f-c139-4602-9068-6720d207176d',
        file_size: 2446288,
        file_extension: 'png',
      },
    },
    response: {
      text: '',
      file_key: 'vision/同思远/png/fce8ca86-74e2-42c4-9704-cb69d04071b2-1759998821414.png',
      mimeType: 'image/png',
      file_name: 'fce8ca86-74e2-42c4-9704-cb69d04071b2',
      file_size: 2397207,
      file_extension: 'png',
    },
    created_at: '2025-10-09T08:33:42.385Z',
    creator: {
      _id: '01231629201321476459',
      name: '同思远',
      email: 'tongsiyuan@bolegames.com',
      title: '全栈开发工程师',
    },
    is_archived: false,
  },
])

// 选中的历史图片索引
const selectedHistoryIndex = ref(-1)

// 加载历史生成图片
async function loadHistoryImages() {
  isLoadingHistory.value = true
  try {
    const { data } = await getHistoryImages(1, 16)
    historyImages.value.splice(0, historyImages.value.length, ...data.value.data)
    selectedHistoryIndex.value = historyImages.value.findIndex(img => img.id === imageData.value.id * 1)
  }
  catch (error) {
    console.error('Error loading history images:', error)
  }
  finally {
    isLoadingHistory.value = false
  }
}

// 初始化数据
onMounted(async () => {
  // 从路由参数获取图片数据
  if (route.query.creationId) {
    const { data } = await ApiService.get(`/creation/${route.query.creationId}`)
    imageData.value = data.value
  }

  // 加载历史图片数据
  await loadHistoryImages()
})

// 选择工具
function selectTool(toolId: string) {
  activeTool.value = toolId
}

// 选择历史图片
function selectHistoryImage(item: any) {
  selectedHistoryIndex.value = historyImages.value.findIndex(img => img.id === item.id)
  imageData.value = { ...item }
  console.log(item)
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
    <div class="relative flex-1 flex items-center justify-center p-8 z-[120]">
      <div class="max-w-full max-h-full">
        <img
          v-if="imageData?.response?.file_key"
          :src="`/api/s3/proxy?key=${imageData.response.file_key}`"
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
      <div v-if="!confirmSaving" class="absolute bottom-6  bg-gray-100 dark:bg-gray-600 rounded-lg">
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
            @click="confirmSaving = true"
          >
            <i class="ki-outline ki-setting-2" />
          </button>
        </div>
      </div>

      <!-- 确认保存 -->
      <div v-else class="absolute bottom-6  bg-gray-100 dark:bg-gray-600 rounded-lg flex gap-2 p-2">
        <div v-for="(item, index) in imageEditHistoryImages" :key="index">
          <div class="size-10 relative">
            <img
              :src="`/api/s3/proxy?key=${item.response.file_key}`"
              :alt="item.prompt"
              class="rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700"
            >
            <div v-if="imageData?.id === item.id" class="absolute inset-0 border-2 border-blue-500 rounded-lg" />
          </div>
        </div>
        <button class="w-10 h-10 flex items-center justify-center transition-colors me-0" @click="confirmSaving = false">
          <i class="ki-outline ki-check" />
        </button>
      </div>
    </div>

    <!-- 右侧历史图片区域 -->
    <div class="w-24 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <!-- 历史图片列表 -->
      <div class="p-4 space-y-3 overflow-y-auto scrollbar-hide" style="height: calc(100vh - 64px);">
        <div
          v-for="(item, index) in historyImages"
          :key="item.id"
          class="relative group cursor-pointer"
          @click="selectHistoryImage(item)"
        >
          <div class="aspect-square size-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
            <img
              :src="`/api/s3/proxy?key=${item.response.file_key}`"
              :alt="item.prompt"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            >
          </div>
          <!-- 选中状态指示器 -->
          <div
            v-if="imageData?.id === item.id"
            class="absolute inset-0 border-2 border-blue-500 rounded-lg"
          />
        </div>
      </div>
    </div>
  </div>

  <div v-if="confirmSaving" class="fixed inset-0 bg-white opacity-70 size-full z-100" />
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
