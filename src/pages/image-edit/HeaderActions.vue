<script setup lang="ts">
import type { Tag } from '@/components/EditableTags.vue'
import { KTModal } from '@keenthemes/ktui/src'
import { computed, nextTick, onMounted, ref } from 'vue'
import PublishModal from '@/pages/image-generator/components/PublishModal.vue'
import { useImageEditStore } from '@/store/image-edit'

const imageEditStore = useImageEditStore()

// 当前图片数据
const imageData = computed(() => imageEditStore.imageData)

// 是否已发布
const isPublished = computed(() => !!imageData.value?.inspiration)

// Loading状态
const isLiking = ref(false)

// Modal ID
const publishModalId = 'header-publish-modal'

// 处理发布成功
function handlePublished(_item: any, _tags: Tag[], inspirationData: any) {
  // 更新store中的图片数据
  if (imageEditStore.imageData) {
    imageEditStore.imageData.inspiration = inspirationData
  }
}

// 处理取消发布
async function handleUnpublish() {
  if (!imageData.value?.inspiration) {
    return
  }

  try {
    await imageEditStore.unpublishFromCommunity()
  }
  catch (error) {
    console.error('Failed to unpublish:', error)
  }
}

// 处理点赞
async function handleLike() {
  if (!imageData.value || isLiking.value) {
    return
  }

  isLiking.value = true
  try {
    await imageEditStore.likeCurrentImage()
    console.warn('Liked successfully')
  }
  catch (error) {
    console.error('Failed to like:', error)
  }
  finally {
    isLiking.value = false
  }
}

// 初始化Modal
onMounted(() => {
  nextTick(() => {
    KTModal.init()
  })
})
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- Publish按钮（未发布状态） -->
    <button
      v-if="!isPublished"
      type="button"
      class="kt-btn kt-btn-icon kt-btn-ghost"
      title="Publish to Community"
      :disabled="!imageData"
      :data-kt-modal-toggle="`#${publishModalId}`"
    >
      <i class="ki-outline ki-exit-right-corner" />
    </button>

    <!-- 已发布状态按钮（点击可取消发布） -->
    <button
      v-else
      type="button"
      class="kt-btn kt-btn-icon kt-btn-ghost bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-all"
      title="Published - Click to unpublish"
      @click="handleUnpublish"
    >
      <i class="ki-outline ki-exit-right-corner" />
    </button>

    <!-- Like按钮 -->
    <button
      type="button"
      class="kt-btn kt-btn-icon kt-btn-ghost"
      title="Like"
      :disabled="isLiking || !imageData"
      @click="handleLike"
    >
      <i v-if="isLiking" class="ki-outline ki-loading animate-spin" />
      <i v-else class="ki-outline ki-heart" />
    </button>

    <!-- PublishModal -->
    <PublishModal
      v-if="imageData"
      :item="imageData"
      :modal-id="publishModalId"
      @published="handlePublished"
    />
  </div>
</template>
