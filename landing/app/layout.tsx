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
      <head>
        <link rel="icon" href="/images/Mintellect_logo.png" type="image/png" />
        <title>Mintellect - Your AI Learning Platform</title>
        <meta name="description" content="Mintellect - Your AI Learning Platform" />
        <meta property="og:title" content="Mintellect - Your AI Learning Platform" />
        <meta property="og:description" content="Mintellect - Your AI Learning Platform" />
        <meta property="og:image" content="/images/Mintellect_logo.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mintellect - Your AI Learning Platform" />
        <meta name="twitter:description" content="Mintellect - Your AI Learning Platform" />
        <meta name="twitter:image" content="/images/Mintellect_logo.png" />
      </head>
      <body className={inter.className}>
        <OCConnectWrapper opts={opts} sandboxMode={true}>
          {children}
        </OCConnectWrapper>
      </body>
    </html>
  )
}



import './globals.css'