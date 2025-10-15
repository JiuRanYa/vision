<script setup lang="ts">
import type { Creation } from '@/types/creation'
import { computed, defineEmits, defineProps } from 'vue'

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

// 计算属性：获取用户信息（从creator映射）
const userInfo = computed(() => {
  return {
    name: props.item.creator?.name || 'Anonymous',
    avatar: '', // Creation类型中没有avatar字段，写死为空
    timeAgo: formatTimeAgo(props.item.created_at),
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
                      <i class="ki-outline ki-share" />
                    </button>
                    <button
                      v-else
                      type="button"
                      class="kt-btn kt-btn-icon kt-btn-ghost bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-all"
                      title="Published - Click to unpublish"
                      @click="emit('unpublish', item)"
                    >
                      <i class="ki-outline ki-share" />
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
