// Force all auth routes to be dynamically rendered to avoid SSR issues
export const dynamic = 'force-dynamic'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Auth pages inherit SessionProvider and ThemeProvider from root layout
  // Just wrap in minimal container
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}
