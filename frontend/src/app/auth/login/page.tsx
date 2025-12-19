import Image from "next/image"
import Link from "next/link"

import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <Image
              src="/Alleato Favicon.png"
              alt="Alleato"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="text-xl font-semibold">Alleato</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/alleato-group.jpg"
          alt="Alleato Group"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  )
}
