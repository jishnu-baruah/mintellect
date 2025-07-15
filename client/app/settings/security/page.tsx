"use client"
import { GlassCard } from "@/components/ui/glass-card"
import { RippleButton } from "@/components/ui/ripple-button"

export default function SecuritySettings() {
  return (
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
    </GlassCard>
  )
} 