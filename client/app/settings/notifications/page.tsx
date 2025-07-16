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

function NotificationOption({ title, defaultChecked = false }: { title: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <p className="font-medium">{title}</p>
      <div className="flex items-center">
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-mintellect-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mintellect-primary"></div>
        </label>
      </div>
    </div>
  )
}

export default function NotificationsSettings() {
  return (
    <>
      <SettingsTabBar />
      <GlassCard>
        <h2 className="text-xl font-bold mb-6">Notifications</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-4">Email Notifications</h3>
            <div className="space-y-3">
              <NotificationOption title="Document Analysis" defaultChecked={true} />
              <NotificationOption title="Human Review Updates" defaultChecked={true} />
              <NotificationOption title="New Features" defaultChecked={false} />
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">In-App Notifications</h3>
            <div className="space-y-3">
              <NotificationOption title="Document Status" defaultChecked={true} />
              <NotificationOption title="Comments and Feedback" defaultChecked={true} />
              <NotificationOption title="Trust Score Updates" defaultChecked={true} />
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <RippleButton>Save</RippleButton>
        </div>
      </GlassCard>
    </>
  )
} 