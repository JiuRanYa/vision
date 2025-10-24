<script setup lang="ts">
import type { Model } from '@/config/models'
import { defineEmits, defineProps } from 'vue'

const _props = defineProps<{
  models: Model[]
  selectedModelId: number | null
  modalId?: string
}>()

const emit = defineEmits<{
  selectModel: [model: Model]
}>()

// 处理模型选择
function selectModel(model: Model) {
  emit('selectModel', model)
}
</script>

<template>
  <div
    :id="_props.modalId || 'model-select-modal'"
    class="kt-modal"
    data-kt-modal="true"
  >
    <div class="kt-modal-content max-w-[800px] top-[5%]">
      <!-- Modal Header -->
      <div class="kt-modal-header">
        <div>
          <h3 class="kt-modal-title">
            Featured models
          </h3>
          <p class="text-sm text-gray-500 font-normal mt-1">
            Our top models, ready to go
          </p>
        </div>
        <button
          type="button"
          class="kt-modal-close"
          data-kt-modal-dismiss="true"
        >
          <i class="ki-outline ki-cross text-lg" />
        </button>
      </div>

      <!-- Modal Body -->
      <div class="kt-modal-body p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="model in _props.models"
            :key="model.id"
            class="kt-card p-4 cursor-pointer relative transition-all duration-200"
            :class="{
              'border-2 border-blue-500 shadow-md': model.id === _props.selectedModelId,
              'hover:border-blue-300 hover:shadow-sm': model.id !== _props.selectedModelId,
            }"
            data-kt-modal-dismiss="true"
            @click="selectModel(model)"
          >
            <!-- Selection Checkmark for selected model -->
            <div
              v-if="model.id === _props.selectedModelId"
              class="z-[10] absolute top-2 left-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
            >
              <i class="ki-solid ki-check text-white text-xs" />
            </div>

            <!-- Model Image/Placeholder -->
            <div class="relative mb-3 h-24 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
              <img
                v-if="model.image"
                :src="model.image"
                :alt="model.name"
                class="w-full h-full object-cover"
              >
              <i
                v-else-if="model.icon"
                :class="`ki-outline ${model.icon} text-4xl text-gray-400`"
              />
              <span
                v-else
                class="text-gray-400 text-lg font-medium"
              >
                {{ model.name }}
              </span>

              <!-- NEW Badge -->
              <div
                v-if="model.badge === 'NEW'"
                class="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full"
              >
                NEW
              </div>
            </div>

            <!-- Model Details -->
            <h4 class="text-md font-semibold text-gray-900 mb-1">
              {{ model.name }}
            </h4>
            <p class="text-xs text-gray-600 mb-3 line-clamp-2">
              {{ model.description }}
            </p>

            <!-- Action/Resolution Info -->
            <div class="flex items-center justify-between text-xs text-gray-500">
              <div
                v-if="model.actionLabel"
                class="flex items-center space-x-1"
              >
                <i class="ki-outline ki-camera text-sm" />
                <span>{{ model.actionLabel }}</span>
              </div>
              <span v-if="model.resolution">{{ model.resolution }}</span>
            </div>
          </div>
        </div>

        <!-- Other models section -->
        <div class="mt-8 pt-6 border-t border-gray-100">
          <h4 class="text-md font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Other models
          </h4>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            New and classic with unique features
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
