import { LoginForm } from '@/components/login-form'

type LoginPageProps = {
  searchParams?: {
    callbackUrl?: string
  }
}

export default function Page({ searchParams }: LoginPageProps) {
  const redirectTarget =
    typeof searchParams?.callbackUrl === 'string' && searchParams.callbackUrl.startsWith('/')
      ? searchParams.callbackUrl
      : '/'

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm redirectTo={redirectTarget} />
      </div>
    </div>
  )
}
