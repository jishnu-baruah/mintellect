"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/header"
import { OCConnect, LoginCallBack } from "@opencampus/ocid-connect-js"

const inter = Inter({ subsets: ["latin"] })

const loginSuccess = () => {
  console.log("Login successful!")
}

const loginError = () => {
  console.error("Login failed!")
}

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} web3-bg min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <OCConnect
            opts={{
              redirectUri: "https://symmetrical-space-guacamole-rjg6px4675xcxjr4-3000.app.github.dev/redirect",
              referralCode: "PARTNER6",
            }}
            sandboxMode={true}
          >
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Toaster />
            </div>
          </OCConnect>
          <LoginCallBack
            errorCallback={loginError}
            successCallback={loginSuccess}
            customErrorComponent={<div>Error occurred during login.</div>}
            customLoadingComponent={<div>Loading...</div>}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
