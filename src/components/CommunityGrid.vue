<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'
import CommunityModal from './CommunityModal.vue'

// 定义props
const _props = defineProps<{
  items: Array<{
    id: number
    imageUrl: string
    prompt: string
    type: 'image' | 'video'
  }>
}>()

// 定义emits
const emit = defineEmits<{
  recreate: [item: typeof _props.items[0]]
}>()

// 处理重新创建
function handleRecreate(item: typeof _props.items[0]) {
  emit('recreate', item)
}
</script>

<template>
  <div>
    <!-- 社区瀑布流标题区域 -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-md font-bold text-gray-900">
        Get inspired by the community
      </h2>
      <a href="#" class="text-blue-600 hover:text-blue-700 text-xs font-medium">My profile</a>
    </div>

    <!-- 瀑布流网格 -->
    <div class="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
      <div
        v-for="item in items"
        :key="item.id"
        class="group break-inside-avoid mb-4 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer relative"
        :data-kt-modal-toggle="`#community-modal-${item.id}`"
      >
        <img
          :src="item.imageUrl"
          :alt="item.prompt"
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
