'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { stripe } from '@/lib/stripe'
import type { Database } from '@/types/database'

function getAdminSupabase() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function createCheckoutSession(
  plan: 'pro' | 'enterprise',
  period: 'monthly' | 'yearly'
) {
  let priceId = ''

  if (plan === 'pro') {
    priceId =
      period === 'monthly'
        ? process.env.STRIPE_PRICE_PROFESSIONAL_MONTHLY!
        : process.env.STRIPE_PRICE_PROFESSIONAL_ANNUAL!
  } else if (plan === 'enterprise') {
    priceId =
      period === 'monthly'
        ? process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY!
        : process.env.STRIPE_PRICE_ENTERPRISE_ANNUAL!
  }

  if (!priceId) {
    return {
      success: false,
      error: `No Stripe Price ID configured for plan ${plan} and period ${period}`,
    }
  }

  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'User not authenticated' }
  }

  const { data: profile } = (await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()) as { data: { stripe_customer_id: string | null } | null }

  let customerId = profile?.stripe_customer_id

  if (!customerId) {
    if (!user.email) return { success: false, error: 'No user email found' }
    // Create a new Stripe customer
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        supabase_uuid: user.id,
      },
    })
    customerId = customer.id

    // We shouldn't strictly update profiles here, webhooks or another direct db update using service role could do it,
    // but doing it here directly via supabase service role is cleaner if we don't wait for webhook.
    // Regular RLS blocks updates to stripe_customer_id, so we use the admin client.
    const adminSupabase = getAdminSupabase()
    await adminSupabase
      .from('profiles')
      .update({ stripe_customer_id: customerId } as never)
      .eq('id', user.id)
  }

  const headersList = await headers()
  const origin =
    headersList.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  let session
  try {
    session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
      metadata: {
        supabase_uuid: user.id,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Stripe error:', error)
    return { success: false, error: message }
  }

  if (session?.url) {
    return { success: true, url: session.url }
  }

  return { success: false, error: 'Failed to create session URL' }
}

export async function createCustomerPortalSession() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = (await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()) as { data: { stripe_customer_id: string | null } | null }

  if (!profile?.stripe_customer_id) {
    throw new Error('No Stripe customer found')
  }

  const headersList = await headers()
  const origin =
    headersList.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  let portalSession
  try {
    const configurationId = process.env.STRIPE_PORTAL_CONFIGURATION_ID

    if (configurationId) {
      portalSession = await stripe.billingPortal.sessions.create({
        customer: profile.stripe_customer_id,
        return_url: `${origin}/profile`,
        configuration: configurationId,
      })
    } else {
      portalSession = await stripe.billingPortal.sessions.create({
        customer: profile.stripe_customer_id,
        return_url: `${origin}/profile`,
      })
    }
  } catch (err) {
    console.error('Error creating portal session:', err)
    throw new Error('Failed to create billing portal session')
  }

  if (portalSession.url) {
    redirect(portalSession.url)
  }
}

export async function verifyCheckoutSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status === 'paid' && session.subscription) {
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
      const userId = session.metadata?.supabase_uuid

      if (userId) {
        const item = subscription.items.data[0]
        if (!item) return { success: false }
        const priceId = item.price.id

        let plan: 'free' | 'pro' | 'enterprise' = 'free'
        if (
          priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY ||
          priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY ||
          priceId === process.env.STRIPE_PRICE_PROFESSIONAL_ANNUAL ||
          priceId === process.env.STRIPE_PRICE_PROFESSIONAL_MONTHLY
        ) {
          plan = 'pro'
        } else if (
          priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ENT_MONTHLY ||
          priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ENT_YEARLY ||
          priceId === process.env.STRIPE_PRICE_ENTERPRISE_ANNUAL ||
          priceId === process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY
        ) {
          plan = 'enterprise'
        }

        let periodEnd = null
        try {
          const ts = (subscription as { current_period_end?: unknown }).current_period_end
          if (ts && typeof ts === 'number') {
            periodEnd = new Date(ts * 1000).toISOString()
          } else {
            console.error('Invalid current_period_end in subscription:', subscription)
          }
        } catch (e) {
          console.error('Failed to parse date:', e)
        }

        const adminSupabase = getAdminSupabase()
        await adminSupabase
          .from('profiles')
          .update({
            plan,
            stripe_subscription_id: subscription.id,
            stripe_price_id: priceId,
            stripe_current_period_end: periodEnd,
          } as never)
          .eq('id', userId)

        return { success: true }
      }
    }
  } catch (error) {
    console.error('Error verifying checkout session:', error)
  }
  return { success: false }
}
