"use client"
import { GlassCard } from "@/components/ui/glass-card"
import { RippleButton } from "@/components/ui/ripple-button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Lock, Bell, Shield, CreditCard } from "lucide-react"

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

export default function SecuritySettings() {
  return (
    <>
      <SettingsTabBar />
      <GlassCard>
        <h2 className="text-xl font-bold mb-6">Security</h2>
        <div className="mb-6">
          <h3 className="font-semibold mb-4">Password</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Current Password</label>
              <input type="password" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mintellect-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <input type="password" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mintellect-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirm New Password</label>
              <input type="password" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mintellect-primary" />
            </div>
          </div>
          <div className="mt-4">
            <RippleButton>Update</RippleButton>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6 mb-6">
          <h3 className="font-semibold mb-4">Two-Factor Authentication</h3>
          <div className="flex items-center justify-between">
            <p>Protect your account with 2FA</p>
            <div className="flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-mintellect-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mintellect-primary"></div>
              </label>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6">
          <h3 className="font-semibold mb-4">Active Sessions</h3>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">Current Session</p>
                <p className="text-sm text-gray-400">Chrome • Started recently</p>
              </div>
              <span className="px-2 py-1 bg-green-400/10 text-green-400 text-xs rounded-full">Active</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-12">
          <a href="/settings/profile" className="flex items-center gap-2 px-4 py-1.5 border border-gray-700 rounded-full text-gray-200 hover:bg-gray-800 transition font-normal text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            <span>Profile</span>
          </a>
          <a href="/settings/notifications" className="flex items-center gap-2 px-4 py-1.5 border border-gray-700 rounded-full text-gray-200 hover:bg-gray-800 transition font-normal text-sm">
            <span>Notifications</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </a>
        </div>
      </GlassCard>
    </>
  )
} 