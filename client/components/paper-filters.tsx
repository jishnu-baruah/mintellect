"use client"

import { Filter, TrendingUp, Calendar, Eye, Award, Lock, Unlock } from "lucide-react"
import { GlassCard } from "./ui/glass-card"

interface PaperFiltersProps {
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
  showPremiumOnly: boolean
  onPremiumChange: (showPremium: boolean) => void
  sortBy: string
  onSortChange: (sortBy: string) => void
}

const CATEGORIES = [
  "Blockchain Technology",
  "Blockchain Economics",
  "Digital Assets",
  "Cryptography",
  "Smart Contracts",
  "Governance",
]

export function PaperFilters({
  selectedCategory,
  onCategoryChange,
  showPremiumOnly,
  onPremiumChange,
  sortBy,
  onSortChange,
}: PaperFiltersProps) {
  return (
    <GlassCard className="p-5">
      <div className="flex items-center gap-2 mb-5">
        <Filter className="h-5 w-5 text-mintellect-primary" />
        <h3 className="font-bold">Filters</h3>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium mb-3">Categories</h4>
        <div className="space-y-1.5">
          <button
            className={`w-full text-left py-2 px-3 rounded text-sm ${selectedCategory === null ? "bg-mintellect-primary/20 text-mintellect-primary" : "hover:bg-gray-800 text-gray-400"}`}
            onClick={() => onCategoryChange(null)}
          >
            All Categories
          </button>

          {CATEGORIES.map((category) => (
            <button
              key={category}
              className={`w-full text-left py-2 px-3 rounded text-sm ${selectedCategory === category ? "bg-mintellect-primary/20 text-mintellect-primary" : "hover:bg-gray-800 text-gray-400"}`}
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium mb-3">Access</h4>
        <label className="flex items-center justify-between w-full p-3 rounded hover:bg-gray-800 cursor-pointer">
          <div className="flex items-center gap-2">
            {showPremiumOnly ? (
              <Lock className="h-4 w-4 text-yellow-500" />
            ) : (
              <Unlock className="h-4 w-4 text-gray-400" />
            )}
            <span className={showPremiumOnly ? "text-yellow-500" : "text-gray-400"}>Premium Only</span>
          </div>
          <div className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={showPremiumOnly}
              onChange={(e) => onPremiumChange(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-mintellect-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
          </div>
        </label>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3">Sort By</h4>
        <div className="space-y-1.5">
          <button
            className={`w-full text-left py-2 px-3 rounded text-sm flex items-center gap-2 ${sortBy === "date" ? "bg-mintellect-primary/20 text-mintellect-primary" : "hover:bg-gray-800 text-gray-400"}`}
            onClick={() => onSortChange("date")}
          >
            <Calendar className="h-4 w-4" />
            <span>Latest</span>
          </button>

          <button
            className={`w-full text-left py-2 px-3 rounded text-sm flex items-center gap-2 ${sortBy === "views" ? "bg-mintellect-primary/20 text-mintellect-primary" : "hover:bg-gray-800 text-gray-400"}`}
            onClick={() => onSortChange("views")}
          >
            <Eye className="h-4 w-4" />
            <span>Most Viewed</span>
          </button>

          <button
            className={`w-full text-left py-2 px-3 rounded text-sm flex items-center gap-2 ${sortBy === "citations" ? "bg-mintellect-primary/20 text-mintellect-primary" : "hover:bg-gray-800 text-gray-400"}`}
            onClick={() => onSortChange("citations")}
          >
            <TrendingUp className="h-4 w-4" />
            <span>Most Cited</span>
          </button>

          <button
            className={`w-full text-left py-2 px-3 rounded text-sm flex items-center gap-2 ${sortBy === "trust" ? "bg-mintellect-primary/20 text-mintellect-primary" : "hover:bg-gray-800 text-gray-400"}`}
            onClick={() => onSortChange("trust")}
          >
            <Award className="h-4 w-4" />
            <span>Trust Score</span>
          </button>
        </div>
      </div>
    </GlassCard>
  )
}
