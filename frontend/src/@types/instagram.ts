import { z } from 'zod'
import { InstagramMessageSchema } from '@/lib/schemas'

export type InstagramMessage = z.infer<typeof InstagramMessageSchema>

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