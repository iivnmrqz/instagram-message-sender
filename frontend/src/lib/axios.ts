import axios, { AxiosError, AxiosResponse } from 'axios'
import type { ApiError, ApiResponse } from './types/api'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const handleResponse = <T>(response: AxiosResponse): ApiResponse<T> => {
  return {
    data: response.data,
    status: response.status,
    message: 'Success'
  }
}

const handleError = (error: Error | AxiosError): never => {
  if (axios.isAxiosError(error)) {
    const apiError: ApiError = {
      message: error.response?.data?.message || 'An unexpected error occurred',
      status: error.response?.status || 500,
      code: error.code
    }
    throw apiError
  }
  throw error
}

const apiClient = {
  async get<T>(url: string) {
    try {
      const response = await api.get<T>(url)
      return handleResponse<T>(response)
    } catch (error) {
      throw handleError(error as Error | AxiosError)
    }
  },

  async post<T>(url: string, data?: unknown) {
    try {
      const response = await api.post<T>(url, data)
      return handleResponse<T>(response)
    } catch (error) {
      throw handleError(error as Error | AxiosError)
    }
  },

  async put<T>(url: string, data?: unknown) {
    try {
      const response = await api.put<T>(url, data)
      return handleResponse<T>(response)
    } catch (error) {
      throw handleError(error as Error | AxiosError)
    }
  },

  async delete<T>(url: string) {
    try {
      const response = await api.delete<T>(url)
      return handleResponse<T>(response)
    } catch (error) {
      throw handleError(error as Error | AxiosError)
    }
  }
}

export default apiClient 