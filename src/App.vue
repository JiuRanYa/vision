<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ApiService } from './service/fetch'

const router = useRouter()

onMounted(() => {
  ApiService.init(router)
})
</script>

<template>
  <RouterView />
</template>
