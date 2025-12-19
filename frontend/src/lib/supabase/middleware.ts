import { type NextRequest, NextResponse } from 'next/server'

import { createServerClient } from '@supabase/ssr'

import { getSupabaseConfig } from './config'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const { url, anonKey } = getSupabaseConfig()
  const supabase = createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Refresh session if expired
  const { data: { user } } = await supabase.auth.getUser()

  // Redirect to login if not authenticated and not on auth pages
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/auth/login') &&
    !request.nextUrl.pathname.startsWith('/auth/sign-up') &&
    !request.nextUrl.pathname.startsWith('/auth/callback') &&
    !request.nextUrl.pathname.startsWith('/auth/confirm')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('callbackUrl', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
