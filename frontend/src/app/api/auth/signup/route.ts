import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createClient } from '@/lib/supabase/server'
import { randomUUID } from 'crypto'

function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  if (process.env.SITE_URL) {
    return process.env.SITE_URL
  }
  return 'http://localhost:3000'
}

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const displayName = (name as string | undefined)?.trim() || email.split('@')[0]

    // Create user in Supabase Auth to establish a session + OTP flow
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: displayName },
        emailRedirectTo: `${getSiteUrl()}/auth/callback`,
      },
    })

    if (signUpError) {
      console.error('Supabase auth sign up error:', signUpError)
      return NextResponse.json({ error: signUpError.message }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    // Preserve existing role/id if a legacy record exists
    const { data: existingUser } = await supabase
      .from('app_users')
      .select('id, role')
      .eq('email', email)
      .maybeSingle()

    const appUserId = existingUser?.id ?? signUpData.user?.id ?? randomUUID()

    const { data: newUser, error: upsertError } = await supabase
      .from('app_users')
      .upsert(
        {
          id: appUserId,
          email,
          password_hash: passwordHash,
          name: displayName,
          role: existingUser?.role ?? 'user',
        },
        { onConflict: 'email' }
      )
      .select('id, email, name')
      .single()

    if (upsertError) {
      console.error('Error syncing app_users:', upsertError)
      return NextResponse.json(
        { error: 'Failed to store user record' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'User created successfully',
      user: newUser,
      emailConfirmationSent: !signUpData.session,
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
