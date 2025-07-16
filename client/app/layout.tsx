import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { WalletProvider } from "@/components/wallet-provider"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { usePathname } from "next/navigation"
import { AnimatedLogo } from "@/components/ui/animated-logo"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mintellect - AI-Powered Academic Integrity Platform",
  description: "Verify, improve, and certify your academic work with Mintellect's AI-powered platform.",
   
}

// Toggle this to enable/disable maintenance mode
const MAINTENANCE_MODE = true;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/images/Mintellect_logo.png" type="image/png" />
        <title>Mintellect - AI-Powered Academic Integrity Platform</title>
        <meta name="description" content="Verify, improve, and certify your academic work with Mintellect's AI-powered platform." />
        <meta property="og:title" content="Mintellect - AI-Powered Academic Integrity Platform" />
        <meta property="og:description" content="Verify, improve, and certify your academic work with Mintellect's AI-powered platform." />
        <meta property="og:image" content="/images/Mintellect_logo.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mintellect - AI-Powered Academic Integrity Platform" />
        <meta name="twitter:description" content="Verify, improve, and certify your academic work with Mintellect's AI-powered platform." />
        <meta name="twitter:image" content="/images/Mintellect_logo.png" />
      </head>
      <body className={inter.className}>
        {MAINTENANCE_MODE ? (
          <div className="min-h-screen flex flex-col items-center justify-center bg-black text-foreground text-center px-4">
            <div className="mb-4 flex flex-col items-center">
              <AnimatedLogo className="w-20 h-20 mb-2" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">Mintellect is under development</h1>
            <p className="mb-2 text-lg font-normal text-gray-200">We're working hard to bring you the new Mintellect experience.<br />Please check back soon!</p>
            <p className="mb-6 text-base text-muted-foreground">For updates and early access, join our communities:</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
              <a href="https://t.me/mintellect_community" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-base font-semibold border border-blue-500/30 bg-blue-900/30 text-blue-300 hover:bg-blue-900/50 hover:text-blue-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 shadow-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: 'translate(1px, 4px)' }}><path d="M21.05 2.927a2.25 2.25 0 0 0-2.37-.37L3.36 9.37c-1.49.522-1.471 1.27-.254 1.611l4.624 1.444 10.74-6.77c.505-.327.968-.146.588.181l-8.2 7.01 3.36 2.45 2.676-2.56 5.547 4.047c1.016.561 1.74.266 1.992-.941l3.613-16.84c.33-1.527-.553-2.127-1.54-1.792z" stroke="currentColor" fill="none"/></svg>
                Telegram
              </a>
              <a href="https://x.com/_Mintellect_" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-base font-semibold border border-gray-700/30 bg-gray-900/30 text-gray-200 hover:bg-gray-900/50 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500/40 focus-visible:ring-offset-2 shadow-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.53 3H21.5l-7.19 8.21L22.44 21h-6.63l-5.24-6.61L4.47 21H0.5l7.61-8.7L1.56 3h6.63l4.88 6.16L17.53 3zm-1.13 15.19h1.84L7.08 4.13H5.13l11.27 14.06z"/></svg>
                Twitter
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Thank you for your patience and support!</p>
          </div>
        ) : (
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <div className="fixed inset-0 z-0 scale-[0.8] origin-top-left w-[125vw] h-[125vh] overflow-auto">
              <WalletProvider>
                <div className="flex h-[125vh] bg-black overflow-hidden">
                  <DashboardSidebar />
                  <div className="flex-1 flex flex-col overflow-hidden ml-16 md:ml-0">
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
        )}
      </body>
    </html>
  )
}