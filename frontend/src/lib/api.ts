import type { InstagramMessage } from './types/api'
import apiClient from './axios'

export const sendInstagramMessage = async (payload: InstagramMessage) => {
  return apiClient.post('/send-message', payload)
}
