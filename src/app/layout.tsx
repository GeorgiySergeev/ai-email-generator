import type { Metadata } from 'next'
import { Orbitron, JetBrains_Mono, Share_Tech_Mono } from 'next/font/google'
import { cookies } from 'next/headers'
import { I18nProvider } from '@/components/shared/i18n-provider'
import './globals.css'
import enMessages from '../../messages/en.json'
import ruMessages from '../../messages/ru.json'

const MESSAGES = { en: enMessages, ru: ruMessages } as const
type Locale = keyof typeof MESSAGES

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '700', '900'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['300', '400', '500', '700'],
})

const shareTechMono = Share_Tech_Mono({
  subsets: ['latin'],
  variable: '--font-label',
  display: 'swap',
  weight: '400',
})

export const metadata: Metadata = {
  title: {
    default: 'NEUROMAIL — Write Better Emails in Seconds',
    template: '%s | NEUROMAIL',
  },
  description:
    "AI-powered email generation with precision tone control. No writer's block. No generic templates.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  openGraph: {
    title: 'NEUROMAIL',
    description: 'AI-powered email generation with precision tone control',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'NEUROMAIL' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEUROMAIL',
    description: 'AI-powered email generation with precision tone control',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

type RootLayoutProps = { children: React.ReactNode }

export default async function RootLayout({ children }: RootLayoutProps) {
  const cookieStore = await cookies()
  const raw = cookieStore.get('NEXT_LOCALE')?.value ?? 'en'
  const locale: Locale = raw in MESSAGES ? (raw as Locale) : 'en'

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${orbitron.variable} ${jetbrainsMono.variable} ${shareTechMono.variable} font-mono bg-background text-foreground antialiased`}
      >
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <I18nProvider locale={locale} messages={MESSAGES[locale]}>
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}
