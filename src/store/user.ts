import type { Role } from '../types/user'
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useAuthStore } from './auth'

export const useUserStore = defineStore('user', () => {
  const role = useLocalStorage<Role>('perference:di-user-role', null)
  const userRoles = computed(() => useAuthStore().currentUserProfile.roles)

  function initUserRole() {
    if (!role.value || !userRoles.value.includes(role.value)) {
      role.value = userRoles.value[0]
    }
  }

  function setRole(_role: Role) {
    role.value = _role
  }
  return {
    role,
    setRole,
    initUserRole,
  }
})
