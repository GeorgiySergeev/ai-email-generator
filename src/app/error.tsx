'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

const GlobalError = ({ error, reset }: ErrorProps) => {
  useEffect(() => {
    console.error('[GlobalError]', error.digest, error.message)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="space-y-2">
        <p className="font-label text-xs text-destructive uppercase tracking-widest mb-4">
          {'// ERR_UNEXPECTED'}
        </p>
        <h1 className="font-display text-3xl font-black text-foreground uppercase">SYSTEM_ERROR</h1>
        <p className="text-muted-foreground max-w-md font-mono text-sm">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
      </div>
      <Button onClick={reset} size="lg" className="chamfered">
        RETRY →
      </Button>
    </div>
  )
}

export default GlobalError
