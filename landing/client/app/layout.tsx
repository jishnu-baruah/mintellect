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
import { LoginCallBack } from "@opencampus/ocid-connect-js";
import { usePathname } from "next/navigation"; // Use `usePathname` instead of `useRouter`
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] })



const loginSuccess = () => {
  console.log("Login successful!");
};

const loginError = () => {
  console.error("Login failed!");
};

function CustomErrorComponent() {
  return <div>Error Logging in: Something went wrong!</div>;
}

function CustomLoadingComponent() {
  return <div>Loading...</div>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname(); // Get the current pathname

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} web3-bg min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <OCConnectWrapper opts={ocidConfig.opts} sandboxMode={true}>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Toaster />
            </div>
          </OCConnectWrapper>
          {pathname === "/redirect" && (
            <LoginCallBack
              customErrorComponent={CustomErrorComponent}
              customLoadingComponent={CustomLoadingComponent}
              successCallback={loginSuccess}
              errorCallback={loginError}
            />
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}