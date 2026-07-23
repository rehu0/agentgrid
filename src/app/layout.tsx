import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgentGrid — Hire AI Agents. Ship in Minutes.",
  description:
    "The world's first multi-agent orchestration marketplace. Describe your goal in plain English — AgentGrid assembles the right AI agents and runs the workflow end-to-end.",
  keywords: [
    "AI agents",
    "agent marketplace",
    "multi-agent orchestration",
    "AI workflow",
    "automation",
    "Next.js",
    "AgentGrid",
  ],
  authors: [{ name: "AgentGrid" }],
  openGraph: {
    title: "AgentGrid — Hire AI Agents. Ship in Minutes.",
    description:
      "Describe your goal. AI assembles the perfect agent team and runs it end-to-end.",
    siteName: "AgentGrid",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgentGrid",
    description:
      "The world's first multi-agent orchestration marketplace.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
