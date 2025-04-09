import type React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar className="hidden md:flex" />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Background elements */}
        <div className="fixed inset-0 -z-10 pointer-events-none">
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

          {/* Gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-mintellect-primary/5 rounded-full filter blur-[80px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-mintellect-secondary/5 rounded-full filter blur-[80px]"></div>
        </div>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto hide-scrollbar">{children}</main>
      </div>
    </div>
  )
}
