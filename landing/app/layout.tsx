import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import OCConnectWrapper from "@/components/OCConnectWrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mintellect - AI-Powered Academic Integrity Platform",
  description: "Verify, improve, and certify your academic work with Mintellect's AI-powered platform.",
  generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const isSandboxMode = process.env.NODE_ENV !== 'production';
  
  const opts = {
    clientId: process.env.NEXT_PUBLIC_OCID_CLIENT_ID,
    redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/redirect`,
    referralCode: 'PARTNER6'
  };

  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <OCConnectWrapper opts={opts} sandboxMode={isSandboxMode}>
            {children}
          </OCConnectWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'