<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'

// 定义props
const props = defineProps<{
  config: {
    model: string
    startImage: string
    endImage: string
    promptType: 'text' | 'visual'
    prompt: string
    duration: string
    aspectRatio: string
  }
}>()

// 定义emits
const emit = defineEmits<{
  'update:config': [config: typeof props.config]
  'generate': []
}>()

// 更新配置
function updateConfig(key: keyof typeof props.config, value: string) {
  const newConfig = { ...props.config, [key]: value }
  emit('update:config', newConfig)
}

// 生成视频
function handleGenerate() {
  emit('generate')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Model选择 -->
    <div class="kt-card cursor-pointer hover:bg-gray-50 transition-colors">
      <div class="flex items-center justify-between p-3">
        <div class="flex items-center space-x-3">
          <i class="ki-outline ki-chip text-xs text-gray-600" />
          <span class="text-xs font-medium">Model</span>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-xs text-gray-600">{{ config.model }}</span>
          <i class="ki-outline ki-right text-xs text-gray-500" />
        </div>
      </div>
    </div>

    <!-- 图片输入区域 -->
    <div class="grid grid-cols-2 gap-4">
      <!-- Start Image -->
      <div class="kt-card cursor-pointer hover:bg-gray-50 transition-colors">
        <div class="p-4 text-center">
          <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <i class="ki-outline ki-picture text-xl text-gray-500" />
          </div>
          <span class="text-xs font-medium text-gray-700">Start image</span>
        </div>
      </div>

      <!-- End Image -->
      <div class="kt-card cursor-pointer hover:bg-gray-50 transition-colors">
        <div class="p-4 text-center">
          <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <i class="ki-outline ki-picture text-xl text-gray-500" />
          </div>
          <span class="text-xs font-medium text-gray-700">End image</span>
        </div>
      </div>
    </div>

    <!-- PROMPT区域 -->
    <div class="space-y-3">
      <!-- Text/Visual切换按钮 -->
      <div class="flex bg-gray-100 rounded-lg p-1">
        <button
          class="flex-1 py-2 px-3 text-xs font-medium rounded-md transition-colors"
          :class="config.promptType === 'text' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
          @click="updateConfig('promptType', 'text')"
        >
          Text
        </button>
        <button
          class="flex-1 py-2 px-3 text-xs font-medium rounded-md transition-colors"
          :class="config.promptType === 'visual' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
          @click="updateConfig('promptType', 'visual')"
        >
          Visual
        </button>
      </div>

      <!-- 文本输入框 -->
      <div class="relative">
        <textarea
          :value="config.prompt"
          placeholder="Describe your video"
          class="kt-input w-full h-24 resize-none pr-10 focus:border-blue-500"
          @input="updateConfig('prompt', ($event.target as HTMLTextAreaElement).value)"
        />
        <button class="absolute right-3 bottom-3 text-gray-500 hover:text-gray-700">
          <i class="ki-outline ki-magic-wand text-sm" />
        </button>
      </div>
    </div>

    <!-- 设置选项 -->
    <div class="space-y-3">
      <!-- Duration -->
      <div class="kt-card cursor-pointer hover:bg-gray-50 transition-colors">
        <div class="flex items-center justify-between p-3">
          <div class="flex items-center space-x-3">
            <i class="ki-outline ki-time text-xs text-gray-600" />
            <span class="text-xs font-medium">Duration</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-xs text-gray-600">{{ config.duration }}</span>
            <i class="ki-outline ki-right text-xs text-gray-500" />
          </div>
        </div>
      </div>

      <!-- Aspect Ratio -->
      <div class="kt-card cursor-pointer hover:bg-gray-50 transition-colors">
        <div class="flex items-center justify-between p-3">
          <div class="flex items-center space-x-3">
            <i class="ki-outline ki-element-8 text-xs text-gray-600" />
            <span class="text-xs font-medium">Aspect Ratio</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-xs text-gray-600">{{ config.aspectRatio }}</span>
            <i class="ki-outline ki-right text-xs text-gray-500" />
          </div>
        </div>
      </div>
    </div>

    <!-- Generate按钮 -->
    <button
      class="kt-btn kt-btn-primary w-full flex items-center justify-center space-x-2 py-3"
      @click="handleGenerate"
    >
      <span>Generate</span>
      <i class="ki-outline ki-star text-sm" />
    </button>
  </div>
</template>

<style scoped>
/* 自定义样式 */
</style>
