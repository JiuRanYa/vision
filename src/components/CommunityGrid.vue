<script setup lang="ts">
import type { Inspiration } from '@/types/creation'
import { defineEmits, defineProps } from 'vue'
import WaterfallGrid from './WaterfallGrid.vue'

// 定义props
const _props = defineProps<{
  items: Inspiration[]
}>()

// 定义emits
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
    <!-- 社区瀑布流标题区域 -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-md font-bold text-gray-900 dark:text-gray-100">
        Get inspired by the community
      </h2>
      <a href="#" class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs font-medium">My profile</a>
    </div>

    <!-- 瀑布流组件 -->
    <WaterfallGrid
      :items="items"
      @recreate="handleRecreate"
    />
  </div>
</template>
