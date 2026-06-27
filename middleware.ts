import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

const SUPPORTED_LOCALES = ['en', 'ru']
const DEFAULT_LOCALE = 'en'

function detectLocale(request: NextRequest): string {
  const cookie = request.cookies.get('NEXT_LOCALE')?.value
  if (cookie && SUPPORTED_LOCALES.includes(cookie)) return cookie

  const acceptLanguage = request.headers.get('accept-language') ?? ''
  const preferred = acceptLanguage
    .split(',')
    .map((s) => (s.split(';')[0] ?? '').trim().slice(0, 2).toLowerCase())
    .find((lang) => SUPPORTED_LOCALES.includes(lang))

  return preferred ?? DEFAULT_LOCALE
}

export const middleware = async (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet: { name: string; value: string; options: CookieOptions }[]) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: do not add logic between getUser() and the return
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const isDashboard =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/history')

  if (isDashboard && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const isAuth = pathname.startsWith('/login') || pathname.startsWith('/register')
  if (isAuth && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Set locale cookie if not already set (for next-intl)
  if (!request.cookies.get('NEXT_LOCALE')) {
    const locale = detectLocale(request)
    supabaseResponse.cookies.set('NEXT_LOCALE', locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    })
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|api).*)'],
}
