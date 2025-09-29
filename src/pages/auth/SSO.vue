<script lang="ts" setup>
import { useRouteQuery } from '@vueuse/router'
import { onMounted } from 'vue'
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
</script>

<template>
  <div class="grid lg:grid-cols-2 grow">
    <div class="flex justify-center items-center p-8 lg:p-10 order-2 lg:order-1">
      <div class="kt-card max-w-[440px] w-full">
        <div
          id="check_email_form"
          action="#"
          class="kt-card-content p-10"
          method="post"
        >
          <div class="flex justify-center py-10" />
          <h3 class="text-lg font-semibold text-mono text-center mb-3">
            登录
          </h3>
          <div class="text-2sm font-medium text-center text-gray-600 mb-7.5">
            点击下方按钮，在
            <a class="text-2sm text-gray-800 font-medium hover:text-primary-active" href="#">
              SSO
            </a>
            中完成认证。
          </div>
          <div class="flex justify-center mb-5">
            <button class="kt-btn kt-btn-ghost kt-btn-sm justify-center px-10" @click="SSO_Redirect">
              <span class="font-semibold">Use SSO</span>
            </button>
          </div>
          <div class="flex items-center justify-center gap-1">
            <span class="text-xs text-gray-600">
              使用中遇到问题？请联系
            </span>
            <a class="text-xs link">
              平台组
            </a>
          </div>
        </div>
      </div>
    </div>
    <div
      class="lg:rounded-xl lg:border lg:border-gray-200 lg:m-5 order-1 lg:order-2 bg-gray-200 dark:bg-zinc-900"
    >
      <div class="h-full flex flex-col justify-between p-10 lg:px-16 lg:py-20 gap-4">
        <div class="flex items-center gap-3">
          <a href="/" />
          <h3 class="text-2xl font-semibold text-mono">
            Data Insights
          </h3>
        </div>

        <img
          alt="open"
          class="h-[300px] lg:h-[500px] reverse-color"
        >

        <div class="flex flex-col items-stretch gap-3">
          <div class="text-carter-one text-xl font-medium text-gray-600">
            "Boost your productivity with us,
            empower
            <span class="text-mono font-semibold">
              your workflow
            </span>
            and achieve more."
            <br>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
