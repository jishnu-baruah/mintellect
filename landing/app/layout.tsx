import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import OCConnectWrapper from "@/components/OCConnectWrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mintellect",
  description: "Mintellect - Your AI Learning Platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const opts = {
    redirectUri: 'https://www.mintellect.xyz/redirect',
    referralCode: 'PARTNER6'
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <OCConnectWrapper opts={opts} sandboxMode={true}>
          {children}
        </OCConnectWrapper>
      </body>
    </html>
  )
}



import './globals.css'