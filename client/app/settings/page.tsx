"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { RippleButton } from "@/components/ui/ripple-button"
import { User, Lock, Bell, Shield, CreditCard } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/settings/profile");
  }, [router]);
  return null;
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
