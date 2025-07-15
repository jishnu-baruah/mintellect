"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { RippleButton } from "@/components/ui/ripple-button"
import { User, Lock, Bell, Shield, CreditCard } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const pathname = usePathname();

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="sticky top-6">
            <nav className="space-y-1">
              <button
                className={`flex items-center gap-2 px-4 py-3 rounded-xl w-full text-base font-medium transition-colors ${activeTab === "profile" ? "bg-mintellect-primary/10 text-mintellect-primary" : "text-gray-400 hover:bg-[#23262F] hover:text-white"}`}
                onClick={() => setActiveTab("profile")}
              >
                <User className="h-5 w-5" />
                Profile
              </button>
              <button
                className={`flex items-center gap-2 px-4 py-3 rounded-xl w-full text-base font-medium transition-colors ${activeTab === "security" ? "bg-mintellect-primary/10 text-mintellect-primary" : "text-gray-400 hover:bg-[#23262F] hover:text-white"}`}
                onClick={() => setActiveTab("security")}
              >
                <Lock className="h-5 w-5" />
                Security
              </button>
              <button
                className={`flex items-center gap-2 px-4 py-3 rounded-xl w-full text-base font-medium transition-colors ${activeTab === "notifications" ? "bg-mintellect-primary/10 text-mintellect-primary" : "text-gray-400 hover:bg-[#23262F] hover:text-white"}`}
                onClick={() => setActiveTab("notifications")}
              >
                <Bell className="h-5 w-5" />
                Notifications
              </button>
              <button
                className={`flex items-center gap-2 px-4 py-3 rounded-xl w-full text-base font-medium transition-colors ${activeTab === "privacy" ? "bg-mintellect-primary/10 text-mintellect-primary" : "text-gray-400 hover:bg-[#23262F] hover:text-white"}`}
                onClick={() => setActiveTab("privacy")}
              >
                <Shield className="h-5 w-5" />
                Privacy
              </button>
              <button
                className={`flex items-center gap-2 px-4 py-3 rounded-xl w-full text-base font-medium transition-colors ${activeTab === "billing" ? "bg-mintellect-primary/10 text-mintellect-primary" : "text-gray-400 hover:bg-[#23262F] hover:text-white"}`}
                onClick={() => setActiveTab("billing")}
              >
                <CreditCard className="h-5 w-5" />
                Billing
              </button>
            </nav>
          </div>
        </div>

        <div className="md:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "profile" && (
              <GlassCard>
                <h2 className="text-xl font-bold mb-6">Profile</h2>

                <div className="flex flex-col md:flex-row gap-6 mb-6">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-mintellect-primary/20 flex items-center justify-center text-mintellect-primary text-3xl font-bold">
                        A
                      </div>
                      <button className="absolute bottom-0 right-0 bg-mintellect-primary text-white p-1 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-pencil"
                        >
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          <path d="m15 5 4 4" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">First Name</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mintellect-primary"
                          placeholder="Enter first name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Last Name</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mintellect-primary"
                          placeholder="Enter last name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                          type="email"
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mintellect-primary"
                          placeholder="Enter email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Institution</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mintellect-primary"
                          placeholder="Enter institution"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <textarea
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mintellect-primary min-h-[100px]"
                    placeholder="Brief professional description"
                  />
                </div>

                <div className="flex justify-end">
                  <RippleButton>Save</RippleButton>
                </div>
              </GlassCard>
            )}

            {activeTab === "security" && (
              <GlassCard>
                <h2 className="text-xl font-bold mb-6">Security</h2>

                <div className="mb-6">
                  <h3 className="font-semibold mb-4">Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Current Password</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mintellect-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">New Password</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mintellect-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mintellect-primary"
                      />
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
            )}

            {activeTab === "notifications" && (
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
            )}

            {activeTab === "privacy" && (
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
                        <RippleButton variant="outline" size="sm">
                          Export Data
                        </RippleButton>
                      </div>
                      <div>
                        <p className="mb-2">Delete Account</p>
                        <RippleButton
                          variant="outline"
                          size="sm"
                          className="border-red-500 text-red-500 hover:bg-red-500/10"
                        >
                          Delete Account
                        </RippleButton>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            )}

            {activeTab === "billing" && (
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

                <div className="mb-6">
                  <h3 className="font-semibold mb-4">Billing History</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Date</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Description</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Amount</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">Receipt</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-800">
                          <td className="px-4 py-3 text-sm">Apr 15, 2023</td>
                          <td className="px-4 py-3 text-sm">Premium Plan</td>
                          <td className="px-4 py-3 text-sm">$9.99</td>
                          <td className="px-4 py-3 text-right">
                            <button className="text-sm text-mintellect-primary hover:underline">Download</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </GlassCard>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

interface SettingsNavItemProps {
  icon: React.ElementType
  title: string
  isActive: boolean
  onClick: () => void
}

function SettingsNavItem({ icon: Icon, title, isActive, onClick }: SettingsNavItemProps) {
  return (
    <button
      className={`flex items-center w-full px-3 py-2 rounded-md transition-colors ${
        isActive
          ? "bg-mintellect-primary/10 text-mintellect-primary"
          : "text-gray-400 hover:bg-gray-800 hover:text-white"
      }`}
      onClick={onClick}
    >
      <Icon className={`h-5 w-5 mr-2 ${isActive ? "text-mintellect-primary" : ""}`} />
      <span>{title}</span>
    </button>
  )
}

interface NotificationOptionProps {
  title: string
  defaultChecked?: boolean
}

function NotificationOption({ title, defaultChecked = false }: NotificationOptionProps) {
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

interface PrivacyOptionProps {
  title: string
  defaultChecked?: boolean
}

function PrivacyOption({ title, defaultChecked = false }: PrivacyOptionProps) {
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
