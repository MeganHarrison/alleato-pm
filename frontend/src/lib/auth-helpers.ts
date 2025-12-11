import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export type AuthUser = {
  id: string
  email: string
  name?: string | null
  role?: string
}

/**
 * Get the authenticated user from the session
 * Returns null if not authenticated
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return null
  }

  const user = session.user as { id?: string; email?: string; name?: string | null; role?: string }

  return {
    id: user.id ?? '',
    email: user.email ?? '',
    name: user.name,
    role: user.role,
  }
}

/**
 * Require authentication - throws if not authenticated
 * Use this in API routes that require a logged-in user
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  return user
}
