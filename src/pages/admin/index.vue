<script setup lang="ts">
import { ref } from 'vue'

// Admin权限状态管理
const isAdmin = ref(true) // 临时设为true用于测试

// 视频生成排队假数据
const videoQueue = ref([
  {
    id: 'V001',
    user: 'user123',
    prompt: 'A beautiful sunset over mountains',
    status: 'generating',
    progress: 65,
    estimatedTime: '2m 30s',
    createdAt: '2024-01-15 10:30:00',
  },
  {
    id: 'V002',
    user: 'artist456',
    prompt: 'Flying dragon in the sky',
    status: 'queued',
    progress: 0,
    estimatedTime: '5m 15s',
    createdAt: '2024-01-15 10:32:00',
  },
  {
    id: 'V003',
    user: 'creator789',
    prompt: 'Ocean waves crashing on rocks',
    status: 'generating',
    progress: 23,
    estimatedTime: '3m 45s',
    createdAt: '2024-01-15 10:35:00',
  },
  {
    id: 'V004',
    user: 'designer101',
    prompt: 'City skyline at night',
    status: 'queued',
    progress: 0,
    estimatedTime: '4m 20s',
    createdAt: '2024-01-15 10:38:00',
  },
  {
    id: 'V005',
    user: 'maker202',
    prompt: 'Forest with magical creatures',
    status: 'completed',
    progress: 100,
    estimatedTime: '0m 0s',
    createdAt: '2024-01-15 10:25:00',
  },
])

// 统计信息
const stats = ref({
  totalTasks: videoQueue.value.length,
  generatingTasks: videoQueue.value.filter(task => task.status === 'generating').length,
  queuedTasks: videoQueue.value.filter(task => task.status === 'queued').length,
  completedTasks: videoQueue.value.filter(task => task.status === 'completed').length,
})

// 权限检查
if (!isAdmin.value) {
  // 重定向到首页或显示无权限页面
  console.warn('Access denied: Admin privileges required')
}
</script>

<template>
  <div v-if="isAdmin" class="h-full bg-white dark:bg-gray-900 flex flex-col">
    <!-- 页面标题 -->
    <div class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <i class="ki-outline ki-setting text-xl text-blue-600 dark:text-blue-400" />
          <h1 class="text-lg font-bold text-gray-900 dark:text-gray-100">
            Admin Dashboard
          </h1>
        </div>
        <div class="flex items-center space-x-4">
          <button class="kt-btn kt-btn-outline">
            <i class="ki-outline ki-refresh" />
            Refresh
          </button>
        </div>
      </div>
    </div>

    <!-- 可滚动的内容区域 -->
    <div class="flex-1 overflow-y-auto">
      <!-- 统计卡片 -->
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center">
              <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <i class="ki-outline ki-youtube text-xl text-blue-600 dark:text-blue-400" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Tasks
                </p>
                <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {{ stats.totalTasks }}
                </p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center">
              <div class="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <i class="ki-outline ki-youtube text-xl text-green-600 dark:text-green-400" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Generating
                </p>
                <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {{ stats.generatingTasks }}
                </p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center">
              <div class="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                <i class="ki-outline ki-time text-xl text-yellow-600 dark:text-yellow-400" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Queued
                </p>
                <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {{ stats.queuedTasks }}
                </p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center">
              <div class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <i class="ki-outline ki-check text-xl text-gray-600 dark:text-gray-400" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Completed
                </p>
                <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {{ stats.completedTasks }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 任务列表 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Video Generation Queue
            </h2>
          </div>

          <div class="p-6">
            <div class="space-y-4">
              <div
                v-for="task in videoQueue"
                :key="task.id"
                class="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
              >
                <!-- 任务头部 -->
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center space-x-3">
                    <i class="ki-outline ki-youtube text-lg text-blue-600 dark:text-blue-400" />
                    <div>
                      <h3 class="font-medium text-gray-900 dark:text-gray-100">
                        {{ task.id }}
                      </h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        User: {{ task.user }}
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-3">
                    <span
                      class="px-3 py-1 rounded-full text-sm font-medium"
                      :class="[
                        task.status === 'generating'
                          ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                          : task.status === 'queued'
                            ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
                      ]"
                    >
                      {{ task.status }}
                    </span>
                    <button class="kt-btn kt-btn-sm kt-btn-ghost">
                      <i class="ki-outline ki-dots-horizontal" />
                    </button>
                  </div>
                </div>

                <!-- Prompt -->
                <div class="mb-3">
                  <p class="text-sm text-gray-700 dark:text-gray-300">
                    {{ task.prompt }}
                  </p>
                </div>

                <!-- 进度和时间信息 -->
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <div v-if="task.status === 'generating'" class="mb-2">
                      <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{{ task.progress }}%</span>
                      </div>
                      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          class="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                          :style="{ width: `${task.progress}%` }"
                        />
                      </div>
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-500">
                      Created: {{ task.createdAt }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 无权限页面 -->
  <div v-else class="h-full flex items-center justify-center bg-white dark:bg-gray-900">
    <div class="text-center">
      <i class="ki-outline ki-shield-cross text-6xl text-gray-300 dark:text-gray-600 mb-4" />
      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Access Denied
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        You don't have permission to access this page.
      </p>
      <button class="kt-btn kt-btn-primary" @click="$router.push('/')">
        Go Home
      </button>
    </div>
  </div>
</template>
