export interface UserProfile {
  _id: string
  active: boolean
  assets: Record<string, any>
  avatar: string
  avatar_file: string
  email: string
  hired_date: number
  mobile: string
  name: string
  org_email: string
  roles: Role[]
  permissions: string[]
  title: string
  user_type: string
  userid: string
}

export type Role = any

export interface Creator {
  _id: string
  email: string
  name: string
  title: string
}
export interface Updater {
  _id: string
  email: string
  name: string
  title: string
}
