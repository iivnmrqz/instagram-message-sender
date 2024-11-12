import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { FormProps } from "@/types"

export const MessageForm = ({ formData, onInputChange, onSubmit }: FormProps) => (
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