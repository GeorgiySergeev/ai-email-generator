import type { Metadata } from 'next'
import { RegisterForm } from '@/components/auth/register-form'

export const metadata: Metadata = { title: 'Register | NEUROMAIL' }

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md">
      <div className="font-mono text-xs text-primary uppercase tracking-[0.24em] mb-3 text-center">
        {'// NEW_USER_PROTOCOL'}
      </div>

      <div
        className="bg-card border border-border overflow-hidden"
        style={{
          clipPath:
            'polygon(0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px))',
        }}
      >
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="font-display text-2xl font-black text-foreground uppercase tracking-wider">
              SYSTEM_REGISTER
            </h1>
            <p className="font-mono text-sm text-muted-foreground">
              Create your account to start generating
            </p>
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
