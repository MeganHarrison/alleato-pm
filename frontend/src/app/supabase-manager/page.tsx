"use client"

import { useState } from 'react'
import { useMobile } from '@/hooks/use-mobile'
import { Button } from '@/components/ui/button'
import SupabaseManagerDialog from '@/components/supabase-manager'

export default function SupabaseManagerPage() {
  const [open, setOpen] = useState(false)
  const projectRef = process.env.NEXT_PUBLIC_PROJ_REF || 'lgveqfnpkxvzbnnwuled'
  const isMobile = useMobile()

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Supabase Platform Kit</h1>
          <p className="text-muted-foreground">
            Manage your Supabase project with an embedded management interface.
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-6 border rounded-lg space-y-4">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Features</h2>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Database Management - Browse tables, run SQL queries, edit rows</li>
                <li>Authentication Settings - Configure auth providers and settings</li>
                <li>Storage Management - View and manage storage buckets</li>
                <li>User Management - Browse and manage users</li>
                <li>Secrets Management - Manage environment variables and secrets</li>
                <li>Logs Viewer - View application logs across services</li>
                <li>AI SQL Generation - Generate SQL queries from natural language</li>
              </ul>
            </div>

            <div className="pt-4">
              <Button onClick={() => setOpen(true)} size="lg">
                Open Supabase Manager
              </Button>
            </div>
          </div>

          <div className="p-6 border rounded-lg bg-muted/50">
            <h3 className="font-semibold mb-2">Project Reference</h3>
            <code className="text-sm bg-background px-2 py-1 rounded">{projectRef}</code>
          </div>
        </div>
      </div>

      <SupabaseManagerDialog
        projectRef={projectRef}
        open={open}
        onOpenChange={setOpen}
        isMobile={isMobile}
      />
    </div>
  )
}
