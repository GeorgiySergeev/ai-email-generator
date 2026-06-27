'use client'

import { useState } from 'react'
import { Copy, Check, Trash2, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { GeneratedEmail } from '@/types'
import { EMAIL_TONE_LABELS, EMAIL_LENGTH_LABELS } from '@/lib/validations/email-generator'
import { formatDate } from '@/lib/utils'

type EmailResultProps = {
  email: GeneratedEmail
  onDelete?: (id: string) => void
  onReset?: () => void
}

export const EmailResult = ({ email, onDelete, onReset }: EmailResultProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(email.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="bg-card border border-border overflow-hidden"
      style={{
        clipPath:
          'polygon(0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px))',
      }}
    >
      {/* Terminal header */}
      <div className="bg-muted border-b border-border px-4 py-2 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-destructive" />
        <span className="w-2 h-2 rounded-full bg-yellow-500" />
        <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_4px_#00ff88]" />
        <span className="ml-2 font-label text-xs text-muted-foreground tracking-wider">
          email.output
        </span>
      </div>

      <div className="p-5 space-y-4">
        {/* Header with subject + badges */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2 min-w-0 flex-1">
            <h3 className="font-mono text-sm font-bold text-foreground truncate">
              {email.subject}
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="chamfered font-label text-xs">
                {EMAIL_TONE_LABELS[email.tone]}
              </Badge>
              <Badge variant="outline" className="chamfered font-label text-xs">
                {EMAIL_LENGTH_LABELS[email.length]}
              </Badge>
              <Badge
                variant="outline"
                className="chamfered font-label text-xs text-muted-foreground"
              >
                {email.modelUsed}
              </Badge>
            </div>
          </div>
          <span className="font-mono text-xs text-muted-foreground whitespace-nowrap shrink-0">
            {formatDate(email.createdAt)}
          </span>
        </div>

        {/* Email content */}
        <div className="bg-background border border-border p-4">
          <pre className="font-mono text-sm text-foreground whitespace-pre-wrap leading-relaxed">
            {email.content}
          </pre>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy} className="chamfered gap-2">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'COPIED!' : 'COPY_TO_CLIPBOARD'}
          </Button>
          {onReset && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="chamfered gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              RESET
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(email.id)}
              className="chamfered gap-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
              DELETE
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
