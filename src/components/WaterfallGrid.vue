<script setup lang="ts">
import type { Inspiration } from '@/types/creation'
import { defineEmits, defineProps } from 'vue'
import CommunityModal from './CommunityModal.vue'

const _props = defineProps<{
  items: Inspiration[]
}>()

const emit = defineEmits<{
  recreate: [item: Inspiration]
}>()

// 处理重新创建
function handleRecreate(item: Inspiration) {
  emit('recreate', item)
}
</script>

<template>
  <div>
    <!-- 瀑布流网格 -->
    <div class="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
      <div
        v-for="item in items"
        :key="item.id"
        class="group break-inside-avoid mb-4 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer relative"
        :data-kt-modal-toggle="`#community-modal-${item.id}`"
      >
        <img
          :src="`/api/s3/proxy?key=${item.creation.response.compressed.large.file_key}`"
          :alt="item.creation.prompt"
          class="w-full h-auto object-cover"
          loading="lazy"
        >

        <!-- Hover遮罩层 -->
        <div class="absolute inset-0 bg-black group-hover:bg-opacity-30 transition-all duration-200 opacity-0 group-hover:opacity-20" />

        <!-- ReCreate按钮 -->
        <div class="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            class="kt-btn kt-btn-mono rounded-full"
            @click.stop="handleRecreate(item)"
          >
            ReCreate
          </button>
        </div>
      </div>
    </div>

    <!-- Modal组件 -->
    <CommunityModal
      v-for="item in items"
      :key="`modal-${item.id}`"
      :item="item"
      @recreate="handleRecreate"
    />
  </div>
</template>

<style scoped>
/* 自定义样式 */
</style>
