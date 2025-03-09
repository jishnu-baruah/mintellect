"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import ClientLayout from "./clientLayout"
import OCConnectWrapper from "@/components/OCConnectWrapper"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/header"
import { ocidConfig } from "@/config/ocidConfig"

const inter = Inter({ subsets: ["latin"] })

const updatedOcidConfig = {
  ...ocidConfig,
  opts: {
    ...ocidConfig.opts,
    redirectUri: 'http://localhost:3000/redirect', // Use the actual redirect URI
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} web3-bg min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <OCConnectWrapper opts={updatedOcidConfig.opts} sandboxMode={true}>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Toaster />
            </div>
          </OCConnectWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}