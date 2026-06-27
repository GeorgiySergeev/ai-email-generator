'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { verifyCheckoutSession } from '@/actions/stripe'
import { CheckCircle2 } from 'lucide-react'

export function CheckoutSuccessHandler() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (sessionId) {
      verifyCheckoutSession(sessionId).then((res) => {
        if (res.success) {
          setSuccess(true)
          // Clean URL without reloading page
          window.history.replaceState(null, '', '/dashboard')
        }
      })
    }
  }, [sessionId])

  if (!success) return null

  return (
    <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/30 flex items-center text-primary text-sm chamfered animate-in fade-in slide-in-from-top-4">
      <CheckCircle2 className="w-5 h-5 mr-3 flex-shrink-0" />
      <div>
        <span className="font-bold block">Оплата успешно завершена!</span>
        Ваш тариф обновлен, лимиты сняты. Приятного использования.
      </div>
    </div>
  )
}
