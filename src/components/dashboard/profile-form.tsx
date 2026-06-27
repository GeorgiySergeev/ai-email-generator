'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { updateProfileAction } from '@/actions/profile'
import { UpdateProfileSchema, type UpdateProfileInput } from '@/lib/validations/profile'
import { FormError } from '@/components/auth/form-error'
import { Check } from 'lucide-react'
import type { Profile } from '@/types'

type ProfileFormProps = { profile: Profile }

export const ProfileForm = ({ profile }: ProfileFormProps) => {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: { fullName: profile.fullName ?? '' },
  })

  const onSubmit = (data: UpdateProfileInput) => {
    setError(null)
    setSuccess(false)
    const formData = new FormData()
    if (data.fullName) formData.set('fullName', data.fullName)

    startTransition(async () => {
      const result = await updateProfileAction(formData)
      if (result.success) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(result.error)
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormError message={error} />
        {success && (
          <div className="flex items-center gap-2 font-mono text-xs text-primary">
            <Check className="h-3.5 w-3.5" /> IDENTITY_UPDATED
          </div>
        )}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-label text-xs text-muted-foreground uppercase tracking-wider">
                DISPLAY NAME
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-mono text-sm pointer-events-none">
                    &gt;
                  </span>
                  <Input
                    placeholder="Enter display name"
                    disabled={isPending}
                    className="pl-8 chamfered"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="chamfered">
          {isPending ? 'UPDATING...' : 'UPDATE_IDENTITY →'}
        </Button>
      </form>
    </Form>
  )
}
