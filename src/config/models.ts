export interface Model {
  id: number
  name: string
  description: string
  image?: string
  icon?: string
  badge?: 'NEW' | 'PRO'
  resolution?: string
  actionLabel?: string
  isPremium?: boolean
  type: 'image' | 'video'
}

// 图像生成模型
export const imageModels: Model[] = [
  {
    id: 1,
    name: 'Auto',
    description: 'Balance speed and quality for everyday use.',
    icon: 'ki-outline ki-camera',
    actionLabel: 'Start / End',
    type: 'image',
  },
  {
    id: 2,
    name: 'Wan 2.2',
    description: 'Cinematic control with unseen prompt adherence.',
    image: 'https://picsum.photos/id/237/200/150',
    isPremium: true,
    actionLabel: 'Start',
    resolution: '480p - 720p',
    type: 'image',
  },
  {
    id: 3,
    name: 'Kling 2.1 Master',
    description: 'Superb dynamics & prompt adherence.',
    image: 'https://picsum.photos/id/1005/200/150',
    isPremium: true,
    actionLabel: 'Start',
    resolution: '1080p',
    type: 'image',
  },
  {
    id: 4,
    name: 'PixVerse 5',
    description: 'Choose a style, add a custom seed, create with consistency.',
    badge: 'NEW',
    actionLabel: 'Start / End',
    resolution: '360p - 1080p',
    type: 'image',
  },
]

// 视频生成模型
export const videoModels: Model[] = [
  {
    id: 1,
    name: 'Auto',
    description: 'Balance speed and quality for everyday use.',
    icon: 'ki-outline ki-camera',
    actionLabel: 'Start / End',
    type: 'video',
  },
  {
    id: 2,
    name: 'Seedance 1.0 Pro',
    description: 'Precision storytelling with native multi-shot, style, and motion control.',
    isPremium: true,
    actionLabel: 'Start',
    resolution: '480p - 1080p',
    type: 'video',
  },
  {
    id: 3,
    name: 'MiniMax Hailuo 02',
    description: 'Fluid and natural camera work for complex motion.',
    isPremium: true,
    actionLabel: 'Start / End',
    resolution: '512p - 1080p',
    type: 'video',
  },
  {
    id: 4,
    name: 'Google Veo 3',
    description: 'Sound, voices, improved physics, and even higher quality.',
    isPremium: true,
    actionLabel: 'Start',
    resolution: '720p - 1080p',
    type: 'video',
  },
]

// 根据类型获取模型列表
export function getModelsByType(type: 'image' | 'video'): Model[] {
  return type === 'image' ? imageModels : videoModels
}
