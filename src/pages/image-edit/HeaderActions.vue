<script setup lang="ts">
import { computed, ref } from 'vue'
import { useImageEditStore } from '@/store/image-edit'

const imageEditStore = useImageEditStore()

// 当前图片数据
const imageData = computed(() => imageEditStore.imageData)

// 是否已发布
const isPublished = computed(() => !!imageData.value?.inspiration)

// Loading状态
const isPublishing = ref(false)
const isLiking = ref(false)

// 处理发布
async function handlePublish() {
  if (!imageData.value || isPublishing.value) {
    return
  }

  // TODO: 打开PublishModal让用户选择tags
  // 这里暂时使用空数组
  isPublishing.value = true
  try {
    await imageEditStore.publishToCommuinty([])
    console.warn('Published successfully')
  }
  catch (error) {
    console.error('Failed to publish:', error)
  }
  finally {
    isPublishing.value = false
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
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- Publish按钮 -->
    <button
      v-if="!isPublished"
      type="button"
      class="kt-btn kt-btn-icon kt-btn-ghost"
      title="Publish to Community"
      :disabled="isPublishing || !imageData"
      @click="handlePublish"
    >
      <i v-if="isPublishing" class="ki-outline ki-loading animate-spin" />
      <i v-else class="ki-outline ki-share" />
    </button>

    <!-- 已发布状态按钮 -->
    <button
      v-else
      type="button"
      class="kt-btn kt-btn-icon kt-btn-ghost bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
      title="Published to Community"
      disabled
    >
      <i class="ki-solid ki-check-circle" />
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
  </div>
</template>
