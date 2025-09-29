import type { Role, UserProfile } from '../types/user'
import { intersection } from 'lodash'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getAuthToken, removeAuthToken } from '@/service/cookie'
import { ApiService } from '@/service/fetch'
import { useUserStore } from './user'

export const REDIRECT_PATH = 'VISION_REDIRECT_PATH'

export const useAuthStore = defineStore('auth', () => {
  const token = computed(getAuthToken)
  const userRole = computed(() => useUserStore().role)
  const currentUserProfile = ref<UserProfile>()
  const isAuthenticated = computed(() => !!currentUserProfile.value)

  async function verifyAuth() {
    if (currentUserProfile.value) {
      return currentUserProfile.value
    }

    if (!token.value) {
      return
    }

    try {
      const { data: profile } = await ApiService.get<UserProfile>('/my/sso')
      currentUserProfile.value = profile.value
      return profile.value
    }
    catch (e) {
      console.log(e)
      // logout()
    }
  }

  function verifyRole(roles: undefined | Role[]) {
    if (!roles || !roles.length)
      return true

    return (
      intersection(currentUserProfile.value?.roles, roles).length > 0
      && roles.includes(userRole.value)
    )
  }

  function logout() {
    delete currentUserProfile.value
    removeAuthToken()
  }

  return {
    currentUserProfile,
    isAuthenticated,
    verifyAuth,
    verifyRole,
    logout,
  }
})
