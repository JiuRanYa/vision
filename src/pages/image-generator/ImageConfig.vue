<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'
import ModelSelectModal from '@/components/ModelSelectModal.vue'
import { imageModels } from '@/config/models'

// 定义props
const props = defineProps<{
  config: {
    prompt: string
    model: string
    modelId: number
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
function updateConfig(newConfig: Partial<typeof props.config>) {
  const updatedConfig = { ...props.config, ...newConfig }
  emit('update:config', updatedConfig)
}

// 生成图片
function handleGenerate() {
  emit('generate')
}

// 处理模型选择
function handleModelSelect(model: { id: number, name: string }) {
  updateConfig({
    model: model.name,
    modelId: model.id,
  })
}

// 配置选项数据
const styleOptions = [
  'Realistic',
  'Anime',
  'Cartoon',
  'Oil Painting',
  'Watercolor',
  'Sketch',
  'Digital Art',
  'Photography',
]

const compositionOptions = [
  'Portrait',
  'Landscape',
  'Close-up',
  'Wide Shot',
  'Bird\'s Eye View',
  'Low Angle',
  'Macro',
  'Panoramic',
]

const effectsOptions = [
  'None',
  'Blur',
  'Motion Blur',
  'Depth of Field',
  'Bokeh',
  'Grain',
  'Vignette',
  'HDR',
]

const characterOptions = [
  'None',
  'Human',
  'Animal',
  'Fantasy Creature',
  'Robot',
  'Alien',
  'Superhero',
  'Villain',
  'Child',
  'Elderly',
]

const objectOptions = [
  'None',
  'Vehicle',
  'Building',
  'Nature',
  'Food',
  'Technology',
  'Weapon',
  'Tool',
  'Furniture',
  'Clothing',
]

const colorOptions = [
  'None',
  'Monochrome',
  'Vibrant',
  'Pastel',
  'Dark',
  'Bright',
  'Warm',
  'Cool',
  'Neutral',
  'Rainbow',
]

// 处理选项选择
function handleOptionSelect(key: string, value: string) {
  updateConfig({ [key]: value })
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
        @input="updateConfig({ prompt: ($event.target as HTMLTextAreaElement).value })"
      />
    </div>

    <!-- 设置选项 -->
    <div class="space-y-3">
      <!-- Model -->
      <div
        class="kt-card cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        data-kt-modal-toggle="#image-model-select-modal"
      >
        <div class="flex items-center justify-between p-3">
          <div class="flex items-center space-x-3">
            <i class="ki-outline ki-star text-xs text-gray-600 dark:text-gray-400" />
            <span class="text-xs font-medium">Model</span>
            <div class="w-2 h-2 bg-blue-500 rounded-full" />
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-xs text-gray-600 dark:text-gray-400">{{ config.model }}</span>
            <i class="ki-outline ki-right text-xs text-gray-500" />
          </div>
        </div>
      </div>

      <!-- Style -->
      <div
        class="kt-card cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        data-kt-dropdown="true"
        data-kt-dropdown-trigger="click"
      >
        <div class="flex items-center justify-between p-3" data-kt-dropdown-toggle="true">
          <div class="flex items-center space-x-3">
            <i class="ki-outline ki-star text-xs text-gray-600 dark:text-gray-400" />
            <span class="text-xs font-medium">Style</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-xs text-gray-600 dark:text-gray-400">{{ config.style }}</span>
            <i class="ki-outline ki-right text-xs text-gray-500" />
          </div>
        </div>
        <div class="kt-dropdown w-full max-w-48 p-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg" data-kt-dropdown-menu="true">
          <div class="space-y-1">
            <button
              v-for="option in styleOptions"
              :key="option"
              class="w-full text-left px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              :class="{ 'bg-gray-100 dark:bg-gray-700': config.style === option }"
              data-kt-dropdown-dismiss="true"
              @click="handleOptionSelect('style', option)"
            >
              {{ option }}
            </button>
          </div>
        </div>
      </div>

      <!-- Composition -->
      <div
        class="kt-card cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        data-kt-dropdown="true"
        data-kt-dropdown-trigger="click"
      >
        <div class="flex items-center justify-between p-3" data-kt-dropdown-toggle="true">
          <div class="flex items-center space-x-3">
            <i class="ki-outline ki-element-8 text-xs text-gray-600 dark:text-gray-400" />
            <span class="text-xs font-medium">Composition</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-xs text-gray-600 dark:text-gray-400">{{ config.composition }}</span>
            <i class="ki-outline ki-right text-xs text-gray-500" />
          </div>
        </div>
        <div class="kt-dropdown w-full max-w-48 p-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg" data-kt-dropdown-menu="true">
          <div class="space-y-1">
            <button
              v-for="option in compositionOptions"
              :key="option"
              class="w-full text-left px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              :class="{ 'bg-gray-100 dark:bg-gray-700': config.composition === option }"
              data-kt-dropdown-dismiss="true"
              @click="handleOptionSelect('composition', option)"
            >
              {{ option }}
            </button>
          </div>
        </div>
      </div>

      <!-- Effects -->
      <div
        class="kt-card cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        data-kt-dropdown="true"
        data-kt-dropdown-trigger="click"
      >
        <div class="flex items-center justify-between p-3" data-kt-dropdown-toggle="true">
          <div class="flex items-center space-x-3">
            <i class="ki-outline ki-picture text-xs text-gray-600 dark:text-gray-400" />
            <span class="text-xs font-medium">Effects</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-xs text-gray-600 dark:text-gray-400">{{ config.effects }}</span>
            <i class="ki-outline ki-right text-xs text-gray-500" />
          </div>
        </div>
        <div class="kt-dropdown w-full max-w-48 p-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg" data-kt-dropdown-menu="true">
          <div class="space-y-1">
            <button
              v-for="option in effectsOptions"
              :key="option"
              class="w-full text-left px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              :class="{ 'bg-gray-100 dark:bg-gray-700': config.effects === option }"
              data-kt-dropdown-dismiss="true"
              @click="handleOptionSelect('effects', option)"
            >
              {{ option }}
            </button>
          </div>
        </div>
      </div>

      <!-- Character -->
      <div
        class="kt-card cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        data-kt-modal-toggle="#character-select-modal"
      >
        <div class="flex items-center justify-between p-3">
          <div class="flex items-center space-x-3">
            <i class="ki-outline ki-user text-xs text-gray-600 dark:text-gray-400" />
            <span class="text-xs font-medium">Character</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-xs text-gray-600 dark:text-gray-400">{{ config.character }}</span>
            <i class="ki-outline ki-right text-xs text-gray-500" />
          </div>
        </div>
      </div>

      <!-- Object -->
      <div
        class="kt-card cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        data-kt-modal-toggle="#object-select-modal"
      >
        <div class="flex items-center justify-between p-3">
          <div class="flex items-center space-x-3">
            <i class="ki-outline ki-paintbucket text-xs text-gray-600 dark:text-gray-400" />
            <span class="text-xs font-medium">Object</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-xs text-gray-600 dark:text-gray-400">{{ config.object }}</span>
            <i class="ki-outline ki-right text-xs text-gray-500" />
          </div>
        </div>
      </div>

      <!-- Colors -->
      <div
        class="kt-card cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        data-kt-modal-toggle="#colors-select-modal"
      >
        <div class="flex items-center justify-between p-3">
          <div class="flex items-center space-x-3">
            <i class="ki-outline ki-paintbucket text-xs text-gray-600 dark:text-gray-400" />
            <span class="text-xs font-medium">Colors</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-xs text-gray-600 dark:text-gray-400">{{ config.colors }}</span>
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
      <i class="ki-filled ki-click" />
      <span>Generate</span>
    </button>

    <!-- Model选择Modal -->
    <ModelSelectModal
      :models="imageModels"
      :selected-model-id="config.modelId"
      modal-id="image-model-select-modal"
      @select-model="handleModelSelect"
    />

    <!-- Character选择Modal -->
    <div
      id="character-select-modal"
      class="kt-modal"
      data-kt-modal="true"
      data-kt-modal-width="400px"
    >
      <div class="kt-modal-dialog">
        <div class="kt-modal-content">
          <div class="kt-modal-header">
            <h3 class="kt-modal-title">
              Select Character
            </h3>
            <button class="kt-modal-close" data-kt-modal-dismiss="true">
              <i class="ki-outline ki-cross" />
            </button>
          </div>
          <div class="kt-modal-body">
            <div class="grid grid-cols-2 gap-3">
              <div
                v-for="option in characterOptions"
                :key="option"
                class="p-3 rounded-lg border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                :class="{ 'border-blue-500 bg-blue-50 dark:bg-blue-900/20': config.character === option }"
                @click="handleOptionSelect('character', option)"
              >
                <div class="text-center">
                  <i class="ki-outline ki-user text-lg mb-2" />
                  <div class="text-sm font-medium">
                    {{ option }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Object选择Modal -->
    <div
      id="object-select-modal"
      class="kt-modal"
      data-kt-modal="true"
      data-kt-modal-width="400px"
    >
      <div class="kt-modal-dialog">
        <div class="kt-modal-content">
          <div class="kt-modal-header">
            <h3 class="kt-modal-title">
              Select Object
            </h3>
            <button class="kt-modal-close" data-kt-modal-dismiss="true">
              <i class="ki-outline ki-cross" />
            </button>
          </div>
          <div class="kt-modal-body">
            <div class="grid grid-cols-2 gap-3">
              <div
                v-for="option in objectOptions"
                :key="option"
                class="p-3 rounded-lg border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                :class="{ 'border-blue-500 bg-blue-50 dark:bg-blue-900/20': config.object === option }"
                @click="handleOptionSelect('object', option)"
              >
                <div class="text-center">
                  <i class="ki-outline ki-paintbucket text-lg mb-2" />
                  <div class="text-sm font-medium">
                    {{ option }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Colors选择Modal -->
    <div
      id="colors-select-modal"
      class="kt-modal"
      data-kt-modal="true"
      data-kt-modal-width="400px"
    >
      <div class="kt-modal-dialog">
        <div class="kt-modal-content">
          <div class="kt-modal-header">
            <h3 class="kt-modal-title">
              Select Colors
            </h3>
            <button class="kt-modal-close" data-kt-modal-dismiss="true">
              <i class="ki-outline ki-cross" />
            </button>
          </div>
          <div class="kt-modal-body">
            <div class="grid grid-cols-2 gap-3">
              <div
                v-for="option in colorOptions"
                :key="option"
                class="p-3 rounded-lg border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                :class="{ 'border-blue-500 bg-blue-50 dark:bg-blue-900/20': config.colors === option }"
                @click="handleOptionSelect('colors', option)"
              >
                <div class="text-center">
                  <i class="ki-outline ki-paintbucket text-lg mb-2" />
                  <div class="text-sm font-medium">
                    {{ option }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
