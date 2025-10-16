<script setup lang="ts">
import Sidebar from './sidebar.vue'
</script>

<template>
  <div class="flex">
    <Sidebar />

    <div class="bg-white dark:bg-gray-900 flex flex-1 flex-col overflow-hidden md:h-screen">
      <!-- 主内容区域 -->
      <RouterView />
    </div>
  </div>
</template>
