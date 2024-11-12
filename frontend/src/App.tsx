'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ErrorContainer } from "@/components/ui/error-container"
import { LoginForm } from "@/components/forms/LoginForm"
import { MessageForm } from "@/components/forms/MessageForm"
import { ApiForm } from "@/components/forms/ApiForm"
import { InstagramMessageSchema } from '@/lib/schemas'
import { ZodError } from 'zod'
import apiClient from '@/lib/axios'
import type { FormData } from '@/types'

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
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleInputChange = ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prevData => ({ ...prevData, [name]: value }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggedIn(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    
    try {
      await apiClient.post('/instagram/send-message', formData)
      setFormData(prev => ({ ...prev, message: '' }))
    } catch (error) {
      if (error instanceof Error) {
        setSubmitError(error.message)
      } else {
        setSubmitError('An unexpected error occurred')
      }
    }
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

  const handleLogout = () => {
    setIsLoggedIn(false)
    setFormData(prev => ({
      ...prev,
      username: '',
      password: ''
    }))
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
          {submitError && <ErrorContainer error={submitError} />}
          {isApiMode ? (
            <ApiForm 
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
                  onLogout={handleLogout}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}