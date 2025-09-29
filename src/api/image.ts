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

export function generateImage(prompt: string) {
  return ApiService.post<GenerateImageResponse>('/creation', { prompt })
}
