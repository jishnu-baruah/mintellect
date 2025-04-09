"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { RippleButton } from "@/components/ui/ripple-button"
import { GlassCard } from "@/components/ui/glass-card"
import { Download, Calendar, Filter, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"
import Link from "next/link"

// Sample data for charts
const monthlyData = [
  { name: "Jan", papers: 65, certificates: 40 },
  { name: "Feb", papers: 59, certificates: 45 },
  { name: "Mar", papers: 80, certificates: 55 },
  { name: "Apr", papers: 81, certificates: 60 },
  { name: "May", papers: 56, certificates: 58 },
  { name: "Jun", papers: 55, certificates: 62 },
  { name: "Jul", papers: 40, certificates: 65 },
]

const categoryData = [
  { name: "Computer Science", value: 400 },
  { name: "Engineering", value: 300 },
  { name: "Medicine", value: 200 },
  { name: "Physics", value: 150 },
  { name: "Biology", value: 100 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

const scoreDistribution = [
  { name: "90-100", count: 15 },
  { name: "80-89", count: 25 },
  { name: "70-79", count: 30 },
  { name: "60-69", count: 20 },
  { name: "Below 60", count: 10 },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("This Month")

  // Custom tooltip for the line chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 p-3 border border-gray-800 rounded-lg shadow-lg">
          <p className="font-medium text-white">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div>
      <div className="mb-4">
        <Breadcrumb />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <RippleButton variant="outline" className="w-full sm:w-auto">
              Back to Dashboard
            </RippleButton>
          </Link>
          <RippleButton className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export
          </RippleButton>
        </div>
      </div>

      {/* Filter controls */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
          <Calendar className="h-4 w-4 text-gray-400" />
          <select
            className="bg-transparent border-none text-sm focus:outline-none"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option>This Week</option>
            <option>This Month</option>
            <option>This Quarter</option>
            <option>This Year</option>
            <option>All Time</option>
          </select>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700 text-sm">
          <Filter className="h-4 w-4 text-gray-400" />
          More Filters
        </button>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Papers" value="1,284" change="+12.5%" isPositive={true} period="vs last month" />
        <StatCard title="Certificates Issued" value="856" change="+8.2%" isPositive={true} period="vs last month" />
        <StatCard title="Avg. Trust Score" value="87.3" change="+2.1%" isPositive={true} period="vs last month" />
        <StatCard title="Rejection Rate" value="4.7%" change="-1.2%" isPositive={true} period="vs last month" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Activity Over Time */}
        <GlassCard className="bg-black/70 border-gray-800/50">
          <h2 className="text-lg font-bold mb-4">Activity Over Time</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="papers" stroke="#00C49F" strokeWidth={2} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="certificates" stroke="#0088FE" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Research Categories */}
        <GlassCard className="bg-black/70 border-gray-800/50">
          <h2 className="text-lg font-bold mb-4">Research Categories</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Additional charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trust Score Distribution */}
        <GlassCard className="bg-black/70 border-gray-800/50">
          <h2 className="text-lg font-bold mb-4">Trust Score Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreDistribution} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#8884d8">
                  {scoreDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Recent Activity */}
        <GlassCard className="bg-black/70 border-gray-800/50">
          <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <ActivityItem
              title="Research Paper Verified"
              description="AI Ethics in Modern Society"
              time="2 hours ago"
              score={92}
            />
            <ActivityItem
              title="Certificate Issued"
              description="Quantum Computing Fundamentals"
              time="5 hours ago"
              score={88}
            />
            <ActivityItem
              title="Paper Rejected"
              description="Climate Change Analysis"
              time="Yesterday"
              score={45}
              isRejected
            />
            <ActivityItem
              title="Research Paper Verified"
              description="Machine Learning Applications"
              time="2 days ago"
              score={95}
            />
          </div>
          <div className="mt-4 text-center">
            <button className="text-mintellect-primary hover:underline text-sm">View All Activity</button>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({
  title,
  value,
  change,
  isPositive,
  period,
}: {
  title: string
  value: string
  change: string
  isPositive: boolean
  period: string
}) {
  return (
    <GlassCard className="bg-black/70 border-gray-800/50">
      <h3 className="text-sm text-gray-400 mb-1">{title}</h3>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold">{value}</p>
        <div className={`flex items-center text-xs ${isPositive ? "text-green-400" : "text-red-400"}`}>
          {isPositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
          {change}
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-1">{period}</p>
    </GlassCard>
  )
}

// Activity Item Component
function ActivityItem({
  title,
  description,
  time,
  score,
  isRejected = false,
}: {
  title: string
  description: string
  time: string
  score: number
  isRejected?: boolean
}) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-400">{description}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
      {isRejected ? (
        <div className="px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs font-medium">Rejected</div>
      ) : (
        <div className={`text-lg font-bold ${getScoreColor(score)}`}>{score}</div>
      )}
    </div>
  )
}
