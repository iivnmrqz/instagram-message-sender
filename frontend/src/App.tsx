'use client'

import { useState } from 'react'
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Textarea } from "./components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { Switch } from "./components/ui/switch"
import { InstagramMessageSchema } from '@/lib/schemas'
import { ZodError } from 'zod'
import { ErrorContainer } from "./components/ui/error-container"
import { cn } from "@/lib/utils"
import apiClient from './lib/axios'

interface FormData {
  username: string
  password: string
  recipient: string
  message: string
}

export default function InstagramMessageSender() {
  const [isApiMode, setIsApiMode] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    recipient: '',
    message: ''
  })
  const [jsonError, setJsonError] = useState<string | null>(null)

  const handleInputChange = ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prevData => ({ ...prevData, [name]: value }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggedIn(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await apiClient.post('/send-message', formData)
  }

  const handleApiInput = (jsonInput: string) => {
    try {
      if (!jsonInput.trim()) {
        setJsonError(null)
        return
      }
      
      // First validate JSON format
      const parsedJson = JSON.parse(jsonInput)
      
      // Then validate schema
      const validatedData = InstagramMessageSchema.parse(parsedJson)
      
      setJsonError(null)
      setFormData(validatedData)
      setIsLoggedIn(true)
    } catch (error) {
      if (error instanceof SyntaxError) {
        setJsonError('Invalid JSON format')
      } else if (error instanceof ZodError) {
        setJsonError(error.errors.map(err => err.message).join(', '))
      } else {
        setJsonError('An unexpected error occurred')
      }
    }
  }

  const handleApiModeChange = (checked: boolean) => {
    setIsApiMode(checked)
    if (!checked) {
      setFormData({
        username: '',
        password: '',
        recipient: '',
        message: ''
      })
      setIsLoggedIn(false)
      setJsonError(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <CardTitle className="text-2xl font-bold text-center">
            Instagram Message Sender
          </CardTitle>
          <div className="flex items-center justify-end space-x-2">
            <span className="text-sm text-gray-600">API Mode</span>
            <Switch
              checked={isApiMode}
              onCheckedChange={handleApiModeChange}
            />
          </div>
        </CardHeader>

        <CardContent>
          {isApiMode ? (
            <ApiModeForm 
              onApiInput={handleApiInput} 
              formData={formData}
              handleApiSubmit={handleSubmit}
              jsonError={jsonError}
            />
          ) : (
            <>
              {!isLoggedIn ? (
                <LoginForm 
                  formData={formData} 
                  onInputChange={handleInputChange} 
                  onSubmit={handleLogin} 
                />
              ) : (
                <MessageForm 
                  formData={formData} 
                  onInputChange={handleInputChange} 
                  onSubmit={handleSubmit} 
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface FormProps {
  formData: FormData
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onSubmit: (e: React.FormEvent) => void
}

export const LoginForm = ({ formData, onInputChange, onSubmit }: FormProps) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="space-y-2">
      <Input
        id="username"
        name="username"
        type="text"
        placeholder="Username"
        value={formData.username}
        onChange={onInputChange}
      />
      <Input
        id="password"
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={onInputChange}
      />
    </div>
    <Button type="submit" className="w-full">Login</Button>
  </form>
)

const MessageForm = ({ formData, onInputChange, onSubmit }: FormProps) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="space-y-2">
      <Input
        id="recipient"
        name="recipient"
        type="text"
        placeholder="Recipient Username"
        value={formData.recipient}
        onChange={onInputChange}
      />
      <Textarea
        id="message"
        name="message"
        placeholder="Your message"
        rows={4}
        value={formData.message}
        onChange={onInputChange}
      />
    </div>
    <Button type="submit" className="w-full">Send Message</Button>
  </form>
)

interface ApiModeFormProps {
  onApiInput: (value: string) => void
  formData: FormData
  handleApiSubmit: (e: React.FormEvent) => void
  jsonError: string | null
}

export const ApiModeForm = ({ onApiInput, formData, handleApiSubmit, jsonError }: ApiModeFormProps & { jsonError: string | null }) => (
  <form onSubmit={(e) => handleApiSubmit(e)} className="space-y-4">
    <div className="space-y-2">
      <Textarea
        id="apiInput"
        rows={8}
        placeholder="Paste JSON here"
        onChange={(e) => onApiInput(e.target.value)}
        className={cn(jsonError && "border-red-500 focus-visible:ring-red-500")}
      />
      <ErrorContainer error={jsonError} />
    </div>
    <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
      {JSON.stringify(formData, null, 2)}
    </pre>
    <Button 
      type="submit" 
      className="w-full"
      disabled={!!jsonError}
    >
      Send Message
    </Button>
  </form>
)