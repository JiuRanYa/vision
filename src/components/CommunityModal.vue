<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'

// 定义props
const props = defineProps<{
  item: {
    id: number
    imageUrl: string
    prompt: string
    type: 'image' | 'video'
  }
}>()

// 定义emits
const emit = defineEmits<{
  recreate: [item: typeof props.item]
}>()

// 处理重新创建
function handleRecreate() {
  emit('recreate', props.item)
}
</script>

<template>
  <div
    :id="`community-modal-${item.id}`"
    class="kt-modal"
    :data-kt-modal="true"
  >
    <div class="kt-modal-content max-w-[600px] top-[5%]">
      <!-- Modal Header -->
      <div class="kt-modal-header">
        <h3 class="kt-modal-title">
          {{ item.type === 'image' ? 'Image Details' : 'Video Details' }}
        </h3>
        <button
          type="button"
          class="kt-modal-close"
          aria-label="Close modal"
          :data-kt-modal-dismiss="`#community-modal-${item.id}`"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-x"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="kt-modal-body">
        <!-- 图片/视频展示区域 -->
        <div class="mb-6">
          <div class="relative w-full max-h-96 overflow-hidden rounded-lg">
            <img
              :src="item.imageUrl"
              :alt="item.prompt"
              class="w-full h-auto max-h-96 object-contain"
            >
          </div>
        </div>

        <!-- Prompt信息 -->
        <div class="space-y-4">
          <div>
            <h4 class="text-sm font-medium text-gray-900 mb-2">
              {{ item.type === 'image' ? 'Image Prompt' : 'Video Prompt' }}
            </h4>
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-sm text-gray-700 leading-relaxed">
                {{ item.prompt }}
              </p>
            </div>
          </div>

          <!-- 标签信息 -->
          <div class="flex flex-wrap gap-2">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {{ item.type === 'image' ? 'Image' : 'Video' }}
            </span>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Community
            </span>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="kt-modal-footer">
        <div />
        <div class="flex gap-4">
          <button
            class="kt-btn kt-btn-secondary"
            :data-kt-modal-dismiss="`#community-modal-${item.id}`"
          >
            Close
          </button>
          <button
            class="kt-btn kt-btn-primary"
            :data-kt-modal-dismiss="`#community-modal-${item.id}`"
            @click="handleRecreate"
          >
            ReCreate
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 自定义样式 */
</style>
