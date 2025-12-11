// import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Check if we're using mock authentication
  const useMockAuth = request.cookies.get('use-mock-auth')?.value === 'true';
  const mockSession = request.cookies.get('mock-auth-session')?.value;
  
  // Allow access to dev routes without authentication
  if (request.nextUrl.pathname.startsWith('/dev') || 
      request.nextUrl.pathname === '/dev-login' || 
      request.nextUrl.pathname === '/mock-login') {
    return NextResponse.next({ request });
  }
  
  // If mock auth is enabled and we have a session, allow access
  if (useMockAuth && mockSession) {
    return NextResponse.next({ request });
  }
  
  // TEMPORARY: Auth disabled while Supabase is experiencing issues
  // Just pass through all requests without authentication checks
  return NextResponse.next({
    request,
  })

  /* AUTH DISABLED - Uncomment when Supabase is back online
  // Also uncomment the import above: import { createServerClient } from '@supabase/ssr'
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data } = await supabase.auth.getClaims()
  const user = data?.claims

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
  */
}
