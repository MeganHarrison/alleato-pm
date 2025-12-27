import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { HeaderProvider } from "@/components/layout/header-context";
import { ProjectProvider } from "@/contexts/project-context";
import { FavoritesProvider } from "@/contexts/favorites-context";
import { ConditionalLayout } from "@/components/layout/conditional-layout";
import { Toaster } from "@/components/ui/sonner"
import { Playfair_Display, Inter } from 'next/font/google'
import { AIChatWidget } from "@/components/chat/ai-chat-widget";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Alleato AI - Project Management",
  description: "Modern construction management platform powered by AI.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased text-foreground" suppressHydrationWarning>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Suspense fallback={null}>
              <ProjectProvider>
                <FavoritesProvider>
                  <HeaderProvider>
                    <ConditionalLayout>
                      {children}
                    </ConditionalLayout>
                  </HeaderProvider>
                </FavoritesProvider>
              </ProjectProvider>
            </Suspense>
          </ThemeProvider>
        </QueryProvider>
        <Toaster />
        <AIChatWidget />
      </body>
    </html>
  );
}
