export interface Creation {
  id: number
  original_id?: number
  prompt: string
  metadata: Metadata
  response: S3File
  created_at: string
  creator: Creator
  is_archived: boolean
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
