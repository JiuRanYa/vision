<script lang="ts" setup>
import { useRouteQuery } from '@vueuse/router'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { setAuthToken } from '@/service/cookie'
import { REDIRECT_PATH, useAuthStore } from '@/store/auth'

const router = useRouter()

const SSO_URL = `https://auth.spinxbi.com/?redirect=${window.location.origin}/sso`
function SSO_Redirect() {
  window.location.href = SSO_URL
}

const authTokenInQuery = useRouteQuery<string>('token')
onMounted(async () => {
  if (authTokenInQuery.value) {
    setAuthToken(authTokenInQuery.value)
    await useAuthStore().verifyAuth()
    router.replace(localStorage.getItem(REDIRECT_PATH) || '/')
  }
})

// 展示的AI生成作品示例
const showcaseImages = ref([
  {
    url: 'https://picsum.photos/800/1000?random=1',
    prompt: 'A serene mountain landscape at sunset with vibrant colors',
    creator: 'AI Artist',
    category: 'Landscape',
  },
  {
    url: 'https://picsum.photos/800/1000?random=2',
    prompt: 'Futuristic cityscape with neon lights and flying vehicles',
    creator: 'Tech Visionary',
    category: 'Sci-Fi',
  },
  {
    url: 'https://picsum.photos/800/1000?random=3',
    prompt: 'Abstract art with flowing colors and geometric patterns',
    creator: 'Creative Mind',
    category: 'Abstract',
  },
])

const currentImageIndex = ref(0)

// 自动轮播
onMounted(() => {
  setInterval(() => {
    currentImageIndex.value = (currentImageIndex.value + 1) % showcaseImages.value.length
  }, 5000)
})

// 平台特性数据
const features = [
  {
    icon: 'ki-picture',
    title: 'Image',
    color: 'text-blue-500',
  },
  {
    icon: 'ki-video',
    title: 'Video',
    color: 'text-purple-500',
  },
  {
    icon: 'ki-pencil',
    title: 'Edit',
    color: 'text-pink-500',
  },
]
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
    <!-- 主内容容器 -->
    <div class="flex min-h-screen">
      <!-- 左侧：AI作品展示区 -->
      <div class="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        <!-- 背景图片展示（轮播） -->
        <div class="absolute inset-0">
          <TransitionGroup name="fade">
            <div
              v-for="(image, index) in showcaseImages"
              v-show="index === currentImageIndex"
              :key="index"
              class="absolute inset-0"
            >
              <img
                :src="image.url"
                :alt="image.prompt"
                class="w-full h-full object-cover"
              >
              <!-- 渐变遮罩 -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
          </TransitionGroup>
        </div>

        <!-- 作品信息悬浮卡片 -->
        <div class="relative z-10 flex flex-col justify-between p-12 text-white">
          <!-- 顶部Logo -->
          <div class="flex items-center gap-3 animate-fade-in">
            <div class="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
              <i class="ki-solid ki-picture text-xl text-white" />
            </div>
            <h1 class="text-2xl font-bold">
              Vision
            </h1>
          </div>

          <!-- 底部作品信息 -->
          <div class="space-y-4 animate-fade-in-up">
            <!-- Prompt展示 -->
            <div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div class="flex items-start gap-3 mb-3">
                <div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i class="ki-outline ki-abstract text-sm text-white" />
                </div>
                <div class="flex-1">
                  <p class="text-sm text-white/70 mb-1">
                    AI Generated
                  </p>
                  <p class="text-base leading-relaxed">
                    {{ showcaseImages[currentImageIndex].prompt }}
                  </p>
                </div>
              </div>

              <!-- 创作者和分类 -->
              <div class="flex items-center justify-between pt-3 border-t border-white/10">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <i class="ki-solid ki-user text-xs text-white" />
                  </div>
                  <span class="text-sm">{{ showcaseImages[currentImageIndex].creator }}</span>
                </div>
                <span class="text-xs px-3 py-1 bg-white/20 rounded-full">
                  {{ showcaseImages[currentImageIndex].category }}
                </span>
              </div>
            </div>

            <!-- 轮播指示器 -->
            <div class="flex justify-center gap-2">
              <button
                v-for="(_, index) in showcaseImages"
                :key="index"
                class="w-2 h-2 rounded-full transition-all duration-300"
                :class="[
                  index === currentImageIndex
                    ? 'bg-white w-8'
                    : 'bg-white/40 hover:bg-white/60',
                ]"
                @click="currentImageIndex = index"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：登录区域 -->
      <div class="flex-1 flex items-center justify-center p-8 lg:p-12 relative">
        <!-- 移动端背景 -->
        <div class="lg:hidden absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />

        <div class="w-full max-w-md relative z-10 animate-fade-in-up">
          <!-- Logo（移动端） -->
          <div class="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <i class="ki-solid ki-picture text-2xl text-white" />
            </div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              Bole Vision
            </h1>
          </div>

          <!-- 登录卡片 -->
          <div class="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 lg:p-10 border border-gray-200 dark:border-gray-800">
            <!-- 欢迎标题 -->
            <div class="text-center mb-10">
              <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome Back
              </h2>
              <p class="text-gray-600 dark:text-gray-400">
                Sign in to continue your AI journey
              </p>
            </div>

            <!-- 平台特性标签 -->
            <div class="flex flex-wrap justify-center gap-2 mb-10">
              <div
                v-for="feature in features"
                :key="feature.title"
                class="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-full text-sm"
              >
                <i :class="`ki-outline ${feature.icon} ${feature.color}`" />
                <span class="text-gray-700 dark:text-gray-300">{{ feature.title }}</span>
              </div>
            </div>

            <!-- SSO登录按钮 -->
            <button
              class="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-3 group mb-8"
              @click="SSO_Redirect"
            >
              <i class="ki-outline ki-entrance-right text-xl group-hover:translate-x-1 transition-transform" />
              <span>Sign in with SSO</span>
            </button>

            <!-- 统计信息 -->
            <div class="grid grid-cols-3 gap-6 mb-8">
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  10K+
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  Creations
                </div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  500+
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  Users
                </div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  99%
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  Satisfaction
                </div>
              </div>
            </div>

            <!-- 帮助链接 -->
            <div class="text-center pt-6 border-t border-gray-200 dark:border-gray-800">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Need help?
                <a href="#" class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium hover:underline ml-1">
                  Contact Support
                </a>
              </p>
            </div>
          </div>

          <!-- 底部提示 -->
          <p class="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            By signing in, you agree to our
            <a href="#" class="text-gray-700 dark:text-gray-300 hover:underline">Terms</a>
            and
            <a href="#" class="text-gray-700 dark:text-gray-300 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 图片轮播淡入淡出效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 动画定义 */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 动画类 */
.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}

.animate-fade-in-up {
  animation: fade-in-up 1s ease-out 0.2s both;
}
</style>
