import type { Creation } from '@/types/creation'
import { useFetch } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ApiService } from '@/service/fetch'

export const useImageEditStore = defineStore('image-edit', () => {
  // 当前编辑的图片数据
  const imageData = ref<Creation | undefined>()

  // 历史图片列表
  const historyImages = ref<Creation[]>([])

  // 编辑历史图片列表
  const editHistoryImages = ref<Creation[]>([])

  // 选中的历史图片索引
  const selectedHistoryIndex = ref(-1)

  // 由当前图片生成的新图片列表
  const generatedImagesByExitImage = ref<Creation[]>([])

  // Loading状态
  const isLoadingHistory = ref(false)
  const isCreatingNewCreation = ref(false)

  // 编辑提示词
  const editPrompt = ref('')

  // 确认保存状态
  const confirmSaving = ref(false)

  const {
    data: editHistoryData,
    isFetching: isLoadingEditHistory,
    execute: executeEditHistoryFetch,
  } = useFetch(
    () => `/api/creation/${imageData.value?.id}/history`,
    { immediate: false },
  ).get().json<Creation[]>()

  // 加载当前图片详情
  async function loadImageData(creationId: string | number) {
    try {
      const { data } = await ApiService.get(`/creation/${creationId}`)
      imageData.value = data.value
      return data.value
    }
    catch (error) {
      console.error('Failed to load image data:', error)
      throw error
    }
  }

  // 加载历史图片列表
  async function loadHistoryImages() {
    isLoadingHistory.value = true
    try {
      const { data } = await ApiService.get('creation/history', { page: 1, limit: 16 })
      historyImages.value = data.value.data

      // 找到当前图片在历史列表中的索引
      if (imageData.value) {
        selectedHistoryIndex.value = historyImages.value.findIndex(
          img => img.id === imageData.value!.id,
        )
      }

      return data.value.data
    }
    catch (error) {
      console.error('Failed to load history images:', error)
      throw error
    }
    finally {
      isLoadingHistory.value = false
    }
  }

  // 加载编辑历史
  async function loadEditHistoryImages() {
    if (!imageData.value || imageData.value.original_id) {
      editHistoryImages.value = []
      return
    }

    // 执行请求，useFetch会自动使用最新的imageData.value.id
    // 会自动中断之前未完成的请求
    await executeEditHistoryFetch()

    // 更新editHistoryImages
    if (editHistoryData.value) {
      editHistoryImages.value = editHistoryData.value
    }
  }

  // 选择历史图片
  function selectHistoryImage(item: Creation) {
    selectedHistoryIndex.value = historyImages.value.findIndex(img => img.id === item.id)
    editHistoryImages.value = [{ ...item }]
    imageData.value = { ...item }
    loadEditHistoryImages()
  }

  // 选择编辑图片
  function selectEditImage(item: Creation) {
    imageData.value = item
  }

  // 通过现有图片创建新图片
  async function createNewCreationByExitImage(prompt: string, exitImage: Creation) {
    isCreatingNewCreation.value = true
    try {
      const { data } = await ApiService.post<Creation>('/creation', {
        prompt,
        metadata: {
          attachment: exitImage.response,
        },
        original_id: historyImages.value[selectedHistoryIndex.value].id,
      })

      generatedImagesByExitImage.value = [...editHistoryImages.value]
      generatedImagesByExitImage.value.push(data.value)

      // 添加到编辑历史
      editHistoryImages.value = [...editHistoryImages.value, data.value]

      return data.value
    }
    catch (error) {
      console.error('Failed to create new creation:', error)
      throw error
    }
    finally {
      isCreatingNewCreation.value = false
    }
  }

  // 处理发送编辑提示词
  async function handleSendPrompt() {
    if (!editPrompt.value.trim()) {
      return
    }

    const prompt = editPrompt.value
    editPrompt.value = '' // 清空输入框

    confirmSaving.value = true

    try {
      await createNewCreationByExitImage(
        prompt,
        historyImages.value[selectedHistoryIndex.value],
      )
    }
    catch (error) {
      confirmSaving.value = false
      throw error
    }
  }

  // 发布当前图片到社区
  async function publishToCommuinty(tagIds: number[]) {
    if (!imageData.value) {
      throw new Error('No image data to publish')
    }

    try {
      const { data } = await ApiService.post('/inspiration', {
        creation_id: imageData.value.id,
        tag_ids: tagIds,
      })

      // 更新当前图片的inspiration数据
      if (imageData.value) {
        imageData.value.inspiration = data.value
      }

      return data.value
    }
    catch (error) {
      console.error('Failed to publish to community:', error)
      throw error
    }
  }

  // 取消发布
  async function unpublishFromCommunity() {
    if (!imageData.value?.inspiration) {
      throw new Error('No inspiration data to unpublish')
    }

    try {
      await ApiService.delete(`/inspiration/${imageData.value.inspiration.id}`)

      // 移除当前图片的inspiration数据
      if (imageData.value) {
        imageData.value.inspiration = undefined
      }
    }
    catch (error) {
      console.error('Failed to unpublish from community:', error)
      throw error
    }
  }

  // 点赞当前图片
  async function likeCurrentImage() {
    if (!imageData.value) {
      throw new Error('No image data to like')
    }

    try {
      // TODO: 实现实际的点赞API
      console.warn('Liking image:', imageData.value.id)
      // await ApiService.post(`/creation/${imageData.value.id}/like`)
    }
    catch (error) {
      console.error('Failed to like image:', error)
      throw error
    }
  }

  // 重置store
  function $reset() {
    imageData.value = undefined
    historyImages.value = []
    editHistoryImages.value = []
    selectedHistoryIndex.value = -1
    generatedImagesByExitImage.value = []
    isLoadingHistory.value = false
    isCreatingNewCreation.value = false
    editPrompt.value = ''
    confirmSaving.value = false
  }

  return {
    // State
    imageData,
    historyImages,
    editHistoryImages,
    selectedHistoryIndex,
    generatedImagesByExitImage,
    isLoadingHistory,
    isLoadingEditHistory,
    isCreatingNewCreation,
    editPrompt,
    confirmSaving,

    // Actions
    loadImageData,
    loadHistoryImages,
    loadEditHistoryImages,
    selectHistoryImage,
    selectEditImage,
    createNewCreationByExitImage,
    handleSendPrompt,
    publishToCommuinty,
    unpublishFromCommunity,
    likeCurrentImage,
    $reset,
  }
})
