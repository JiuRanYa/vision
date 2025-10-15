<script setup lang="ts">
import type { Tag } from '@/components/EditableTags.vue'
import type { Creation } from '@/types/creation'
import { KTModal } from '@keenthemes/ktui/src'
import { defineEmits, defineProps, ref } from 'vue'
import EditableTags from '@/components/EditableTags.vue'
import { ApiService } from '@/service/fetch'

// 定义props类型
interface PublishModalProps {
  item: Creation
  modalId?: string
}

// 定义props
const props = defineProps<PublishModalProps>()

// 定义emits
const emit = defineEmits<{
  published: [item: Creation, tags: Tag[], inspirationData: any]
}>()

// Tags数据
const tags = ref<Tag[]>([])

// Loading状态
const isPublishing = ref(false)

// 处理发布
async function handlePublish() {
  if (isPublishing.value)
    return

  isPublishing.value = true
  try {
    // 发送POST请求到 /inspiration
    // 过滤出有效的数字ID（排除临时ID如 'tag-123456'）
    const tagIds = tags.value
      .filter(tag => tag.id !== undefined && !Number.isNaN(tag.id))
      .map(tag => tag.id as number)

    const response = await ApiService.post('/inspiration', {
      creation_id: props.item.id,
      tag_ids: tagIds,
    })

    // 发布成功后触发事件并关闭Modal
    emit('published', props.item, tags.value, response.data.value)

    // 关闭Modal
    const modalId = props.modalId || `publish-modal-${props.item.id}`
    const modalElement = document.getElementById(modalId)
    if (modalElement) {
      const modal = KTModal.getInstance(modalElement)
      modal?.hide()
    }

    // 重置tags
    tags.value = []
  }
  catch (error) {
    console.error('Failed to publish:', error)
    // 可以在这里添加错误提示
  }
  finally {
    isPublishing.value = false
  }
}
</script>

<template>
  <div
    :id="props.modalId || `publish-modal-${item.id}`"
    class="kt-modal"
    data-kt-modal="true"
  >
    <div class="kt-modal-content max-w-2xl top-[5%]">
      <!-- Modal Header -->
      <div class="kt-modal-header">
        <h3 class="kt-modal-title">
          Publish to Community
        </h3>
        <button
          class="kt-modal-close"
          aria-label="Close modal"
          :data-kt-modal-dismiss="`#${props.modalId || `publish-modal-${item.id}`}`"
        >
          <i class="ki-outline ki-cross text-lg" />
        </button>
      </div>

      <!-- Modal Body -->
      <div class="kt-modal-body">
        <!-- 图片预览 -->
        <div class="mb-6 flex justify-center">
          <img
            :src="`/api/s3/proxy?key=${item.response.file_key}`"
            :alt="item.prompt"
            class="max-w-full max-h-96 object-contain rounded-lg"
          >
        </div>

        <!-- Prompt展示 -->
        <div class="mb-6">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Prompt
          </label>
          <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {{ item.prompt }}
          </div>
        </div>

        <!-- Tags编辑 -->
        <div class="mb-6">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Tags
          </label>
          <EditableTags v-model="tags" />
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="kt-modal-footer">
        <button
          type="button"
          class="kt-btn kt-btn-ghost"
          :data-kt-modal-dismiss="`#${props.modalId || `publish-modal-${item.id}`}`"
          :disabled="isPublishing"
        >
          Cancel
        </button>
        <button
          type="button"
          class="kt-btn kt-btn-primary"
          :disabled="isPublishing"
          @click="handlePublish"
        >
          <i v-if="isPublishing" class="ki-outline ki-loading animate-spin" />
          <span v-else>Publish</span>
        </button>
      </div>
    </div>
  </div>
</template>
