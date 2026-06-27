'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { generateEmailAction } from '@/actions/email'
import {
  GenerateEmailSchema,
  type GenerateEmailInput,
  EMAIL_TONE_OPTIONS,
  EMAIL_TONE_LABELS,
  EMAIL_LENGTH_OPTIONS,
  EMAIL_LENGTH_LABELS,
} from '@/lib/validations/email-generator'
import { useEmailGeneratorStore } from '@/store/email-generator'
import { EmailResult } from './email-result'
import { FormError } from '@/components/auth/form-error'

export const EmailGeneratorForm = () => {
  const { lastResult, error, setResult, setGenerating, setError } = useEmailGeneratorStore()
  const [isPending, startTransition] = useTransition()

  const form = useForm<GenerateEmailInput>({
    resolver: zodResolver(GenerateEmailSchema),
    defaultValues: { subject: '', tone: 'professional', length: 'medium' },
  })

  const onSubmit = (data: GenerateEmailInput) => {
    setGenerating(true)
    setError(null)
    const formData = new FormData()
    formData.set('subject', data.subject)
    formData.set('tone', data.tone)
    formData.set('length', data.length)

    startTransition(async () => {
      const result = await generateEmailAction(formData)
      setGenerating(false)
      if (result.success) {
        setResult(result.data)
        form.reset()
      } else {
        setError(result.error)
      }
    })
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormError message={error} />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-label text-xs text-muted-foreground uppercase tracking-wider">
                  01 // SUBJECT_LINE
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-primary font-mono text-sm pointer-events-none">
                      &gt;
                    </span>
                    <Textarea
                      placeholder="What is your email about?"
                      rows={3}
                      className="resize-none pl-8 chamfered"
                      disabled={isPending}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="tone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-label text-xs text-muted-foreground uppercase tracking-wider">
                    02 // TONE_MATRIX
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger className="chamfered">
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EMAIL_TONE_OPTIONS.map((tone) => (
                        <SelectItem key={tone} value={tone}>
                          {EMAIL_TONE_LABELS[tone]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-label text-xs text-muted-foreground uppercase tracking-wider">
                    03 // OUTPUT_LENGTH
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger className="chamfered">
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EMAIL_LENGTH_OPTIONS.map((len) => (
                        <SelectItem key={len} value={len}>
                          {EMAIL_LENGTH_LABELS[len]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            size="lg"
            className="w-full chamfered animate-pulse-glow"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> GENERATING...
              </>
            ) : (
              <>GENERATE_EMAIL →</>
            )}
          </Button>
        </form>
      </Form>

      <AnimatePresence mode="wait">
        {lastResult && (
          <motion.div
            key={lastResult.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <EmailResult email={lastResult} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
