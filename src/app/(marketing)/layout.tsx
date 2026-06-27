import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'

type MarketingLayoutProps = { children: React.ReactNode }

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  )
}
