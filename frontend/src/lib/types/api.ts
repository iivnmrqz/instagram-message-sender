export interface InstagramMessage {
  username: string
  password: string
  recipient: string
  message: string
}

export interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

export interface ApiError {
  message: string
  status: number
  code?: string
} 