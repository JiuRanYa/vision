<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { generateImage, getHistoryImages } from '@/api/image'
import CommunityGrid from '@/components/CommunityGrid.vue'
import ShareModal from '@/components/ShareModal.vue'
import ImageConfig from '@/pages/image-generator/ImageConfig.vue'

const router = useRouter()

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

// 分页参数
const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNext: false,
  hasPrev: false,
})

// 加载历史生成图片
async function loadHistoryImages() {
  isLoadingHistory.value = true
  try {
    const { data } = await getHistoryImages(pagination.page, pagination.limit)

    // 直接使用接口返回的数据
    const mappedImages = data.value.data

    historyGeneratedImages.splice(0, historyGeneratedImages.length, ...mappedImages)

    // 更新分页信息
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

async function handleGenerate() {
  console.warn('Generating image with config:', imageConfig)

  isGenerating.value = true

  try {
    const { data } = await generateImage(imageConfig.value.prompt)

    // 直接使用接口返回的数据
    const newImage = data.value

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

// 组件挂载时加载历史数据
onMounted(() => {
  loadHistoryImages()
})

// 瀑布流图片数据
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
])

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

function handleRecreate(item: typeof communityImages[0]) {
  console.warn('Recreating from community item:', item)
  // 使用打字机动画填充prompt
  typewriterEffect(item.prompt)
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
      imageId: image.id,
      file_key: image.response.file_key,
      prompt: image.prompt || '',
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
    console.log('Link copied to clipboard')
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
  if (selectedImageForShare.value) {
    selectedImageForShare.value.likes = (selectedImageForShare.value.likes || 0) + 1
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
          <!-- 生成结果区域 -->
          <div class="mb-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-md font-bold text-gray-900 dark:text-gray-100">
                Generated Images
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

            <!-- 历史数据Loading状态 -->
            <div v-else-if="isLoadingHistory" class="text-center py-12">
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
                  <div class="relative group rounded-lg overflow-hidden shadow-sm dark:shadow-gray-800 hover:shadow-md dark:hover:shadow-gray-700 transition-shadow flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                    <img
                      :src="`/api/s3/proxy?key=${image.response.file_key}`"
                      alt="Generated image"
                      class="w-full h-full object-fit"
                    >
                    <!-- 遮罩层 -->
                    <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-200" />

                    <!-- 悬停操作按钮 -->
                    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div class="flex space-x-2">
                        <button class="cursor-pointer w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" @click="handleEditImage(image)">
                          <i class="ki-outline ki-pencil text-gray-600 dark:text-gray-400 text-sm" />
                        </button>
                        <button
                          class="cursor-pointer w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          :data-kt-modal-toggle="`#share-modal-${image.id}`"
                        >
                          <i class="ki-outline ki-share text-gray-600 dark:text-gray-400 text-sm" />
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
                />
              </template>
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
          <!-- 社区组件 -->
          <CommunityGrid
            :items="communityImages"
            @recreate="handleRecreate"
          />
        </div>
      </div>
    </div>
  </div>
</template>
