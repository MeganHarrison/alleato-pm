import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js'

const DEFAULT_METADATA = {
  full_name: 'Test User',
  avatar_url: 'https://avatar.vercel.sh/test',
}

type AdminClient = ReturnType<typeof createSupabaseAdminClient>

let cachedAdminClient: AdminClient | null | undefined

function getAdminClient(): AdminClient | null {
  if (cachedAdminClient !== undefined) {
    return cachedAdminClient
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SERVICE_KEY ??
    process.env.SUPABASE_SECRET_KEY

  if (!url || !serviceRoleKey) {
    cachedAdminClient = null
    return cachedAdminClient
  }

  cachedAdminClient = createSupabaseAdminClient(url, serviceRoleKey)
  return cachedAdminClient
}

async function ensureUserWithPassword(email: string, password: string) {
  const adminClient = getAdminClient()
  if (!adminClient) {
    return { success: false as const, error: null as Error | null }
  }

  const { error: createError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: DEFAULT_METADATA,
  })

  if (!createError) {
    return { success: true as const, error: null }
  }

  const alreadyRegistered =
    typeof createError.message === 'string' &&
    createError.message.toLowerCase().includes('already registered')

  if (!alreadyRegistered) {
    return { success: false as const, error: createError }
  }

  const { data: recoveryData, error: recoveryError } = await adminClient.auth.admin.generateLink({
    type: 'recovery',
    email,
  })

  if (recoveryError || !recoveryData.user) {
    return { success: false as const, error: recoveryError ?? createError }
  }

  const { error: updateError } = await adminClient.auth.admin.updateUserById(recoveryData.user.id, {
    password,
    email_confirm: true,
  })

  if (updateError) {
    return { success: false as const, error: updateError }
  }

  return { success: true as const, error: null }
}

function resolveRedirectUrl(request: Request, redirectPath: string) {
  try {
    const requestUrl = new URL(request.url)
    const hostHeader = request.headers.get('host')
    const host = hostHeader ?? requestUrl.host
    const protocol =
      host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : requestUrl.protocol.replace(':', '')
    const base = `${protocol}://${host}`
    return new URL(redirectPath, base)
  } catch {
    return new URL(redirectPath, request.url)
  }
}

export async function GET(request: Request) {
  // Only allow this in development mode
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This route is only available in development mode' },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email') || 'test@example.com';
  const password = searchParams.get('password') || 'testpassword123';
  const redirectTo = searchParams.get('redirect') || '/';

  try {
    const supabase = await createClient()

    const signInAttempt = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (!signInAttempt.error) {
      return NextResponse.redirect(resolveRedirectUrl(request, redirectTo))
    }

    let lastError: Error | null = signInAttempt.error

    const adminResult = await ensureUserWithPassword(email, password)
    if (adminResult.success) {
      const retrySignIn = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (!retrySignIn.error) {
        return NextResponse.redirect(resolveRedirectUrl(request, redirectTo))
      }

      lastError = retrySignIn.error
    } else if (adminResult.error) {
      lastError = adminResult.error
    }

    const signUpResult = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: DEFAULT_METADATA,
      },
    })

    if (signUpResult.error) {
      lastError = signUpResult.error
      return NextResponse.json(
        {
          error: 'Failed to create or sign in user',
          details: lastError?.message ?? 'Unknown error',
        },
        { status: 400 }
      )
    }

    if (signUpResult.data.user) {
      const adminClient = getAdminClient()
      if (adminClient) {
        await adminClient.auth.admin.updateUserById(signUpResult.data.user.id, {
          email_confirm: true,
        })
      }
    }

    const finalSignIn = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (!finalSignIn.error) {
      return NextResponse.redirect(resolveRedirectUrl(request, redirectTo))
    }

    lastError = finalSignIn.error

    return NextResponse.json(
      {
        error: 'Failed to create or sign in user',
        details: lastError?.message ?? 'Unknown error',
      },
      { status: 400 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        error: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
