<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'

// 定义props
const props = defineProps<{
  config: {
    prompt: string
    model: string
    style: string
    composition: string
    effects: string
    character: string
    object: string
    colors: string
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

// 生成图片
function handleGenerate() {
  emit('generate')
}
</script>

<template>
  <div class="space-y-6">
    <!-- 文本输入框 -->
    <div class="relative">
      <textarea
        :value="config.prompt"
        placeholder="Describe your image or"
        class="kt-textarea w-full h-24 resize-none pt-1.5 focus:border-blue-500"
        @input="updateConfig('prompt', ($event.target as HTMLTextAreaElement).value)"
      />
    </div>

    <!-- 设置选项 -->
    <div class="space-y-3">
      <!-- Model -->
      <div class="kt-card cursor-pointer hover:bg-gray-50 transition-colors">
        <div class="flex items-center justify-between p-3">
          <div class="flex items-center space-x-3">
            <i class="ki-outline ki-star text-xs text-gray-600" />
            <span class="text-xs font-medium">Model</span>
            <div class="w-2 h-2 bg-blue-500 rounded-full" />
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-xs text-gray-600">{{ config.model }}</span>
            <i class="ki-outline ki-right text-xs text-gray-500" />
          </div>
        </div>
      </div>

      <!-- Style -->
      <div class="kt-card cursor-pointer hover:bg-gray-50 transition-colors">
        <div class="flex items-center justify-between p-3">
          <div class="flex items-center space-x-3">
            <i class="ki-outline ki-star text-xs text-gray-600" />
            <span class="text-xs font-medium">Style</span>
          </div>
          <div class="flex items-center space-x-2">
            <i class="ki-outline ki-shuffle text-xs text-gray-500" />
            <i class="ki-outline ki-plus text-xs text-gray-500" />
            <i class="ki-outline ki-right text-xs text-gray-500" />
          </div>
        </div>
      </div>

      <!-- Composition -->
      <div class="kt-card cursor-pointer hover:bg-gray-50 transition-colors">
        <div class="flex items-center justify-between p-3">
          <div class="flex items-center space-x-3">
            <i class="ki-outline ki-element-8 text-xs text-gray-600" />
            <span class="text-xs font-medium">Composition</span>
          </div>
          <i class="ki-outline ki-right text-xs text-gray-500" />
        </div>
      </div>

      <!-- Effects -->
      <div class="kt-card cursor-pointer hover:bg-gray-50 transition-colors">
        <div class="flex items-center justify-between p-3">
          <div class="flex items-center space-x-3">
            <i class="ki-outline ki-picture text-xs text-gray-600" />
            <span class="text-xs font-medium">Effects</span>
          </div>
          <i class="ki-outline ki-right text-xs text-gray-500" />
        </div>
      </div>

      <!-- Character -->
      <div class="kt-card cursor-pointer hover:bg-gray-50 transition-colors">
        <div class="flex items-center justify-between p-3">
          <div class="flex items-center space-x-3">
            <i class="ki-outline ki-user text-xs text-gray-600" />
            <span class="text-xs font-medium">Character</span>
          </div>
          <i class="ki-outline ki-right text-xs text-gray-500" />
        </div>
      </div>

      <!-- Object -->
      <div class="kt-card cursor-pointer hover:bg-gray-50 transition-colors">
        <div class="flex items-center justify-between p-3">
          <div class="flex items-center space-x-3">
            <i class="ki-outline ki-paintbucket text-xs text-gray-600" />
            <span class="text-xs font-medium">Object</span>
          </div>
          <i class="ki-outline ki-right text-xs text-gray-500" />
        </div>
      </div>

      <!-- Colors -->
      <div class="kt-card cursor-pointer hover:bg-gray-50 transition-colors">
        <div class="flex items-center justify-between p-3">
          <div class="flex items-center space-x-3">
            <i class="ki-outline ki-paintbucket text-xs text-gray-600" />
            <span class="text-xs font-medium">Colors</span>
          </div>
          <i class="ki-outline ki-right text-xs text-gray-500" />
        </div>
      </div>
    </div>

    <!-- Generate按钮 -->
    <button
      class="kt-btn kt-btn-primary w-full flex items-center justify-center space-x-2 py-3"
      @click="handleGenerate"
    >
      <i class="ki-filled ki-click" />
      <span>Generate</span>
    </button>
  </div>
</template>

<style scoped>
/* 自定义样式 */
</style>
