import type { Tag } from '@/components/EditableTags.vue'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ApiService } from '@/service/fetch'

export const useTagsStore = defineStore('tags', () => {
  // 已有标签列表
  const existingTags = ref<Tag[]>([])

  // 加载状态
  const isLoading = ref(false)
  // 是否已加载过
  const isLoaded = ref(false)

  const error = ref<Error | null>(null)

  // 加载已有标签
  async function fetchExistingTags(force = false) {
    // 如果已经加载过且不是强制刷新，直接返回
    if (isLoaded.value && !force) {
      return existingTags.value
    }

    // 如果正在加载中，等待加载完成
    if (isLoading.value) {
      return new Promise<Tag[]>((resolve) => {
        const checkLoading = setInterval(() => {
          if (!isLoading.value) {
            clearInterval(checkLoading)
            resolve(existingTags.value)
          }
        }, 100)
      })
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await ApiService.get('/tag')
      existingTags.value = response.data.value
      isLoaded.value = true
      return existingTags.value
    }
    catch (err) {
      error.value = err as Error
      console.error('Failed to fetch existing tags:', err)
      throw err
    }
    finally {
      isLoading.value = false
    }
  }

  // 添加新标签到列表
  function addTag(tag: Tag) {
    const index = existingTags.value.findIndex(t => t.id === tag.id)
    if (index === -1) {
      existingTags.value.push(tag)
    }
    else {
      // 如果已存在，更新
      existingTags.value[index] = tag
    }
  }

  // 更新标签
  function updateTag(tagId: string, updates: Partial<Tag>) {
    const index = existingTags.value.findIndex(t => t.id === tagId)
    if (index !== -1) {
      existingTags.value[index] = {
        ...existingTags.value[index],
        ...updates,
      }
    }
  }

  // 删除标签
  function removeTag(tagId: string) {
    existingTags.value = existingTags.value.filter(t => t.id !== tagId)
  }

  // 清空缓存（用于登出等场景）
  function clearCache() {
    existingTags.value = []
    isLoaded.value = false
    error.value = null
  }

  return {
    existingTags,
    isLoading,
    isLoaded,
    error,
    fetchExistingTags,
    addTag,
    updateTag,
    removeTag,
    clearCache,
  }
})
