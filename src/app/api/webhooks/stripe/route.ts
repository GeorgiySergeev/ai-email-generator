import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import Stripe from 'stripe'

// We need a server-side Supabase client with the service role key to bypass RLS
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return new NextResponse('Missing stripe-signature header', { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Webhook signature verification failed:', message)
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode === 'subscription' && session.subscription) {
          // Retrieve the subscription
          const sub = await stripe.subscriptions.retrieve(session.subscription as string)
          const userId = session.metadata?.supabase_uuid

          if (userId) {
            await updateProfileSubscription(userId, sub)
          }
        }
        break
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        // Retrieve the user from the customer id
        const { data: profileList } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', subscription.customer as string)

        if (profileList && profileList.length > 0 && profileList[0]) {
          await updateProfileSubscription(profileList[0].id, subscription)
        }
        break
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const { data: deletedProfileList } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', subscription.customer as string)

        if (deletedProfileList && deletedProfileList.length > 0 && deletedProfileList[0]) {
          await supabase
            .from('profiles')
            .update({
              plan: 'free',
              stripe_subscription_id: null,
              stripe_price_id: null,
              stripe_current_period_end: null,
            })
            .eq('id', deletedProfileList[0].id)
        }
        break
      }
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
  } catch (error) {
    console.error('Error handling webhook event:', error)
    return new NextResponse('Webhook handler failed', { status: 500 })
  }

  return new NextResponse('Webhook processed successfully', { status: 200 })
}

async function updateProfileSubscription(userId: string, subscription: Stripe.Subscription) {
  const item = subscription.items.data[0]
  if (!item) return
  const priceId = item.price.id
  let plan: 'free' | 'pro' | 'enterprise' = 'free'

  // Map Price ID to plan
  // You would typically match these against env variables for Pro and Enterprise
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
      console.error('Invalid current_period_end in webhook subscription:', subscription)
    }
  } catch (e) {
    console.error('Failed to parse date in webhook:', e)
  }

  await supabase
    .from('profiles')
    .update({
      plan,
      stripe_subscription_id: subscription.id,
      stripe_price_id: priceId,
      stripe_current_period_end: periodEnd,
    })
    .eq('id', userId)
}
