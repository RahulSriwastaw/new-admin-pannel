"use client"
import { useEffect, useState } from "react"
import { adminAnalyticsApi } from "@/services/api"

type Stats = {
  totalUsers: number
  totalTemplates: number
  activeCreators: number
  totalRevenue: number
  pendingApprovals: number
  supportTickets: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [revenue, setRevenue] = useState<{date: string, amount: number}[]>([])
  const [userGrowth, setUserGrowth] = useState<{date: string, count: number}[]>([])

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (!token) {
      window.location.href = "/login"
      return
    }
    adminAnalyticsApi.dashboard().then(setStats).catch((e) => setError(e?.message || "Failed to load stats"))
    adminAnalyticsApi.revenue('monthly').then(setRevenue).catch(() => {})
    adminAnalyticsApi.users('monthly').then(setUserGrowth).catch(() => {})
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      {error && <p className="text-red-400">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Users" value={stats?.totalUsers ?? 0} />
        <Card title="Templates" value={stats?.totalTemplates ?? 0} />
        <Card title="Active Creators" value={stats?.activeCreators ?? 0} />
        <Card title="Pending Approvals" value={stats?.pendingApprovals ?? 0} />
        <Card title="Support Tickets" value={stats?.supportTickets ?? 0} />
        <Card title="Total Revenue" value={`₹${(stats?.totalRevenue ?? 0).toLocaleString()}` as any} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title="Monthly Revenue" series={revenue.map(r => ({ label: r.date, value: r.amount }))} />
        <ChartCard title="User Growth" series={userGrowth.map(u => ({ label: u.date, value: u.count }))} />
      </div>
    </div>
  )
}

function Card({ title, value }: { title: string, value: number | string }) {
  return (
    <div className="card p-4">
      <div className="text-sm opacity-70">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  )
}

function ChartCard({ title, series }: { title: string, series: { label: string, value: number }[] }) {
  return (
    <div className="card p-4">
      <div className="font-semibold mb-2">{title}</div>
      <div className="text-xs grid grid-cols-2 gap-1">
        {series.slice(0, 10).map((s) => (
          <div key={s.label} className="flex justify-between">
            <span className="opacity-70">{s.label}</span>
            <span>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}