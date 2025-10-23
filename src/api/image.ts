import type { Creation } from '@/types/creation'
import { ApiService } from '@/service/fetch'

// API 响应类型定义
interface _GenerateImageResponse {
  response: {
    file_key: string
  }
}

interface _S3UrlResponse {
  url: string
}

interface HistoryImageItem {
  id: number
  original_id?: number
  prompt: string
  metadata: Record<string, any>
  response: {
    text: string
    original: {
      file_key: string
      mimeType: string
      file_name: string
      file_size: number
      file_extension: string
    }
    compressed: {
      large: {
        file_key: string
        mimeType: string
        file_name: string
        file_size: number
        file_extension: string
      }
      small: {
        file_key: string
        mimeType: string
        file_name: string
        file_size: number
        file_extension: string
      }
      medium: {
        file_key: string
        mimeType: string
        file_name: string
        file_size: number
        file_extension: string
      }
    }
    original_metadata: {
      size: number
      depth: string
      space: string
      width: number
      format: string
      height: number
      density: number
      channels: number
      hasAlpha: boolean
      isPalette: boolean
      autoOrient: {
        width: number
        height: number
      }
      hasProfile: boolean
      bitsPerSample: number
      isProgressive: boolean
    }
  }
  created_at: string
  creator: {
    _id: string
    name: string
    email: string
    title: string
  }
  is_archived: boolean
  derivatives_count: number
  inspiration?: any
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
  return ApiService.post<Creation[]>('/creation', { prompt, metadata })
}

export function getHistoryImages(page: number = 1, limit: number = 10) {
  return ApiService.get<HistoryImagesResponse>('/creation/history', { page, limit })
}
