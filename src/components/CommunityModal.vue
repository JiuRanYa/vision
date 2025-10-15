<script setup lang="ts">
import type { Inspiration } from '@/types/creation'
import { computed, defineEmits, defineProps } from 'vue'

// 定义props
const props = defineProps<{
  item: Inspiration
}>()

// 定义emits
const emit = defineEmits<{
  recreate: [item: Inspiration]
}>()

// 计算属性：获取图片URL
const imageUrl = computed(() => {
  return `/api/s3/proxy?key=${props.item.creation.response.file_key}`
})

// 计算属性：获取prompt
const prompt = computed(() => {
  return props.item.creation.prompt
})

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
          Image Details
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
              :src="imageUrl"
              :alt="prompt"
              class="w-full h-auto max-h-96 object-contain"
            >
          </div>
        </div>

        <!-- Prompt信息 -->
        <div class="space-y-4">
          <div>
            <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Image Prompt
            </h4>
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p class="text-sm text-gray-700 dark:text-gray-400 leading-relaxed">
                {{ prompt }}
              </p>
            </div>
          </div>

          <!-- 标签信息 -->
          <div class="flex flex-wrap gap-2">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Text to Image
            </span>
            <!-- 用户标签 -->
            <span
              v-for="tag in item.tags"
              :key="tag.id"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="tag.background"
            >
              {{ tag.text }}
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
