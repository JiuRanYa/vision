<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 从URL获取creationId
const creationId = computed(() => route.query.creationId)

// 处理发布
function handlePublish() {
  console.warn('Publishing image:', creationId.value)
  // TODO: 实现发布逻辑
}

// 处理点赞
function handleLike() {
  console.warn('Liking image:', creationId.value)
  // TODO: 实现点赞逻辑
}
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- Publish按钮 -->
    <button
      type="button"
      class="kt-btn kt-btn-icon kt-btn-ghost"
      title="Publish to Community"
      @click="handlePublish"
    >
      <i class="ki-outline ki-share" />
    </button>

    <!-- Like按钮 -->
    <button
      type="button"
      class="kt-btn kt-btn-icon kt-btn-ghost"
      title="Like"
      @click="handleLike"
    >
      <i class="ki-outline ki-heart" />
    </button>
  </div>
</template>

