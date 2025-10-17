<script setup lang="ts">
import { KTDropdown } from '@keenthemes/ktui/src'
import { storeToRefs } from 'pinia'
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useImageEditStore } from '@/store/image-edit'

const route = useRoute()
const imageEditStore = useImageEditStore()

// 从store获取状态
const {
  imageData,
  historyImages,
  editHistoryImages,
  selectedHistoryIndex,
  isCreatingNewCreation: isCreatingNewCreationByExitImage,
  editPrompt,
  confirmSaving,
} = storeToRefs(imageEditStore)

// 编辑工具状态
const activeTool = ref()

// Dropdown元素ref
const autoEnhanceDropdown = ref<HTMLElement | null>(null)

// 选择工具
function selectTool(toolId: string) {
  if (toolId === activeTool.value) {
    activeTool.value = ''
    return
  }
  activeTool.value = toolId
}

// 使用store的方法
const selectHistoryImage = imageEditStore.selectHistoryImage
const selectEditImage = imageEditStore.selectEditImage
const handleSendPrompt = imageEditStore.handleSendPrompt

// 设置dropdown事件监听
function setupDropdownListeners() {
  if (!autoEnhanceDropdown.value)
    return

  // 获取KTDropdown实例
  const dropdownInstance = KTDropdown.getInstance(autoEnhanceDropdown.value)
  if (!dropdownInstance)
    return

  // 监听dropdown关闭事件
  dropdownInstance.on('hide', () => {
    if (activeTool.value === 'auto-enhance') {
      activeTool.value = ''
    }
  })
}

onMounted(async () => {
  if (!route.query.creationId) {
    return
  }

  // 使用store加载数据
  await imageEditStore.loadImageData(route.query.creationId as string)
  await imageEditStore.loadHistoryImages()
  await imageEditStore.loadEditHistoryImages()

  nextTick(() => {
    KTDropdown.init()
    setupDropdownListeners()
  })
})

// 组件卸载时重置store
onUnmounted(() => {
  imageEditStore.$reset()
})
</script>

