<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'

// 定义props类型
interface ShareModalProps {
  item: {
    id: number
    prompt: string
    type: 'image' | 'video'
    // 扩展的用户信息
    tags?: string[]
    response: {
      file_key: string
    }
  }
  modalId?: string
}

// 定义props
const props = defineProps<ShareModalProps>()

// 定义emits
const emit = defineEmits<{
  recreate: [item: ShareModalProps['item']]
  copyLink: [item: ShareModalProps['item']]
  createVideo: [item: ShareModalProps['item']]
  like: [item: ShareModalProps['item']]
}>()

// 处理重新创建
function handleRecreate() {
  emit('recreate', props.item)
}

// 处理复制链接
function handleCopyLink() {
  emit('copyLink', props.item)
}

// 处理创建视频
function handleCreateVideo() {
  emit('createVideo', props.item)
}

// 处理关注用户
function handleFollow() {
  if (props.item.user) {
    emit('follow', props.item.user)
  }
}

// 处理点赞
function handleLike() {
  emit('like', props.item)
}
</script>

<template>
  <div
    :id="props.modalId || `share-modal-${item.id}`"
    class="kt-modal kt-modal-center"
    data-kt-modal="true"
  >
    <div class="kt-modal-content w-[90vw] max-h-[90vh]">
      <!-- Modal Body -->
      <div class="kt-modal-body p-0">
        <div class="flex h-full">
          <!-- 左侧图片展示区域 -->
          <div class="w-2/3 p-6">
            <div class="relative w-full h-full max-h-[80vh] overflow-hidden rounded-lg">
              <img
                :src="`/api/s3/proxy?key=${item.response.file_key}`"
                :alt="item.prompt"
                class="w-full h-full object-contain"
              >
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
                      v-if="item.user?.avatar"
                      :src="item.user.avatar"
                      :alt="item.user.name"
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
                          {{ item.user?.name || 'Anonymous' }}
                        </h4>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          {{ item.user?.timeAgo || 'Recently' }}
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

                <!-- 标签信息 -->
                <div>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="tag in (item.tags || ['1:1', 'auto', 'auto:imagen3', 'text to image'])"
                      :key="tag"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    >
                      {{ tag }}
                    </span>
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
