import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { HeaderProvider } from "@/components/layout/header-context";
import { ProjectProvider } from "@/contexts/project-context";
import { SiteHeader } from "@/components/site-header"
import { Toaster } from "@/components/ui/sonner"
import { Playfair_Display, Inter } from 'next/font/google'

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
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
  title: "Alleato OS - Procore Alternative",
  description: "Modern construction management platform - 80% of Procore's value at 10% of the cost",
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
                <HeaderProvider>
                  <SidebarProvider defaultOpen={false}>
                    <AppSidebar />
                    <SidebarInset>
                      <SiteHeader />
                      <div className="bg-neutral-50 flex-1 w-full px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-20">
                        {children}
                      </div>
                    </SidebarInset>
                  </SidebarProvider>
                </HeaderProvider>
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
