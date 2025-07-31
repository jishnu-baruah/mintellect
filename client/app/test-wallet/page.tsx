"use client"

import { WalletTest } from "@/components/wallet-test"

export default function TestWalletPage() {
  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Wallet Connection Test</h1>
        <WalletTest />
      </div>
    </div>
  )
} 