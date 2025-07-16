import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { WalletProvider } from "@/components/wallet-provider"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mintellect - AI-Powered Academic Integrity Platform",
  description: "Verify, improve, and certify your academic work with Mintellect's AI-powered platform.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="fixed inset-0 z-0 scale-[0.8] origin-top-left w-[125vw] h-[125vh] overflow-auto">
            <WalletProvider>
              <div className="flex h-[125vh] bg-black overflow-hidden">
                <DashboardSidebar className="hidden md:flex" />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="fixed inset-0 -z-10 pointer-events-none">
                    <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-mintellect-primary/5 rounded-full filter blur-[80px]"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-mintellect-secondary/5 rounded-full filter blur-[80px]"></div>
                  </div>
                  <main className="flex-1 overflow-y-auto hide-scrollbar">{children}</main>
                </div>
              </div>
            </WalletProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}