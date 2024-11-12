import { cn } from "@/lib/utils"

interface ErrorContainerProps {
  error: string | null
  className?: string
}

export const ErrorContainer = ({ error, className }: ErrorContainerProps) => {
  if (!error) return null

  return (
    <div className={cn(
      "mb-2 p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md",
      className
    )}>
      {error}
    </div>
  )
} 