<template>
  <div class="relative h-full min-h-0 bg-white dark:bg-gray-900 flex">
    <!-- 主编辑区域 -->
    <div class="relative flex-1 flex items-center justify-center p-8 z-[120]">
      <div class="max-w-full max-h-full">
        <img
          v-if="imageData?.response?.file_key"
          :src="`/api/s3/proxy?key=${imageData.response.file_key}`"
          :alt="imageData.prompt"
          class="max-h-[80vh] object-contain rounded-lg shadow-lg"
        >
        <!-- 骨架屏占位符 -->
        <div
          v-else
          class="w-[600px] h-[80vh] max-h-[800px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-lg animate-pulse bg-[length:200%_100%] animate-shimmer"
        />
      </div>

      <div class="absolute bottom-6 w-full ms-4">
        <div>
          <div class="flex gap-2 overflow-auto scrollbar-hide">
            <div v-for="(item, index) in editHistoryImages" :key="index">
              <div class="size-10 relative">
                <img
                  :src="`/api/s3/proxy?key=${item.response.file_key}`"
                  :alt="item.prompt"
                  class="rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700"
                  @click="selectEditImage(item)"
                >
                <div v-if="imageData?.id === item.id" class="absolute inset-0 border-2 border-blue-500 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
        <div />
      </div>

      <!-- 悬浮工具栏 -->
      <div v-if="!confirmSaving" class="absolute bottom-6 bg-gray-100 dark:bg-gray-600 rounded-lg">
        <div class="flex items-center space-x-6 gap-2 m-2">
          <!-- 自动增强 -->
          <div
            ref="autoEnhanceDropdown"
            class="inline-flex me-0"
            data-kt-dropdown="true"
            data-kt-dropdown-trigger="click"
            data-kt-dropdown-placement="top"
          >
            <button
              class="w-8 h-8 flex items-center justify-center transition-all me-0 rounded-lg"
              :class="[
                activeTool === 'auto-enhance'
                  ? 'bg-primary text-white dark:bg-gray-700 dark:text-gray-100'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50',
              ]"
              title="自动增强"
              data-kt-dropdown-toggle="true"
              @click="selectTool('auto-enhance')"
            >
              <i class="ki-outline ki-star" />
            </button>

            <!-- Chat聊天框 -->
            <div class="kt-dropdown w-[500px] h-[100px] p-4 text-sm bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-gray-200/50 dark:border-gray-600/50 rounded-lg shadow-lg relative" data-kt-dropdown-menu="true">
              <!-- 输入框 -->
              <input
                v-model="editPrompt"
                class="w-full bg-transparent border-none hover:shadow-none outline-0 pr-12"
                placeholder="What you want to change"
              >
              <!-- 发送按钮 -->
              <button
                class="absolute right-2 bottom-2 w-8 h-8 bg-primary hover:bg-primary-dark text-white rounded-full flex items-center justify-center transition-colors"
                @click="handleSendPrompt"
              >
                <i class="ki-outline ki-paper-plane text-sm" />
              </button>
            </div>
          </div>

          <!-- 修补 -->
          <button
            class="w-8 h-8 flex items-center justify-center transition-all me-0 rounded-lg"
            :class="[
              activeTool === 'patch'
                ? 'bg-primary text-white dark:bg-gray-700 dark:text-gray-100'
                : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50',
            ]"
            title="修补"
            @click="selectTool('patch')"
          >
            <i class="ki-outline ki-paintbucket" />
          </button>

          <!-- 特效 -->
          <button
            class="w-8 h-8 flex items-center justify-center transition-all me-0 rounded-lg"
            :class="[
              activeTool === 'effects'
                ? 'bg-primary text-white dark:bg-gray-700 dark:text-gray-100'
                : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50',
            ]"
            title="特效"
            @click="selectTool('effects')"
          >
            <i class="ki-outline ki-star" />
          </button>

          <!-- 对比 -->
          <button
            class="w-8 h-8 flex items-center justify-center transition-all me-0 rounded-lg"
            :class="[
              activeTool === 'compare'
                ? 'bg-primary text-white dark:bg-gray-700 dark:text-gray-100'
                : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50',
            ]"
            title="对比"
            @click="selectTool('compare')"
          >
            <i class="ki-outline ki-element-8" />
          </button>

          <!-- 展开 -->
          <button
            class="w-8 h-8 flex items-center justify-center transition-all me-0 rounded-lg"
            :class="[
              activeTool === 'expand'
                ? 'bg-primary text-white dark:bg-gray-700 dark:text-gray-100'
                : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50',
            ]"
            title="展开"
            @click="selectTool('expand')"
          >
            <i class="ki-outline ki-maximize" />
          </button>

          <!-- 调整 -->
          <button
            class="w-8 h-8 flex items-center justify-center transition-all me-0 rounded-lg"
            :class="[
              activeTool === 'adjust'
                ? 'bg-primary text-white dark:bg-gray-700 dark:text-gray-100'
                : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50',
            ]"
            title="调整"
          >
            <i class="ki-outline ki-setting-2" />
          </button>
        </div>
      </div>

      <!-- 确认保存 -->
      <div v-else class="absolute bottom-6  bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center gap-2 p-2">
        <div v-for="(item, index) in editHistoryImages" :key="index">
          <div class="size-10 relative">
            <img
              :src="`/api/s3/proxy?key=${item.response.file_key}`"
              :alt="item.prompt"
              class="rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700"
              @click="imageData = item"
            >
            <div v-if="imageData?.id === item.id" class="absolute inset-0 border-2 border-blue-500 rounded-lg" />
          </div>
        </div>
        <div v-if="isCreatingNewCreationByExitImage" class="size-10 rounded-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse bg-[length:200%_100%] animate-shimmer" />
        <button class="kt-btn kt-btn-mono" @click="confirmSaving = false">
          Save
        </button>
      </div>
    </div>

    <!-- 右侧历史图片区域 -->
    <div class="w-24 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <!-- 历史图片列表 -->
      <div class="p-4 space-y-3 overflow-y-auto scrollbar-hide" style="height: calc(100vh - 64px);">
        <div
          v-for="(item, index) in historyImages"
          :key="item.id"
          class="relative group cursor-pointer"
          @click="selectHistoryImage(item)"
        >
          <div class="aspect-square size-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
            <img
              :src="`/api/s3/proxy?key=${item.response.file_key}`"
              :alt="item.prompt"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            >
          </div>
          <!-- 选中状态指示器 -->
          <div
            v-if="selectedHistoryIndex === index"
            class="absolute inset-0 border-2 border-blue-500 rounded-lg"
          />
          <div v-if="item.derivatives_count" class="absolute bottom-1 right-1 text-[10px] bg-black text-white dark:bg-gray-800 rounded p-0.5">
            {{ item.derivatives_count }} edits
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="confirmSaving" class="fixed inset-0 bg-white opacity-70 size-full z-100" />
</template>

<style scoped>
/* 自定义样式 */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}

/* Shimmer动画 */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.animate-shimmer {
  animation: shimmer 2s ease-in-out infinite;
}
</style>
