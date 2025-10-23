<script setup lang="ts">
import type { Creation } from '@/types/creation'
import { PhShareNetwork } from '@phosphor-icons/vue'
import { computed, defineEmits, defineProps, ref, watch } from 'vue'

// 定义props类型
interface ShareModalProps {
  item: Creation
  modalId?: string
}

// 定义props
const props = defineProps<ShareModalProps>()

// 定义emits
const emit = defineEmits<{
  recreate: [item: Creation]
  copyLink: [item: Creation]
  createVideo: [item: Creation]
  like: [item: Creation]
  follow: [user: Creation['creator']]
  publish: [item: Creation]
  unpublish: [item: Creation]
}>()

// 缩放相关状态
const zoomLevel = ref(100)
const isFitToScreen = ref(true)

// 计算属性：获取用户信息（从creator映射）
const userInfo = computed(() => {
  return {
    name: props.item.creator?.name || 'Anonymous',
    avatar: '', // Creation类型中没有avatar字段，写死为空
    timeAgo: formatTimeAgo(props.item.created_at),
  }
})

// 计算属性：获取图片尺寸
const imageDimensions = computed(() => {
  const metadata = props.item.response.original_metadata
  if (metadata && metadata.width && metadata.height) {
    return `${metadata.width}x${metadata.height} px`
  }
  return 'Unknown size'
})

// 计算属性：获取图片样式
const imageStyle = computed(() => {
  if (isFitToScreen.value) {
    return {
      transform: 'scale(1)',
      transformOrigin: 'center',
    }
  }
  return {
    transform: `scale(${zoomLevel.value / 100})`,
    transformOrigin: 'center',
  }
})

