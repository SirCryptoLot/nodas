import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl

  // Subdomain routing: xxx.nodas.lt → /s/xxx
  const subdomain = hostname.match(/^([a-z0-9-]+)\.nodas\.lt$/)?.[1]
  if (subdomain && subdomain !== 'www') {
    return NextResponse.rewrite(new URL(`/s/${subdomain}`, request.url))
  }

  // Auth guard
  const response = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if (pathname.startsWith('/admin')) {
    if (!user) return NextResponse.redirect(new URL('/auth/login', request.url))
    const ADMIN_EMAILS = ['tadasvwow066@gmail.com', 'info@nodas.lt']
    if (!ADMIN_EMAILS.includes(user.email ?? '')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()
      if (!profile?.is_admin) return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  if ((pathname === '/' || (pathname.startsWith('/auth') && !pathname.startsWith('/auth/callback'))) && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
}
