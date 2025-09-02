"use client"
import { GlassCard } from "@/components/ui/glass-card"
import { RippleButton } from "@/components/ui/ripple-button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Lock, Bell, Shield, CreditCard, Star } from "lucide-react"

function SettingsTabBar() {
  const pathname = usePathname();
  const tabs = [
    { href: "/settings/profile", label: "Profile", icon: User },
    { href: "/settings/security", label: "Security", icon: Lock },
    { href: "/settings/notifications", label: "Notifications", icon: Bell },
    { href: "/settings/privacy", label: "Privacy", icon: Shield },
    { href: "/settings/billing", label: "Billing", icon: CreditCard },
  ];
  return (
    <nav className="flex w-full overflow-x-auto bg-gradient-to-r from-black/90 to-gray-900/80 px-2 py-2 gap-0 sticky top-0 z-30 rounded-b-xl shadow-sm">
      {tabs.map(tab => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={
              "flex flex-col items-center justify-center px-4 py-2 min-w-[72px] text-xs font-medium rounded-xl transition-all duration-200 " +
              (active
                ? "bg-mintellect-primary/10 text-mintellect-primary shadow"
                : "text-gray-400 hover:text-white hover:bg-gray-800/60")
            }
            scroll={false}
          >
            <tab.icon className={"h-5 w-5 mb-0.5 " + (active ? "text-mintellect-primary" : "")} />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function BillingSettings() {
  return (
    <>
      <SettingsTabBar />
      <GlassCard>
        <h2 className="text-xl font-bold mb-6">Billing</h2>
        
        <div className="mb-6">
          <div className="bg-green-500/10 border border-green-500 rounded-lg p-6 flex items-start gap-4">
            <div className="p-3 bg-green-500/20 rounded-full">
              <Star className="h-6 w-6 text-green-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-green-500 text-lg">Free Beta Plan</h3>
              <p className="text-sm text-gray-300 mb-2">You're currently on our free beta plan</p>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <h4 className="font-medium text-white mb-2">What's Included:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Unlimited document uploads</li>
                  <li>• Plagiarism detection</li>
                  <li>• Trust score analysis</li>
                  <li>• NFT minting</li>
                  <li>• Full access to all features</li>
                </ul>
              </div>
              <div className="mt-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                  No Payment Required
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-start mt-12">
          <a href="/settings/privacy" className="flex items-center gap-2 px-4 py-1.5 border border-gray-700 rounded-full text-gray-200 hover:bg-gray-800 transition font-normal text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            <span>Privacy</span>
          </a>
        </div>
      </GlassCard>
    </>
  )
} 