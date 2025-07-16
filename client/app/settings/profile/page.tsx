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
      {tabs.map((tab, idx) => {
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

export default function ProfileSettings() {
  return (
    <>
      <SettingsTabBar />
      <GlassCard>
        <h2 className="text-xl font-bold mb-6">Profile</h2>
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-mintellect-primary/20 flex items-center justify-center text-mintellect-primary text-3xl font-bold">A</div>
              <button className="absolute bottom-0 right-0 bg-mintellect-primary text-white p-1 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
              </button>
            </div>
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input type="text" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mintellect-primary" placeholder="Enter first name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input type="text" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mintellect-primary" placeholder="Enter last name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mintellect-primary" placeholder="Enter email" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Institution</label>
                <input type="text" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mintellect-primary" placeholder="Enter institution" />
              </div>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mintellect-primary min-h-[100px]" placeholder="Brief professional description" />
        </div>
        <div className="flex justify-end">
          <RippleButton>Save</RippleButton>
        </div>
        <div className="flex justify-end mt-12">
          <a href="/settings/security" className="flex items-center gap-2 px-4 py-1.5 border border-gray-700 rounded-full text-gray-200 hover:bg-gray-800 transition font-normal text-sm">
            <span>Security</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </a>
        </div>
      </GlassCard>
    </>
  )
} 