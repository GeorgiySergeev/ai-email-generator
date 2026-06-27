import type { Metadata } from 'next'
import { Orbitron, JetBrains_Mono, Share_Tech_Mono } from 'next/font/google'
import './globals.css'

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
  openGraph: {
    title: 'NEUROMAIL',
    description: 'AI-powered email generation with precision tone control',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'NEUROMAIL' }],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

type RootLayoutProps = { children: React.ReactNode }

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${orbitron.variable} ${jetbrainsMono.variable} ${shareTechMono.variable} font-mono bg-background text-foreground antialiased`}
      >
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
