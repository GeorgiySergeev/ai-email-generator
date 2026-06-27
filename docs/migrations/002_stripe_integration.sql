-- docs/migrations/002_stripe_integration.sql
-- Run this in Supabase SQL Editor or via `bunx supabase db push`

ALTER TABLE public.profiles
ADD COLUMN stripe_customer_id TEXT,
ADD COLUMN stripe_subscription_id TEXT,
ADD COLUMN stripe_price_id TEXT,
ADD COLUMN stripe_current_period_end TIMESTAMPTZ;
