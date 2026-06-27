'use client'

import { useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EmailResult } from './email-result'
import { deleteEmailAction } from '@/actions/email'
import type { GeneratedEmail } from '@/types'
import { useRouter } from 'next/navigation'

type EmailHistoryListProps = {
  emails: GeneratedEmail[]
}

export const EmailHistoryList = ({ emails }: EmailHistoryListProps) => {
  const router = useRouter()
  const [, startTransition] = useTransition()

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteEmailAction(id)
      if (result.success) router.refresh()
    })
  }

  if (emails.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-12 text-center">
        <p className="text-muted-foreground font-mono text-sm">
          No emails generated yet. Head to the{' '}
          <a href="/dashboard" className="text-primary underline underline-offset-4">
            Generator
          </a>{' '}
          to create your first one.
        </p>
      </div>
    )
  }

  return (
    <AnimatePresence>
      <div className="space-y-4">
        {emails.map((email, i) => (
          <motion.div
            key={email.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ delay: i * 0.05, duration: 0.25 }}
          >
            <EmailResult email={email} onDelete={handleDelete} />
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  )
}
