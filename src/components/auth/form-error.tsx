import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type FormErrorProps = {
  message: string | null | undefined
  className?: string
}

export const FormError = ({ message, className }: FormErrorProps) => {
  if (!message) return null
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-2 border border-destructive/50 bg-destructive/10',
        'px-3 py-2.5 font-mono text-xs text-destructive',
        className
      )}
      style={{
        clipPath:
          'polygon(0 4px,4px 0,calc(100% - 4px) 0,100% 4px,100% calc(100% - 4px),calc(100% - 4px) 100%,4px 100%,0 calc(100% - 4px))',
      }}
    >
      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <span>ERR: {message}</span>
    </div>
  )
}
