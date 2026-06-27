import { createClient } from '@supabase/supabase-js'
import type { Database } from '../../types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!serviceRoleKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required for seeding')
  process.exit(1)
}

const supabase = createClient<Database>(supabaseUrl, serviceRoleKey)

const seedProfiles = async () => {
  const testUsers = [
    { email: 'demo@example.com', full_name: 'Demo User', plan: 'free' as const },
    { email: 'pro@example.com', full_name: 'Pro User', plan: 'pro' as const },
  ]

  for (const user of testUsers) {
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', user.email)
      .single()

    if (existing) {
      console.log(`⏭️  Profile ${user.email} already exists`)
      continue
    }

    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: 'password123',
      email_confirm: true,
      user_metadata: { full_name: user.full_name },
    })

    if (authError) {
      console.error(`❌ Failed to create ${user.email}:`, authError.message)
      continue
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ full_name: user.full_name, plan: user.plan })
      .eq('id', authUser.user.id)

    if (profileError) {
      console.error(`❌ Failed to update profile ${user.email}:`, profileError.message)
    } else {
      console.log(`✅ Created ${user.email} (${user.plan})`)
    }
  }
}

const seedEmails = async () => {
  const { data: demoUser } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', 'demo@example.com')
    .single()

  if (!demoUser) {
    console.log('⏭️  Skipping email seed (demo user not found)')
    return
  }

  const sampleEmails = [
    {
      subject: 'Quarterly report',
      tone: 'professional' as const,
      length: 'medium' as const,
      content: 'Dear Team,\n\nI am writing to share our Q2 results...',
      model_used: 'mock',
    },
    {
      subject: 'Meeting invitation',
      tone: 'casual' as const,
      length: 'short' as const,
      content: "Hey everyone!\n\nLet's catch up next week...",
      model_used: 'mock',
    },
  ]

  for (const email of sampleEmails) {
    const { error } = await supabase
      .from('generated_emails')
      .insert({ user_id: demoUser.id, ...email })

    if (error) {
      console.error(`❌ Failed to insert email:`, error.message)
    } else {
      console.log(`✅ Created email: ${email.subject}`)
    }
  }
}

const main = async () => {
  console.log('🌱 Seeding database...\n')
  await seedProfiles()
  await seedEmails()
  console.log('\n✨ Seed complete!')
  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
