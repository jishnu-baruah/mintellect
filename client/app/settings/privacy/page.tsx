"use client"
import { GlassCard } from "@/components/ui/glass-card"
import { RippleButton } from "@/components/ui/ripple-button"

function PrivacyOption({ title, defaultChecked = false }: { title: string; defaultChecked?: boolean }) {
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

export default function PrivacySettings() {
  return (
    <GlassCard>
      <h2 className="text-xl font-bold mb-6">Privacy</h2>
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-4">Data Sharing</h3>
          <div className="space-y-3">
            <PrivacyOption title="Share Analytics Data" defaultChecked={true} />
            <PrivacyOption title="Contribute to Research" defaultChecked={false} />
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Profile Visibility</h3>
          <div className="space-y-3">
            <PrivacyOption title="Public Profile" defaultChecked={false} />
            <PrivacyOption title="Show Trust Score" defaultChecked={false} />
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6">
          <h3 className="font-semibold mb-4">Data Management</h3>
          <div className="space-y-4">
            <div>
              <p className="mb-2">Download Your Data</p>
              <RippleButton variant="outline" size="sm">Export Data</RippleButton>
            </div>
            <div>
              <p className="mb-2">Delete Account</p>
              <RippleButton variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-500/10">Delete Account</RippleButton>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  )
} 