// 格式化时间为相对时间
function formatTimeAgo(dateString: string) {
  const now = new Date()
  const created = new Date(dateString)
  const diffInSeconds = Math.floor((now.getTime() - created.getTime()) / 1000)

  if (diffInSeconds < 60)
    return 'Just now'
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)} days ago`
  return `${Math.floor(diffInSeconds / 2592000)} months ago`
}

// 处理重新创建
function handleRecreate() {
  emit('recreate', props.item)
}

// 处理关注用户
function handleFollow() {
  emit('follow', props.item.creator)
}

// 处理点赞
function handleLike() {
  emit('like', props.item)
}

// 处理复制链接
function handleCopyLink() {
  emit('copyLink', props.item)
}

// 缩放功能
function handleZoomChange(event: Event) {
  const target = event.target as HTMLInputElement
  zoomLevel.value = Number.parseInt(target.value)
  isFitToScreen.value = false
}

function handleFitToScreen() {
  isFitToScreen.value = true
  zoomLevel.value = 100
}

// 监听缩放变化
watch(zoomLevel, (newValue) => {
  if (newValue === 100) {
    isFitToScreen.value = true
  }
  else {
    isFitToScreen.value = false
  }
})
</script>

<template>
  <div
    :id="props.modalId || `share-modal-${item.id}`"
    class="kt-modal"
    data-kt-modal="true"
  >
    <div class="kt-modal-content w-[90vw] max-h-[90vh] top-[5%]">
      <!-- Modal Body -->
      <div class="kt-modal-body p-0">
        <div class="flex h-full">
          <!-- 左侧图片展示区域 -->
          <div class="w-2/3 p-6">
            <div class="flex flex-col h-full max-h-[80vh]">
              <!-- 图片显示区域 -->
              <div class="flex-1 flex justify-center items-center overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 mb-3">
                <img
                  :src="`/api/s3/proxy?key=${item.response.compressed.large.file_key}`"
                  :alt="item.prompt"
                  :style="imageStyle"
                  class="max-w-full max-h-full object-contain transition-transform duration-200 ease-in-out"
                >
              </div>

              <!-- 控制面板容器 -->
              <div class="flex items-center">
                <!-- 左侧空div -->
                <div class="flex-1" />

                <!-- 控制面板 -->
                <div class="flex items-center gap-3 backdrop-blur-sm rounded-lg px-4 py-3">
                  <!-- 缩放滑块 -->
                  <div class="flex items-center gap-3">
                    <span class="text-sm font-medium min-w-[3rem]">
                      {{ zoomLevel }}%
                    </span>
                    <input
                      type="range"
                      min="100"
                      max="500"
                      :value="zoomLevel"
                      class="w-24 h-1 bg-gray-400 rounded-lg appearance-none cursor-pointer slider"
                      @input="handleZoomChange"
                    >
                  </div>

                  <div class="flex items-center gap-2 text-xs">
                    <i class="ki-filled ki-note" />

                    <!-- 尺寸显示 -->
                    <span class="text-sm font-medium">
                      {{ imageDimensions }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧信息区域 -->
          <div class="w-1/3 p-6 border-l border-gray-200 dark:border-gray-700">
            <div class="flex flex-col justify-between h-full">
              <div class="flex flex-col gap-6">
                <!-- 用户信息 -->
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <img
                      v-if="userInfo.avatar"
                      :src="userInfo.avatar"
                      :alt="userInfo.name"
                      class="w-full h-full object-cover"
                    >
                    <div
                      v-else
                      class="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400"
                    >
                      <i class="ki-outline ki-user text-lg" />
                    </div>
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center justify-between">
                      <div>
                        <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {{ userInfo.name }}
                        </h4>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          {{ userInfo.timeAgo }}
                        </p>
                      </div>
                      <button
                        class="kt-btn kt-btn-sm kt-btn-secondary"
                        @click="handleFollow"
                      >
                        Follow
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Prompt信息 -->
                <div class="group">
                  <h5 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Prompt
                  </h5>
                  <div class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    <!-- 截断的文本 -->
                    <span class="group-has-[input:checked]:hidden">
                      {{ props.item.prompt.length > 150 ? `${props.item.prompt.substring(0, 150)}...` : props.item.prompt }}
                    </span>
                    <!-- 完整的文本 -->
                    <span class="hidden group-has-[input:checked]:block">
                      {{ props.item.prompt }}
                    </span>
                  </div>

                  <!-- 展开/收起按钮 -->
                  <div v-if="props.item.prompt.length > 150" class="mt-2">
                    <label class="cursor-pointer">
                      <input type="checkbox" class="sr-only peer">
                      <span class="text-blue-600 dark:text-blue-400 text-xs font-semibold hover:underline peer-checked:hidden">
                        See more
                      </span>
                      <span class="text-blue-600 dark:text-blue-400 text-xs font-semibold hover:underline hidden peer-checked:inline">
                        See less
                      </span>
                    </label>
                  </div>
                </div>

                <!-- 操作图标 -->
                <div>
                  <div class="flex items-center gap-2">
                    <!-- Publish/Unpublish to Community -->
                    <button
                      v-if="!item.inspiration"
                      type="button"
                      class="kt-btn kt-btn-icon kt-btn-ghost"
                      title="Publish to Community"
                      :data-kt-modal-toggle="`#publish-modal-${item.id}`"
                    >
                      <PhShareNetwork :size="16" class="text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                      v-else
                      type="button"
                      class="kt-btn kt-btn-icon kt-btn-ghost bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-all"
                      title="Published - Click to unpublish"
                      @click="emit('unpublish', item)"
                    >
                      <PhShareNetwork :size="16" class="text-gray-600 dark:text-gray-400" />
                    </button>

                    <!-- Like -->
                    <button
                      type="button"
                      class="kt-btn kt-btn-icon kt-btn-ghost"
                      title="Like"
                      @click="handleLike"
                    >
                      <i class="ki-outline ki-heart" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- 主要操作按钮 -->
              <div class="pt-4">
                <button
                  class="w-full kt-btn kt-btn-mono flex items-center justify-center space-x-2"
                  data-kt-modal-dismiss="true"
                  @click="handleRecreate"
                >
                  <i class="ki-outline ki-refresh text-sm" />
                  <span>Recreate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 滑块样式 */
.slider {
  -webkit-appearance: none;
  appearance: none;
  background: #4b5563;
  outline: none;
  border-radius: 0.5rem;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #ffffff;
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #ffffff;
}

/* 滑块轨道样式 */
.slider::-webkit-slider-track {
  background: #4b5563;
  height: 4px;
  border-radius: 0.5rem;
}

.slider::-moz-range-track {
  background: #4b5563;
  height: 4px;
  border-radius: 0.5rem;
  border: none;
}
</style>
