<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { generateImage, getHistoryImages } from '@/api/image'
import CommunityGrid from '@/components/CommunityGrid.vue'
import PublishModal from '@/pages/image-generator/components/PublishModal.vue'
import ShareModal from '@/pages/image-generator/components/ShareModal.vue'
import ImageConfig from '@/pages/image-generator/ImageConfig.vue'
import { ApiService } from '@/service/fetch'

const router = useRouter()

// 加载更多触发器的ref
const loadMoreTrigger = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const imageConfig = ref({
  prompt: '',
  model: 'Auto',
  modelId: 1,
  style: '',
  composition: '',
  effects: '',
  character: '',
  object: '',
  colors: '',
})

const isGenerating = ref(false)

// 打字机动画状态
const isTyping = ref(false)

// 标签页状态
const activeTab = ref('history')

// 标签页配置
const tabs = [
  { id: 'history', label: 'History' },
  { id: 'inspiration', label: 'Inspiration' },
]

// 历史生成图片
const historyGeneratedImages = reactive([])
const isLoadingHistory = ref(false)
const isLoadingMoreHistory = ref(false)

// 当前生成的图片
const currentGeneratedImage = ref(null)

// 分页参数
const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNext: false,
  hasPrev: false,
})

// 加载历史生成图片（初始加载）
async function loadHistoryImages() {
  isLoadingHistory.value = true
  try {
    const { data } = await getHistoryImages(1, pagination.limit)

    // 直接使用接口返回的数据
    const mappedImages = data.value.data

    historyGeneratedImages.splice(0, historyGeneratedImages.length, ...mappedImages)

    // 更新分页信息
    pagination.page = 1
    pagination.total = data.value.pagination.total
    pagination.totalPages = data.value.pagination.totalPages
    pagination.hasNext = data.value.pagination.hasNext
    pagination.hasPrev = data.value.pagination.hasPrev
  }
  catch (error) {
    console.error('Error loading history images:', error)
  }
  finally {
    isLoadingHistory.value = false
  }
}

// 加载更多历史图片
async function loadMoreHistoryImages() {
  if (isLoadingMoreHistory.value || !pagination.hasNext)
    return

  isLoadingMoreHistory.value = true
  try {
    const nextPage = pagination.page + 1
    const { data } = await getHistoryImages(nextPage, pagination.limit)

    // 追加新数据
    const mappedImages = data.value.data
    historyGeneratedImages.push(...mappedImages)

    // 更新分页信息
    pagination.page = nextPage
    pagination.total = data.value.pagination.total
    pagination.totalPages = data.value.pagination.totalPages
    pagination.hasNext = data.value.pagination.hasNext
    pagination.hasPrev = data.value.pagination.hasPrev
  }
  catch (error) {
    console.error('Error loading more history images:', error)
  }
  finally {
    isLoadingMoreHistory.value = false
  }
}

async function handleGenerate() {
  console.warn('Generating image with config:', imageConfig)

  isGenerating.value = true
  currentGeneratedImage.value = null

  try {
    const { data } = await generateImage(imageConfig.value.prompt)

    // 直接使用接口返回的数据
    const newImage = data.value

    // 设置当前生成的图片
    currentGeneratedImage.value = newImage

    // 添加到历史记录
    historyGeneratedImages.unshift(newImage)
    pagination.total += 1
  }
  catch (error) {
    console.error('Error generating image:', error)
  }
  finally {
    isGenerating.value = false
  }
}

// Inspiration社区图片数据
const inspirationImages = reactive([])
const isLoadingInspiration = ref(false)

// 加载Inspiration数据
async function loadInspirationImages() {
  isLoadingInspiration.value = true
  try {
    const { data } = await ApiService.get('/inspiration')

    // 直接使用API返回的Inspiration数据
    inspirationImages.splice(0, inspirationImages.length, ...data.value)
  }
  catch (error) {
    console.error('Error loading inspiration images:', error)
  }
  finally {
    isLoadingInspiration.value = false
  }
}

// 设置无限滚动观察器
function setupInfiniteScroll() {
  if (observer) {
    observer.disconnect()
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && pagination.hasNext && !isLoadingMoreHistory.value) {
          loadMoreHistoryImages()
        }
      })
    },
    {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    },
  )

  if (loadMoreTrigger.value) {
    observer.observe(loadMoreTrigger.value)
  }
}

