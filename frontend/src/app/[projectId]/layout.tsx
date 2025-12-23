export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto w-full max-w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-x-hidden">
      {children}
    </div>
  )
}
