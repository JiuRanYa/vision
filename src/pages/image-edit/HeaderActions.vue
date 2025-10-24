<script setup lang="ts">
import type { Tag } from '@/components/EditableTags.vue'
import { KTModal, KTToast } from '@keenthemes/ktui/src'
import { PhDownloadSimple, PhShareNetwork } from '@phosphor-icons/vue'
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

  // 显示成功Toast
  KTToast.show({
    message: 'Published to community successfully',
    variant: 'success',
    duration: 3000,
    position: 'top-end',
  })
}

// 处理取消发布
async function handleUnpublish() {
  if (!imageData.value?.inspiration) {
    return
  }

  try {
    await imageEditStore.unpublishFromCommunity()

    KTToast.show({
      message: 'Unpublished from community successfully',
      variant: 'success',
      duration: 3000,
      position: 'top-end',
    })
  }
  catch (error) {
    console.error('Failed to unpublish:', error)

    KTToast.show({
      message: 'Failed to unpublish from community',
      variant: 'error',
      duration: 3000,
      position: 'top-end',
    })
  }
}

// 处理下载图片
function handleDownloadImage() {
  if (!imageData.value) {
    return
  }

  try {
    // 创建图片URL
    const imageUrl = `/api/s3/proxy?key=${imageData.value.response.compressed.large.file_key}`

    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `${imageData.value.prompt.substring(0, 50)}_${imageData.value.id}.${imageData.value.response.compressed.large.file_extension || 'png'}`
    link.target = '_blank'

    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
  }
  catch (error) {
    console.error('Failed to download image:', error)
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
    <!-- 下载按钮 -->
    <button
      type="button"
      class="kt-btn kt-btn-icon kt-btn-ghost"
      title="Download Image"
      :disabled="!imageData"
      @click="handleDownloadImage"
    >
      <PhDownloadSimple :size="16" class="text-gray-600 dark:text-gray-400" />
    </button>

    <!-- Publish按钮（未发布状态） -->
    <button
      v-if="!isPublished"
      type="button"
      class="kt-btn kt-btn-icon kt-btn-ghost"
      title="Publish to Community"
      :disabled="!imageData"
      :data-kt-modal-toggle="`#${publishModalId}`"
    >
      <PhShareNetwork :size="16" class="text-gray-600 dark:text-gray-400" />
    </button>

    <!-- 已发布状态按钮（点击可取消发布） -->
    <button
      v-else
      type="button"
      class="kt-btn kt-btn-icon kt-btn-ghost bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-all"
      title="Published - Click to unpublish"
      @click="handleUnpublish"
    >
      <PhShareNetwork :size="16" class="text-gray-600 dark:text-gray-400" />
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