// 组件挂载时加载数据
onMounted(async () => {
  await loadHistoryImages()
  await loadInspirationImages()

  // 等待DOM更新后设置观察器
  nextTick(() => {
    setupInfiniteScroll()
  })
})

// 组件卸载时清理观察器
onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})

function typewriterEffect(text: string, callback?: () => void) {
  if (isTyping.value) {
    return // 防止重复触发
  }

  isTyping.value = true
  imageConfig.value.prompt = ''

  let index = 0
  const typeNextChar = () => {
    if (index < text.length) {
      imageConfig.value.prompt += text[index]
      index++
      setTimeout(typeNextChar, 5)
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

function handleRecreate(item: typeof inspirationImages[0]) {
  console.warn('Recreating from inspiration item:', item)
  // 使用打字机动画填充prompt
  typewriterEffect(item.creation.prompt)
}

// 切换标签页
function switchTab(tabId: string) {
  activeTab.value = tabId
}

// 处理编辑图片
function handleEditImage(image: any) {
  console.warn('Editing image:', image)
  // 跳转到图片编辑页面，传递图片数据
  router.push({
    path: '/image-edit',
    query: {
      creationId: image.id,
    },
  })
}

// 处理重新创建（从分享modal）
function handleRecreateFromShare(item: any) {
  console.warn('Recreating from share modal:', item)
  // 使用打字机动画填充prompt
  typewriterEffect(item.prompt)
}

// 处理复制链接
function handleCopyLink(item: any) {
  console.warn('Copying link for:', item)
  // 这里应该实现实际的链接复制功能
  const link = `${window.location.origin}/share/${item.id}`
  navigator.clipboard.writeText(link).then(() => {
    // 可以添加toast提示
    console.warn('Link copied to clipboard')
  })
}

// 处理创建视频
function handleCreateVideo(item: any) {
  console.warn('Creating video for:', item)
  // 这里应该跳转到视频生成页面
  router.push({
    path: '/video-generator',
    query: {
      imageId: item.id,
      file_key: item.response.file_key,
      prompt: item.prompt || '',
    },
  })
}

// 处理关注用户
function handleFollow(user: any) {
  console.warn('Following user:', user)
  // 这里应该实现关注功能
}

// 处理点赞
function handleLike(item: any) {
  console.warn('Liking item:', item)
  // 这里应该实现点赞功能
  if (currentGeneratedImage.value && currentGeneratedImage.value.id === item.id) {
    currentGeneratedImage.value.likes = (currentGeneratedImage.value.likes || 0) + 1
  }
}

// 处理发布到社区成功
function handlePublished(item: any, tags: any[], inspirationData: any) {
  console.warn('Published to community successfully:', item, tags, inspirationData)

  // 更新当前生成的图片的inspiration标识
  if (currentGeneratedImage.value && currentGeneratedImage.value.id === item.id) {
    currentGeneratedImage.value.inspiration = inspirationData
  }

  // 更新历史图片列表中的inspiration标识
  const historyImageIndex = historyGeneratedImages.findIndex(img => img.id === item.id)
  if (historyImageIndex !== -1) {
    historyGeneratedImages[historyImageIndex].inspiration = inspirationData
  }

  // 发布成功后刷新Inspiration列表
  loadInspirationImages()
}

// 处理取消发布
async function handleUnpublish(item: any) {
  console.warn('Unpublishing from community:', item)

  try {
    // 发送DELETE请求取消发布
    await ApiService.delete(`/inspiration/${item.inspiration.id}`)

    // 更新当前生成的图片，移除inspiration标识
    if (currentGeneratedImage.value && currentGeneratedImage.value.id === item.id) {
      currentGeneratedImage.value.inspiration = null
    }

    // 更新历史图片列表，移除inspiration标识
    const historyImageIndex = historyGeneratedImages.findIndex(img => img.id === item.id)
    if (historyImageIndex !== -1) {
      historyGeneratedImages[historyImageIndex].inspiration = null
    }

    // 刷新Inspiration列表
    loadInspirationImages()
  }
  catch (error) {
    console.error('Failed to unpublish:', error)
  }
}

// 处理下载图片
function handleDownloadImage(item: any) {
  console.warn('Downloading image:', item)

  try {
    // 创建图片URL
    const imageUrl = `/api/s3/proxy?key=${item.response.file_key}`

    // 创建一个临时的a标签来触发下载
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `${item.prompt.substring(0, 50)}_${item.id}.${item.response.file_extension || 'png'}`
    link.target = '_blank'

    // 添加到DOM并触发点击
    document.body.appendChild(link)
    link.click()

    // 清理
    document.body.removeChild(link)
  }
  catch (error) {
    console.error('Failed to download image:', error)
  }
}
</script>

<template>
  <div class="flex h-full min-h-0">
    <!-- 左侧配置面板 -->
    <div class="w-80 border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 overflow-y-auto">
      <!-- 标题 -->
      <h1 class="text-sm font-bold text-gray-900 dark:text-gray-100 mb-6">
        Generate images
      </h1>

      <!-- 配置组件 -->
      <ImageConfig
        v-model:config="imageConfig"
        @generate="handleGenerate"
      />
    </div>

    <!-- 右侧标签页区域 -->
    <div class="flex-1 bg-white dark:bg-gray-900">
      <!-- 标签页导航 -->
      <div class="p-6">
        <div class="flex space-x-2">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
            :class="[
              activeTab === tab.id
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700',
            ]"
            @click="switchTab(tab.id)"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- 标签页内容 -->
      <div class="p-6 pt-0 overflow-y-auto h-full">
        <!-- History标签页 -->
        <div v-if="activeTab === 'history'">
          <!-- 当前生成结果区域 -->
          <div v-if="currentGeneratedImage || isGenerating" class="mb-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-md font-bold text-gray-900 dark:text-gray-100">
                Latest Generated Image
              </h2>
            </div>

            <!-- 生成图片Loading状态 -->
            <div v-if="isGenerating" class="text-center py-12">
              <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
                <i class="ki-outline ki-loading text-2xl text-blue-600 dark:text-blue-400" />
              </div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Generating your image...
              </h3>
              <p class="text-gray-500 dark:text-gray-400 text-sm">
                This may take a few moments
              </p>
            </div>

            <!-- 当前生成的图片展示 -->
            <div v-else-if="currentGeneratedImage" class="grid grid-cols-2 gap-4 mb-8">
              <div class="space-y-2">
                <div
                  data-kt-modal-toggle="#share-modal-current"
                  class="relative group rounded-lg overflow-hidden shadow-sm dark:shadow-gray-800 hover:shadow-md dark:hover:shadow-gray-700 transition-shadow flex items-center justify-center bg-gray-50 dark:bg-gray-800"
                >
                  <img
                    :src="`/api/s3/proxy?key=${currentGeneratedImage.response.file_key}`"
                    alt="Generated image"
                    class="w-full h-full object-fit"
                  >

                  <!-- 已发布到社区标识 -->
                  <div
                    v-if="currentGeneratedImage.inspiration"
                    class="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg"
                  >
                    <i class="ki-solid ki-check-circle text-xs" />
                    <span>Published</span>
                  </div>

                  <!-- 遮罩层 -->
                  <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-200" />

                  <!-- 悬停操作按钮 -->
                  <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div class="flex space-x-2">
                      <button class="cursor-pointer w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" @click.stop="handleEditImage(currentGeneratedImage)">
                        <i class="ki-outline ki-pencil text-gray-600 dark:text-gray-400 text-sm" />
                      </button>
                      <button
                        class="cursor-pointer w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        @click.stop="handleDownloadImage(currentGeneratedImage)"
                      >
                        <i class="ki-outline ki-download text-gray-600 dark:text-gray-400 text-sm" />
                      </button>
                      <button class="cursor-pointer w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <i class="ki-outline ki-heart text-gray-600 dark:text-gray-400 text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 当前生成图片的ShareModal -->
              <ShareModal
                :item="currentGeneratedImage"
                modal-id="share-modal-current"
                @recreate="handleRecreateFromShare"
                @copy-link="handleCopyLink"
                @create-video="handleCreateVideo"
                @follow="handleFollow"
                @like="handleLike"
                @publish="(item) => {}"
                @unpublish="handleUnpublish"
              />

              <!-- 当前生成图片的PublishModal -->
              <PublishModal
                :item="currentGeneratedImage"
                modal-id="publish-modal-current"
                @published="handlePublished"
              />
            </div>

            <!-- 空状态 -->
            <div v-else class="text-center py-12">
              <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="ki-outline ki-picture text-2xl text-gray-400 dark:text-gray-500" />
              </div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No image generated yet
              </h3>
              <p class="text-gray-500 dark:text-gray-400 text-sm">
                Click "Generate" to create your first AI image
              </p>
            </div>
          </div>

          <!-- 历史生成结果区域 -->
          <div class="mb-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-md font-bold text-gray-900 dark:text-gray-100">
                Generated Images
              </h2>
            </div>

            <!-- 历史数据Loading状态 -->
            <div v-if="isLoadingHistory" class="text-center py-12">
              <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
                <i class="ki-outline ki-loading text-2xl text-gray-600 dark:text-gray-400" />
              </div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Loading history...
              </h3>
              <p class="text-gray-500 dark:text-gray-400 text-sm">
                Please wait while we load your images
              </p>
            </div>

            <!-- 生成结果布局 -->
            <div v-else-if="historyGeneratedImages.length > 0" class="grid grid-cols-2 gap-4">
              <template v-for="image in historyGeneratedImages" :key="image.id">
                <div class="space-y-2">
                  <div
                    :data-kt-modal-toggle="`#share-modal-${image.id}`"
                    class="cursor-pointer relative group rounded-lg overflow-hidden shadow-sm dark:shadow-gray-800 hover:shadow-md dark:hover:shadow-gray-700 transition-shadow flex items-center justify-center bg-gray-50 dark:bg-gray-800"
                  >
                    <img
                      :src="`/api/s3/proxy?key=${image.response.file_key}`"
                      alt="Generated image"
                      class="w-full h-full object-fit"
                    >

                    <!-- 已发布到社区标识 -->
                    <div
                      v-if="image.inspiration"
                      class="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg"
                    >
                      <i class="ki-solid ki-check-circle text-xs" />
                      <span>Published</span>
                    </div>

                    <!-- 遮罩层 -->
                    <div
                      class="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-200"
                      :data-kt-modal-toggle="`#share-modal-${image.id}`"
                    />

                    <!-- 悬停操作按钮 -->
                    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div class="flex space-x-2">
                        <button class="cursor-pointer w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" @click.stop="handleEditImage(image)">
                          <i class="ki-outline ki-pencil text-gray-600 dark:text-gray-400 text-sm" />
                        </button>
                        <button
                          class="cursor-pointer w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          @click.stop="handleDownloadImage(image)"
                        >
                          <i class="ki-outline ki-download text-gray-600 dark:text-gray-400 text-sm" />
                        </button>
                        <button class="cursor-pointer w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <i class="ki-outline ki-heart text-gray-600 dark:text-gray-400 text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- ShareModal组件 -->
                <ShareModal
                  :item="image"
                  :modal-id="`share-modal-${image.id}`"
                  @recreate="handleRecreateFromShare"
                  @copy-link="handleCopyLink"
                  @create-video="handleCreateVideo"
                  @follow="handleFollow"
                  @like="handleLike"
                  @publish="(item) => {}"
                  @unpublish="handleUnpublish"
                />

                <!-- PublishModal组件 -->
                <PublishModal
                  :item="image"
                  :modal-id="`publish-modal-${image.id}`"
                  @published="handlePublished"
                />
              </template>

              <!-- 加载更多触发器 -->
              <div
                v-if="pagination.hasNext"
                ref="loadMoreTrigger"
                class="col-span-2 py-8 text-center"
              >
                <div v-if="isLoadingMoreHistory" class="flex justify-center">
                  <i class="ki-outline ki-loading animate-spin text-2xl text-gray-600 dark:text-gray-400" />
                </div>
              </div>
            </div>

            <!-- 空状态 -->
            <div v-else class="text-center py-12">
              <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="ki-outline ki-picture text-2xl text-gray-400 dark:text-gray-500" />
              </div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No images generated yet
              </h3>
              <p class="text-gray-500 dark:text-gray-400 text-sm">
                Click "Generate" to create your first AI image
              </p>
            </div>
          </div>
        </div>

        <!-- Inspiration标签页 -->
        <div v-else-if="activeTab === 'inspiration'">
          <!-- Loading状态 -->
          <div v-if="isLoadingInspiration" class="text-center py-12">
            <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
              <i class="ki-outline ki-loading text-2xl text-gray-600 dark:text-gray-400" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Loading inspiration...
            </h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm">
              Please wait while we load community creations
            </p>
          </div>

          <!-- Inspiration内容 -->
          <CommunityGrid
            v-else
            :items="inspirationImages"
            @recreate="handleRecreate"
          />
        </div>
      </div>
    </div>
  </div>
</template>
