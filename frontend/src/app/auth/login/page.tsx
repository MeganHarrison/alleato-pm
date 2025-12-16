import { LoginForm } from '@/components/login-form'

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[]>>
}

export default async function Page({ searchParams }: LoginPageProps) {
  const resolvedParams = searchParams ? await searchParams : undefined
  const rawCallback = resolvedParams?.callbackUrl
  const callbackUrl =
    typeof rawCallback === 'string'
      ? rawCallback
      : Array.isArray(rawCallback)
        ? rawCallback[0]
        : undefined

  const redirectTarget =
    typeof callbackUrl === 'string' && callbackUrl.startsWith('/') ? callbackUrl : '/'

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm redirectTo={redirectTarget} />
      </div>
    </div>
  )
}
