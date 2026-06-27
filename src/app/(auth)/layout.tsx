import Link from 'next/link'

type AuthLayoutProps = { children: React.ReactNode }

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div
        className="fixed inset-0 opacity-[0.018] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0,255,136,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse,rgba(0,255,136,0.04)_0%,transparent_70%)] pointer-events-none" />

      <header className="relative z-10 border-b border-border px-4 py-4">
        <Link
          href="/"
          className="font-display font-black text-primary uppercase tracking-wider animate-rgb-shift"
        >
          NEUR·O·MAIL
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        {children}
      </main>

      <footer className="relative z-10 border-t border-border px-4 py-4 text-center font-mono text-xs text-muted-foreground">
        © {new Date().getFullYear()} NEUROMAIL
      </footer>
    </div>
  )
}
