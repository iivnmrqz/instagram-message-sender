import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ErrorContainer } from "@/components/ui/error-container"
import { cn } from "@/lib/utils"
import type { ApiModeFormProps } from "@/types"

export const ApiForm = ({ 
  onApiInput, 
  formData, 
  handleApiSubmit, 
  jsonError 
}: ApiModeFormProps) => (
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