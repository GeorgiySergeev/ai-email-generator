'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { RegisterSchema, type RegisterInput } from '@/lib/validations/auth'
import { registerAction } from '@/actions/auth'
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
import { FormError } from './form-error'
import { Loader2, Eye, EyeOff } from 'lucide-react'

export const RegisterForm = () => {
  const [serverError, setServerError] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = (data: RegisterInput) => {
    setServerError(null)
    const formData = new FormData()
    formData.set('email', data.email)
    formData.set('password', data.password)
    formData.set('confirmPassword', data.confirmPassword)

    startTransition(async () => {
      const result = await registerAction(formData)
      if (!result.success) {
        setServerError(result.error)
      } else {
        setEmailSent(true)
      }
    })
  }

  if (emailSent) {
    return (
      <div className="space-y-4 text-center">
        <div className="font-mono text-sm text-primary">✓ CHECK_YOUR_EMAIL</div>
        <p className="font-mono text-xs text-muted-foreground">
          {'// confirmation link sent — click it to activate your account'}
        </p>
        <p className="text-center font-mono text-xs text-muted-foreground">
          Already confirmed?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            LOGIN →
          </Link>
        </p>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FormError message={serverError} />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                01 // EMAIL_ADDRESS
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-mono text-sm pointer-events-none">
                    &gt;
                  </span>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={isPending}
                    className="pl-8"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                02 // PASSWORD
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-mono text-sm pointer-events-none">
                    &gt;
                  </span>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    disabled={isPending}
                    className="pl-8 pr-10"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </FormControl>
              <div className="font-mono text-xs text-muted-foreground mt-1">{'// min 8 chars'}</div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                03 // CONFIRM_PASSWORD
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-mono text-sm pointer-events-none">
                    &gt;
                  </span>
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    disabled={isPending}
                    className="pl-8 pr-10"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full animate-pulse-glow">
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? 'INITIALIZING...' : 'CREATE_ACCOUNT →'}
        </Button>

        <p className="text-center font-mono text-xs text-muted-foreground">
          Have account?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            LOGIN →
          </Link>
        </p>
      </form>
    </Form>
  )
}
