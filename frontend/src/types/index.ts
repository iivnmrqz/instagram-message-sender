export type FormData = InstagramMessage

export interface FormProps {
  formData: FormData
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onSubmit: (e: React.FormEvent) => void
  onLogout?: () => void
}

export interface ApiModeFormProps {
  onApiInput: (value: string) => void
  formData: FormData
  handleApiSubmit: (e: React.FormEvent) => void
  jsonError: string | null
} 

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
    success: boolean
    message: string
    status?: number
    code?: string
  } 