<script setup lang="ts">
// 这是一个示例组件，用于在image-generator页面的header中显示
// 你可以在这里添加任何你想要的内容，比如标签切换、搜索框、筛选器等
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- 示例：标签页切换按钮 -->
    <div class="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      <button class="px-4 py-1.5 text-sm font-medium rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm transition-all">
        History
      </button>
      <button class="px-4 py-1.5 text-sm font-medium rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all">
        Inspiration
      </button>
    </div>
  </div>
</template>

