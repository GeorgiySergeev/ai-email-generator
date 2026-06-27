'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { mockAIProvider } from '@/lib/ai/providers/mock'
import { EMAIL_TONE_LABELS, EMAIL_TONE_OPTIONS } from '@/lib/validations/email-generator'

const LENGTH_OPTIONS = ['short', 'medium', 'long'] as const
type LengthOption = (typeof LENGTH_OPTIONS)[number]

export const DemoSection = () => {
  const [subject, setSubject] = useState('')
  const [tone, setTone] = useState<(typeof EMAIL_TONE_OPTIONS)[number]>('professional')
  const [length, setLength] = useState<LengthOption>('short')
  const [result, setResult] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleGenerate = () => {
    if (!subject.trim() || isPending) return
    startTransition(async () => {
      const res = await mockAIProvider.generateEmail({ subject, tone, length })
      setResult(res.content)
    })
  }

  const handleCopy = async () => {
    if (!result) return
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section
      id="demo"
      aria-labelledby="demo-heading"
      className="py-20 sm:py-28 bg-card border-y border-border"
    >
      <div className="container mx-auto">
        <div className="font-label text-xs text-primary uppercase tracking-[0.24em] mb-3">
          {'// 02_DEMO'}
        </div>
        <h2
          id="demo-heading"
          className="font-display text-2xl font-black text-foreground uppercase tracking-wider mb-3"
        >
          LIVE_DEMO
        </h2>
        <p className="font-mono text-sm text-muted-foreground mb-12">
          No registration required. Try the generator now.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 items-start">
          {/* Controls */}
          <div className="space-y-6">
            <div>
              <label
                htmlFor="demo-subject"
                className="font-label text-xs text-muted-foreground uppercase tracking-wider mb-2 block"
              >
                01 // SUBJECT LINE
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-primary font-mono text-sm pointer-events-none">
                  &gt;
                </span>
                <Textarea
                  id="demo-subject"
                  placeholder="What is your email about?"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  rows={2}
                  className="pl-8 resize-none"
                />
              </div>
            </div>

            <div>
              <label className="font-label text-xs text-muted-foreground uppercase tracking-wider mb-2 block">
                02 // TONE MATRIX
              </label>
              <Select value={tone} onValueChange={(v) => setTone(v as typeof tone)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  {EMAIL_TONE_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {EMAIL_TONE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="font-label text-xs text-muted-foreground uppercase tracking-wider mb-2 block">
                03 // OUTPUT LENGTH
              </label>
              <div className="flex gap-2">
                {LENGTH_OPTIONS.map((l) => (
                  <Button
                    key={l}
                    variant={length === l ? 'default' : 'outline'}
                    size="sm"
                    className="chamfered flex-1"
                    onClick={() => setLength(l)}
                  >
                    {l.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!subject.trim() || isPending}
              className="chamfered w-full animate-pulse-glow"
            >
              {isPending ? 'GENERATING...' : 'GENERATE_EMAIL →'}
            </Button>
          </div>

          {/* Output terminal */}
          <div className="bg-background border border-border overflow-hidden">
            <div className="bg-muted border-b border-border px-4 py-2 flex items-center justify-between">
              <span className="font-label text-xs text-muted-foreground tracking-wider">
                OUTPUT_STREAM
              </span>
              <div className="flex gap-1" aria-hidden="true">
                <span className="w-1.5 h-1.5 rounded-full bg-border" />
                <span className="w-1.5 h-1.5 rounded-full bg-border" />
                <span className="w-1.5 h-1.5 rounded-full bg-border" />
              </div>
            </div>
            <div className="p-5 min-h-[300px] flex flex-col">
              <AnimatePresence mode="wait">
                {!result && !isPending && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col items-center justify-center gap-3 opacity-30"
                  >
                    <div className="font-label text-xs text-muted-foreground uppercase tracking-wider">
                      AWAITING INPUT
                    </div>
                    <div className="font-mono text-xs text-muted-foreground">
                      Enter a subject and hit generate
                    </div>
                  </motion.div>
                )}

                {isPending && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-mono text-sm leading-loose"
                    aria-live="polite"
                    aria-label="Generating email"
                  >
                    <div className="text-primary">→ analyzing subject...</div>
                    <div className="text-tertiary">→ applying tone matrix...</div>
                    <div className="text-muted-foreground">
                      → generating output
                      <span className="animate-blink text-primary">_</span>
                    </div>
                  </motion.div>
                )}

                {result && !isPending && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex-1 flex flex-col"
                  >
                    <pre className="font-mono text-sm text-foreground whitespace-pre-wrap leading-relaxed flex-1">
                      {result}
                    </pre>
                    <div className="border-t border-border pt-3 mt-3 flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        className="chamfered"
                      >
                        {copied ? 'COPIED!' : 'COPY_TO_CLIPBOARD'}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
