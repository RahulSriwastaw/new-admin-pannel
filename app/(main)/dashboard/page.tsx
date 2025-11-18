"use client"
import { useState } from "react"

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
  
  // Mock data for the dashboard
  const stats = {
    totalUsers: 12482,
    monthlyGenerations: 86420,
    monthlyRevenue: 245600,
    activeTemplates: 1847
  }

  const userGrowthData = [
    { day: '1', value: 12000 },
    { day: '5', value: 12200 },
    { day: '10', value: 12500 },
    { day: '15', value: 12800 },
    { day: '20', value: 13200 },
    { day: '25', value: 13800 },
    { day: '30', value: 14500 }
  ]

  const generationData = [
    { name: 'Portrait', value: 35 },
    { name: 'Landscape', value: 25 },
    { name: 'Square', value: 20 },
    { name: 'Other', value: 20 }
  ]

  return (
    // Main container with dark green background
    <div className="min-h-screen bg-[#0D221A] text-[#E9F5EE] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Admin</h1>
          <p className="text-[#A0C4B5]">Here's what's happening with your platform today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Users" 
            value={stats.totalUsers.toLocaleString()} 
            change="+12.4%" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
          <StatCard 
            title="Monthly Generations" 
            value={stats.monthlyGenerations.toLocaleString()} 
            change="+18.2%" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
          <StatCard 
            title="Monthly Revenue" 
            value={`₹${stats.monthlyRevenue.toLocaleString()}`} 
            change="+24.7%" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard 
            title="Active Templates" 
            value={stats.activeTemplates.toLocaleString()} 
            change="+8.3%" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Chart */}
          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">User Growth</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setTimeRange('7d')}
                  className={`px-3 py-1 text-sm rounded-lg ${timeRange === '7d' ? 'bg-[#4EFF9B] text-[#0D221A]' : 'bg-[#112C23] text-[#A0C4B5]'}`}
                >
                  7D
                </button>
                <button 
                  onClick={() => setTimeRange('30d')}
                  className={`px-3 py-1 text-sm rounded-lg ${timeRange === '30d' ? 'bg-[#4EFF9B] text-[#0D221A]' : 'bg-[#112C23] text-[#A0C4B5]'}`}
                >
                  30D
                </button>
                <button 
                  onClick={() => setTimeRange('90d')}
                  className={`px-3 py-1 text-sm rounded-lg ${timeRange === '90d' ? 'bg-[#4EFF9B] text-[#0D221A]' : 'bg-[#112C23] text-[#A0C4B5]'}`}
                >
                  90D
                </button>
              </div>
            </div>
            
            <div className="h-64 flex items-end space-x-2">
              {userGrowthData.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-gradient-to-t from-[#4EFF9B]/70 to-[#4EFF9B] rounded-t-lg transition-all hover:opacity-75"
                    style={{ height: `${(item.value / 15000) * 100}%` }}
                  ></div>
                  <span className="text-xs text-[#A0C4B5] mt-2">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Generation Trends Chart */}
          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-6">Generation Trends</h2>
            
            <div className="flex items-center justify-center h-64">
              <div className="relative w-48 h-48">
                {/* Donut chart background */}
                <div className="absolute inset-0 rounded-full border-8 border-[#112C23]"></div>
                
                {/* Chart segments */}
                <div className="absolute inset-0 rounded-full border-8 border-[#4EFF9B]" 
                     style={{ clipPath: 'inset(0 0 0 50%)' }}></div>
                <div className="absolute inset-0 rounded-full border-8 border-teal-400" 
                     style={{ clipPath: 'inset(0 50% 0 0)' }}></div>
                
                {/* Center label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">100%</span>
                  <span className="text-sm text-[#A0C4B5]">Total</span>
                </div>
              </div>
              
              {/* Legend */}
              <div className="absolute right-6 top-1/2 transform -translate-y-1/2 space-y-3">
                {generationData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      index === 0 ? 'bg-[#4EFF9B]' : 
                      index === 1 ? 'bg-teal-400' : 
                      index === 2 ? 'bg-teal-600' : 'bg-teal-800'
                    }`}></div>
                    <span className="text-sm">{item.name}</span>
                    <span className="text-sm text-[#A0C4B5] ml-2">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, change, icon }: { 
  title: string, 
  value: string, 
  change: string, 
  icon: React.ReactNode 
}) {
  return (
    <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm hover:border-[#4EFF9B]/40 transition-all">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[#A0C4B5] text-sm mb-1">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          <p className="text-[#4EFF9B] text-sm mt-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            {change}
          </p>
        </div>
        <div className="p-3 bg-[#112C23] rounded-xl text-[#4EFF9B]">
          {icon}
        </div>
      </div>
    </div>
  )
}