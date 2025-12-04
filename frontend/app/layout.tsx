import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { HeaderProvider } from "@/components/layout/header-context";
import { SiteHeader } from "@/components/site-header"

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Alleato OS - Procore Alternative",
  description: "Modern construction management platform - 80% of Procore's value at 10% of the cost",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <HeaderProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
              <SiteHeader />
              <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </div>
              </SidebarInset>
            </SidebarProvider>
          </HeaderProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
