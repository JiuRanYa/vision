import { ApiService } from '@/service/fetch'

// API 响应类型定义
interface GenerateImageResponse {
  response: {
    file_key: string
  }
}

interface S3UrlResponse {
  url: string
}

interface HistoryImageItem {
  id: number
  prompt: string
  metadata: Record<string, any>
  response: {
    text: string
    file_key: string
    mimeType: string
    file_name: string
    file_size: number
    file_extension: string
  }
  created_at: string
  creator: {
    _id: string
    name: string
    email: string
    title: string
  }
  is_archived: boolean
}

interface HistoryImagesResponse {
  data: HistoryImageItem[]
  pagination: {
    page: string
    limit: string
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export function generateImage(prompt: string, metadata?: any) {
  return ApiService.post<GenerateImageResponse>('/creation', { prompt, metadata })
}

export function getHistoryImages(page: number = 1, limit: number = 10) {
  return ApiService.get<HistoryImagesResponse>('/creation/history', { page, limit })
}
