import type React from "react";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "AI Business Strategist",
  description: "An interface for agent orchestration",
  icons: {
    icon: "/openai_logo.svg",
  },
};

export default function ChatRagLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Script
        src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
        strategy="beforeInteractive"
      />
      {children}
    </>
  );
}
