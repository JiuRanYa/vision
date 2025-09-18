<script setup lang="ts">
import Sidebar from './sidebar.vue'
</script>

<template>
  <div class="flex">
    <Sidebar />

    <div class="bg-surface-0 flex flex-1 flex-col overflow-hidden md:h-screen">
      <div class="h-16 border-b border-gray-100">
        123
      </div>
      <RouterView />
    </div>
  </div>
</template>
