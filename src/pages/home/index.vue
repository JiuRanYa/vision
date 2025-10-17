<script setup lang="ts">
import type { Creation } from '@/types/creation'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getHistoryImages } from '@/api/image'

const router = useRouter()

// 搜索关键词
const searchQuery = ref('')

// 创建工具卡片
const createTools = [
  {
    icon: 'ki-search-list',
    title: 'Find stock',
    link: '/community',
    bgColor: 'bg-gray-50 dark:bg-gray-800',
  },
  {
    icon: 'ki-picture',
    title: 'Generate image',
    link: '/image-generator',
    bgColor: 'bg-gray-50 dark:bg-gray-800',
  },
  {
    icon: 'ki-video',
    title: 'Generate video',
    link: '/video-generator',
    bgColor: 'bg-gray-50 dark:bg-gray-800',
  },
  {
    icon: 'ki-microphone',
    title: 'Create voiceover',
    link: '/video-generator',
    bgColor: 'bg-gray-50 dark:bg-gray-800',
  },
  {
    icon: 'ki-message-text',
    title: 'Chat with AI',
    link: '/image-generator',
    bgColor: 'bg-gray-50 dark:bg-gray-800',
  },
  {
    icon: 'ki-element-11',
    title: 'More tools',
    link: '/community',
    bgColor: 'bg-gray-50 dark:bg-gray-800',
  },
]

// Recent creations 标签页
const creationTabs = ['All', 'Images', 'Videos', 'Video Projects', 'Designs', 'Audio']
const activeCreationTab = ref('All')

// Workflows 标签页
const workflowTabs = [
  'Featured',
  'Specialists',
  'Branding',
  'Advertising',
  'Social Media',
  'E-commerce',
  'Photography',
  'Fashion',
  'Architecture',
  'Printed materials',
  'Fun',
]
const activeWorkflowTab = ref('Featured')

// Recent creations 数据
const recentCreations = reactive<Creation[]>([])
const isLoadingCreations = ref(false)

// Videos 数据
const videos = ref([
  {
    id: 1,
    image: 'https://picsum.photos/800/1000?random=11',
    title: 'Portrait Photography',
    category: 'Photography',
  },
  {
    id: 2,
    image: 'https://picsum.photos/800/1000?random=12',
    title: 'Product Design',
    category: 'Branding',
  },
  {
    id: 3,
    image: 'https://picsum.photos/800/1000?random=13',
    title: 'Fashion Editorial',
    category: 'Fashion',
  },
  {
    id: 4,
    image: 'https://picsum.photos/800/1000?random=14',
    title: 'Tech Innovation',
    category: 'Advertising',
  },
  {
    id: 5,
    image: 'https://picsum.photos/800/1000?random=15',
    title: 'Sports Dynamic',
    category: 'Social Media',
  },
])

// 加载最近创作
async function loadRecentCreations() {
  isLoadingCreations.value = true
  try {
    const { data } = await getHistoryImages(1, 5)

    // 直接使用接口返回的数据，并转换为Creation类型
    const mappedImages = data.value.data as Creation[]

    recentCreations.splice(0, recentCreations.length, ...mappedImages)
  }
  catch (error) {
    console.error('Error loading recent creations:', error)
  }
  finally {
    isLoadingCreations.value = false
  }
}

// 导航到指定页面
function navigateTo(link: string) {
  router.push(link)
}

// 处理搜索
function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/community',
      query: { search: searchQuery.value },
    })
  }
}

// 图片搜索
function handleImageSearch() {
  // TODO: 实现图片搜索功能
  console.warn('Image search not implemented yet')
}

// 格式化时间
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0)
    return 'today'
  if (diffInDays === 1)
    return 'yesterday'
  if (diffInDays < 7)
    return `${diffInDays} days ago`
  if (diffInDays < 14)
    return 'last week'
  if (diffInDays < 30)
    return `${Math.floor(diffInDays / 7)} weeks ago`
  return 'last month'
}

onMounted(() => {
  loadRecentCreations()
})
</script>

