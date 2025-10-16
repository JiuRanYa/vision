<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// 快捷入口
const quickActions = [
  {
    icon: 'ki-picture',
    title: 'Image Generator',
    description: 'Create stunning AI-generated images',
    color: 'from-blue-500 to-cyan-500',
    link: '/image-generator',
  },
  {
    icon: 'ki-video',
    title: 'Video Generator',
    description: 'Generate amazing AI videos',
    color: 'from-purple-500 to-pink-500',
    link: '/video-generator',
  },
  {
    icon: 'ki-abstract',
    title: 'Community',
    description: 'Explore community creations',
    color: 'from-orange-500 to-red-500',
    link: '/community',
  },
  {
    icon: 'ki-folder',
    title: 'My Creations',
    description: 'View and manage your works',
    color: 'from-green-500 to-emerald-500',
    link: '/my-creations',
  },
]

function navigateTo(link: string) {
  router.push(link)
}
</script>

<template>
  <div class="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <div class="max-w-7xl mx-auto px-6 py-12">
      <!-- 欢迎区域 -->
      <div class="mb-12 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to Vision AI
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Create stunning images and videos with the power of artificial intelligence.
          Start your creative journey today.
        </p>
      </div>

      <!-- 快捷入口网格 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div
          v-for="action in quickActions"
          :key="action.link"
          class="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-transparent overflow-hidden"
          @click="navigateTo(action.link)"
        >
          <!-- 渐变背景 -->
          <div
            class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300"
            :class="action.color"
          />

          <!-- 图标 -->
          <div
            class="w-14 h-14 rounded-xl bg-gradient-to-br mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
            :class="action.color"
          >
            <i :class="`ki-outline ${action.icon} text-2xl text-white`" />
          </div>

          <!-- 标题和描述 -->
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {{ action.title }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ action.description }}
          </p>

          <!-- 箭头图标 -->
          <div class="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            <i class="ki-outline ki-arrow-right text-gray-400 dark:text-gray-500" />
          </div>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700">
          <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            10K+
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Images Generated
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700">
          <div class="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            500+
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Active Users
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700">
          <div class="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
            2K+
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Community Posts
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700">
          <div class="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            99%
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Satisfaction
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

