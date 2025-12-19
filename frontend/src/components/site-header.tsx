 "use client"

import Image from "next/image"
import Link from "next/link"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export function SiteHeader() {
  return (
    <header className="bg-gray-800 text-white flex items-center border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-3 px-4 py-3 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-4" />
        <Link href="/protected" className="flex items-center gap-2">
          <Image
            src="/Alleato Favicon.png"
            alt="Alleato"
            width={24}
            height={24}
            className="object-contain"
          />
          <span className="text-lg font-semibold">Alleato</span>
        </Link>
      </div>
    </header>
  )
}
