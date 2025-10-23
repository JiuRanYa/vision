export interface Creation {
  id: number
  original_id?: number
  prompt: string
  metadata: Metadata
  response: S3File
  created_at: string
  creator: Creator
  is_archived: boolean
  derivatives_count: number
  inspiration?: Inspiration
}

interface Metadata {
  attachment: Attachment
}
interface Attachment {
  text: string
  file_key: string
  mimeType: string
  file_name: string
  file_size: number
  file_extension: string
}
interface S3File {
  text: string
  original: FileInfo
  compressed: {
    large: FileInfo
    small: FileInfo
    medium: FileInfo
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

interface FileInfo {
  file_key: string
  mimeType: string
  file_name: string
  file_size: number
  file_extension: string
}
interface Creator {
  _id: string
  name: string
  email: string
  title: string
}

export interface Inspiration {
  id: number
  creation_id: number
  created_at: string
  creation: Creation
  creator: Creator
  is_archived: boolean
  tags: Tag[]
}

export interface Tag {
  id: number
  text: string
  background: string
  created_at: string
  creator: Creator
  is_archived: boolean
}
