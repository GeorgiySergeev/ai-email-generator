'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type SubmitButtonProps = {
  label: string
  loadingLabel?: string
  className?: string
}

export const SubmitButton = ({
  label,
  loadingLabel = 'AUTHENTICATING...',
  className,
}: SubmitButtonProps) => {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className={cn('w-full chamfered animate-pulse-glow', className)}
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {pending ? loadingLabel : label}
    </Button>
  )
}