<template>
  <div class="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
    <div class="max-w-[1400px] mx-auto px-6 py-8">
      <!-- 顶部搜索栏 -->
      <div class="flex items-center gap-4 mb-12">
        <div class="flex-1 relative">
          <i class="ki-outline ki-magnifier absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search assets or start creating"
            class="w-full h-12 pl-12 pr-14 bg-gray-50 dark:bg-gray-800 border-0 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition-all"
            @keyup.enter="handleSearch"
          >
          <button
            class="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            @click="handleImageSearch"
          >
            <i class="ki-outline ki-picture text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        <button class="kt-btn kt-btn-ghost text-orange-600 dark:text-orange-400 font-medium">
          Pricing
        </button>
        <button class="w-10 h-10 flex items-center justify-center bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
          👑
        </button>
      </div>

      <!-- 主标题区域 -->
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          What would you like to create today?
        </h1>
        <button class="kt-btn kt-btn-light rounded-full">
          How to start with AI
        </button>
      </div>

      <!-- 创建工具网格 -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
        <button
          v-for="tool in createTools"
          :key="tool.title"
          class="group p-6 rounded-2xl transition-all hover:shadow-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500"
          :class="tool.bgColor"
          @click="navigateTo(tool.link)"
        >
          <div class="flex flex-col items-center text-center">
            <div class="w-12 h-12 mb-4 flex items-center justify-center bg-white dark:bg-gray-700 rounded-xl group-hover:scale-110 transition-transform">
              <i :class="`ki-outline ${tool.icon} text-2xl text-blue-600 dark:text-blue-400`" />
            </div>
            <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ tool.title }}
            </span>
          </div>
        </button>
      </div>

      <!-- Recent creations -->
      <div class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            Recent creations
          </h2>
          <button
            class="kt-btn kt-btn-ghost text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            @click="navigateTo('/my-creations')"
          >
            My creations
            <i class="ki-outline ki-arrow-right text-xs ml-1" />
          </button>
        </div>

        <!-- 标签页 -->
        <div class="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hover pb-2">
          <button
            v-for="tab in creationTabs"
            :key="tab"
            class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all"
            :class="[
              activeCreationTab === tab
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700',
            ]"
            @click="activeCreationTab = tab"
          >
            {{ tab }}
          </button>
        </div>

        <!-- 创作卡片网格 -->
        <!-- Loading状态 -->
        <div v-if="isLoadingCreations" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div
            v-for="i in 5"
            :key="i"
            class="aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"
          />
        </div>
        <!-- 数据展示 -->
        <div v-else-if="recentCreations.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div
            v-for="creation in recentCreations"
            :key="creation.id"
            class="group relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer hover:shadow-xl transition-all"
            @click="navigateTo(`/image-edit?creationId=${creation.id}`)"
          >
            <div class="aspect-[3/4] overflow-hidden">
              <img
                :src="`/api/s3/proxy?key=${creation.response.file_key}`"
                :alt="creation.prompt"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              >
            </div>
            <!-- 悬停信息 -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div class="absolute bottom-0 left-0 right-0 p-4">
                <p class="text-white text-sm font-medium line-clamp-2 mb-1">
                  {{ creation.prompt }}
                </p>
                <p class="text-white/70 text-xs">
                  {{ formatTimeAgo(creation.created_at) }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- 空状态 -->
        <div v-else class="text-center py-12">
          <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="ki-outline ki-picture text-2xl text-gray-400" />
          </div>
          <p class="text-gray-500 dark:text-gray-400">
            No recent creations yet. Start creating!
          </p>
        </div>
      </div>

      <!-- Videos -->
      <div>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            Videos
          </h2>
          <button
            class="kt-btn kt-btn-ghost text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            @click="navigateTo('/video-generator')"
          >
            View all
            <i class="ki-outline ki-arrow-right text-xs ml-1" />
          </button>
        </div>

        <!-- 标签页 -->
        <div class="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hover pb-2">
          <button
            v-for="tab in workflowTabs"
            :key="tab"
            class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all"
            :class="[
              activeWorkflowTab === tab
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700',
            ]"
            @click="activeWorkflowTab = tab"
          >
            {{ tab }}
          </button>
        </div>

        <!-- Videos 网格 -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div
            v-for="video in videos"
            :key="video.id"
            class="group relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer hover:shadow-xl transition-all"
            @click="navigateTo('/video-generator')"
          >
            <div class="aspect-[3/4] overflow-hidden">
              <img
                :src="video.image"
                :alt="video.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              >
            </div>
            <!-- 播放按钮图标 -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-16 h-16 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-black/70 transition-colors">
                <i class="ki-solid ki-play text-white text-2xl ml-1" />
              </div>
            </div>
            <!-- 类别标签 -->
            <div class="absolute top-3 left-3">
              <span class="px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full">
                {{ video.category }}
              </span>
            </div>
            <!-- 悬停信息 -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div class="absolute bottom-0 left-0 right-0 p-4">
                <p class="text-white text-sm font-medium">
                  {{ video.title }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 自定义滚动条样式 */
.scrollbar-hover {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}

.scrollbar-hover:hover {
  scrollbar-color: rgb(209 213 219) transparent;
}

.scrollbar-hover::-webkit-scrollbar {
  height: 6px;
}

.scrollbar-hover::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-hover::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 3px;
}

.scrollbar-hover:hover::-webkit-scrollbar-thumb {
  background-color: rgb(209 213 219);
}

.dark .scrollbar-hover:hover::-webkit-scrollbar-thumb {
  background-color: rgb(75 85 99);
}
</style>
