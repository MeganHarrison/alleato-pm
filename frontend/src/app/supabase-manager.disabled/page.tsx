import { Metadata } from "next"

import SupabaseManager from "@/components/supabase-manager"

export const metadata: Metadata = {
  title: "Supabase Manager (prototype)",
  description: "Internal console for managing Supabase authentication and database resources.",
}

export default function SupabaseManagerPrototypePage() {
  return (
    <main className="container mx-auto max-w-6xl space-y-8 py-10">
      <div className="rounded-2xl border border-dashed bg-muted/40 p-6 text-sm text-muted-foreground">
        This route remains disabled in production routing, but the component is bundled so deployments stay
        deterministic. Use it to validate Supabase UI experiments locally.
      </div>
      <SupabaseManager />
    </main>
  )
}
