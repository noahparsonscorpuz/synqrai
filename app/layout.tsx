import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "synqr.ai",
  description: "AI-powered scheduling platform for medical professionals with thermal heatmap interface",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/synqr-icon-512-transparent.png" type="image/png" />
        <link rel="apple-touch-icon" href="/synqr-icon-512-transparent.png" />
      </head>
      <body className="font-sans antialiased" style={{ fontFamily: '"Geist", "Geist Mono", sans-serif' }}>
        <Suspense fallback={null}>
          {children}
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
