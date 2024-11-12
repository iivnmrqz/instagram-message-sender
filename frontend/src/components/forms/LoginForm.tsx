import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { FormProps } from "@/types"

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