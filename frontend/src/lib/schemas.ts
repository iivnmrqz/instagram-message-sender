import { z } from 'zod'

export const InstagramMessageSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  recipient: z.string().min(1, 'Recipient is required'),
  message: z.string().min(1, 'Message is required')
})

export type InstagramMessage = z.infer<typeof InstagramMessageSchema> 