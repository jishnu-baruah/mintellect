"use client"
import { GlassCard } from "@/components/ui/glass-card"
import { RippleButton } from "@/components/ui/ripple-button"
import { Shield, CreditCard } from "lucide-react"

export default function BillingSettings() {
  return (
    <GlassCard>
      <h2 className="text-xl font-bold mb-6">Billing</h2>
      <div className="mb-6">
        <div className="bg-mintellect-primary/10 border border-mintellect-primary rounded-lg p-4 flex items-start gap-4 mb-6">
          <div className="p-2 bg-mintellect-primary/20 rounded-full">
            <Shield className="h-6 w-6 text-mintellect-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-mintellect-primary">Premium Plan</h3>
            <p className="text-sm text-gray-300">Renews on May 15, 2023</p>
            <div className="flex gap-3 mt-2">
              <button className="text-sm text-mintellect-primary hover:underline">Change</button>
              <button className="text-sm text-red-400 hover:underline">Cancel</button>
            </div>
          </div>
        </div>
        <h3 className="font-semibold mb-4">Payment Method</h3>
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-700 rounded">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">•••• 4242</p>
                <p className="text-sm text-gray-400">Expires 12/25</p>
              </div>
            </div>
            <button className="text-sm text-mintellect-primary hover:underline">Edit</button>
          </div>
        </div>
        <button className="text-sm text-mintellect-primary hover:underline">+ Add Payment Method</button>
      </div>
      
      <div className="flex justify-start mt-12">
        <a href="/settings/privacy" className="flex items-center gap-2 px-4 py-1.5 border border-gray-700 rounded-full text-gray-200 hover:bg-gray-800 transition font-normal text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          <span>Privacy</span>
        </a>
      </div>
    </GlassCard>
  )
} 