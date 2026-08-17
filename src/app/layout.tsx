import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Quill — AI Content, On Brand, On Demand",
    template: "%s · Quill",
  },
  description:
    "Quill is a modern, accessible AI content studio for generating, organizing, and reviewing on-brand marketing copy — blog posts, social captions, emails, ad copy, and more.",
  keywords: [
    "AI content generation",
    "SaaS",
    "content studio",
    "marketing copy",
    "AI writing assistant",
    "dashboard",
  ],
  authors: [{ name: "Quill" }],
  openGraph: {
    title: "Quill — AI Content, On Brand, On Demand",
    description:
      "Generate, organize, and review on-brand marketing copy in one streamlined AI content studio.",
    url: siteUrl,
    siteName: "Quill",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quill — AI Content, On Brand, On Demand",
    description:
      "Generate, organize, and review on-brand marketing copy in one streamlined AI content studio.",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1512" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main-content"
          className="bg-primary text-primary-foreground sr-only-focusable fixed top-2 left-2 z-100 rounded-md px-4 py-2 text-sm font-medium"
        >
          Skip to main content
        </a>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
