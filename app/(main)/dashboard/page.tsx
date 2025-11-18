"use client"
import { useState, useEffect } from "react"
import { adminAnalyticsApi } from "@/services/api"

// Define types for our data
type Stats = {
  totalUsers: number
  activeUsers: number
  newUsersToday: number
  totalCreators: number
  pendingCreators: number
  totalTemplates: number
  pendingTemplates: number
  totalGenerations: number
  monthlyRevenue: number
}

type UserGrowthData = {
  day: string
  value: number
}[]

type GenerationData = {
  name: string
  value: number
}[]

type SystemHealth = {
  database: string
  aiApi: string
  paymentGateway: string
  storage: number
  server: {
    cpu: number
    memory: number
    disk: number
  }
  errorRate: number
}

type Notification = {
  id: number
  type: string
  count: number
  message: string
}

type Activity = {
  id: number
  type: string
  message: string
  time: string
}

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeUsers: 0,
    newUsersToday: 0,
    totalCreators: 0,
    pendingCreators: 0,
    totalTemplates: 0,
    pendingTemplates: 0,
    totalGenerations: 0,
    monthlyRevenue: 0
  })
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthData>([])
  const [generationData, setGenerationData] = useState<GenerationData>([])
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    database: 'green',
    aiApi: 'green',
    paymentGateway: 'green',
    storage: 75,
    server: { cpu: 45, memory: 60, disk: 70 },
    errorRate: 0.5
  })
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, type: 'creator', count: 5, message: 'Pending creator applications' },
    { id: 2, type: 'template', count: 12, message: 'Templates pending review' },
    { id: 3, type: 'support', count: 3, message: 'High-priority support tickets' },
    { id: 4, type: 'system', count: 0, message: 'System warnings' }
  ])
  const [activityFeed, setActivityFeed] = useState<Activity[]>([
    { id: 1, type: 'user', message: 'New user registered: John Doe', time: '2 min ago' },
    { id: 2, type: 'template', message: 'Template submitted by Creator Studio', time: '15 min ago' },
    { id: 3, type: 'payment', message: 'Payment received: ₹499', time: '1 hour ago' },
    { id: 4, type: 'generation', message: 'Image generation completed', time: '2 hours ago' },
    { id: 5, type: 'support', message: 'New support ticket created', time: '3 hours ago' }
  ])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch dashboard data from the backend
        const dashboardData: any = await adminAnalyticsApi.dashboard()
        
        // Update stats with real data
        setStats({
          totalUsers: dashboardData.totalUsers || 0,
          activeUsers: dashboardData.activeUsers || 0,
          newUsersToday: dashboardData.newUsersToday || 0,
          totalCreators: dashboardData.totalCreators || 0,
          pendingCreators: dashboardData.pendingCreators || 0,
          totalTemplates: dashboardData.totalTemplates || 0,
          pendingTemplates: dashboardData.pendingTemplates || 0,
          totalGenerations: dashboardData.totalGenerations || 0,
          monthlyRevenue: dashboardData.monthlyRevenue || 0
        })
        
        // Update user growth data
        setUserGrowthData(dashboardData.userGrowth || [])
        
        // Update generation data
        setGenerationData(dashboardData.generationData || [])
        
        // Update system health data if available
        if (dashboardData.systemHealth) {
          setSystemHealth(dashboardData.systemHealth)
        }
        
        setLoading(false)
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err)
        setError(err.message || 'Failed to load dashboard data')
        setLoading(false)
        
        // Fallback to mock data in case of error
        setStats({
          totalUsers: 12482,
          activeUsers: 8642,
          newUsersToday: 142,
          totalCreators: 342,
          pendingCreators: 8,
          totalTemplates: 1847,
          pendingTemplates: 23,
          totalGenerations: 256420,
          monthlyRevenue: 245600
        })
        
        setUserGrowthData([
          { day: '1', value: 12000 },
          { day: '5', value: 12200 },
          { day: '10', value: 12500 },
          { day: '15', value: 12800 },
          { day: '20', value: 13200 },
          { day: '25', value: 13800 },
          { day: '30', value: 14500 }
        ])
        
        setGenerationData([
          { name: 'Portrait', value: 35 },
          { name: 'Landscape', value: 25 },
          { name: 'Square', value: 20 },
          { name: 'Other', value: 20 }
        ])
      }
    }
    
    fetchData()
  }, [])

  const handleQuickAction = (action: string) => {
    switch(action) {
      case 'reviewTemplates':
        // Navigate to templates review page
        break
      case 'reviewCreators':
        // Navigate to creators review page
        break
      case 'checkSupport':
        // Navigate to support tickets page
        break
      case 'moderateContent':
        // Navigate to content moderation page
        break
    }
  }

  return (
    // Main container with dark green background
    <div className="min-h-screen bg-[#0D221A] text-[#E9F5EE] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Admin</h1>
          <p className="text-[#A0C4B5]">Here's what's happening with your platform today.</p>
        </div>

        {/* Notifications Center */}
        <div className="mb-6">
          <div className="bg-[#15362B] rounded-2xl p-4 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Notifications</h2>
              <button className="text-[#4EFF9B] text-sm">Mark all as read</button>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              {notifications.map(notification => (
                <div key={notification.id} className="flex items-center bg-[#112C23] rounded-lg px-3 py-2">
                  <span className="bg-[#4EFF9B] text-[#0D221A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">
                    {notification.count}
                  </span>
                  <span className="text-sm">{notification.message}</span>
                </div>
              ))}
            </div>
          </div>
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
            title="Active Users" 
            value={stats.activeUsers.toLocaleString()} 
            change="+8.2%" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
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
            title="Total Generations" 
            value={stats.totalGenerations.toLocaleString()} 
            change="+18.2%" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
        </div>

        {/* Quick Actions Panel */}
        <div className="mb-8">
          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button 
                onClick={() => handleQuickAction('reviewTemplates')}
                className="flex flex-col items-center justify-center p-4 bg-[#112C23] rounded-xl hover:bg-[#4EFF9B]/20 transition-colors"
              >
                <div className="bg-[#4EFF9B] text-[#0D221A] rounded-full w-10 h-10 flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-sm">Review Templates</span>
                <span className="text-xs text-[#4EFF9B] mt-1">{stats.pendingTemplates} pending</span>
              </button>
              
              <button 
                onClick={() => handleQuickAction('reviewCreators')}
                className="flex flex-col items-center justify-center p-4 bg-[#112C23] rounded-xl hover:bg-[#4EFF9B]/20 transition-colors"
              >
                <div className="bg-[#4EFF9B] text-[#0D221A] rounded-full w-10 h-10 flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-sm">Review Creators</span>
                <span className="text-xs text-[#4EFF9B] mt-1">{stats.pendingCreators} pending</span>
              </button>
              
              <button 
                onClick={() => handleQuickAction('checkSupport')}
                className="flex flex-col items-center justify-center p-4 bg-[#112C23] rounded-xl hover:bg-[#4EFF9B]/20 transition-colors"
              >
                <div className="bg-[#4EFF9B] text-[#0D221A] rounded-full w-10 h-10 flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <span className="text-sm">Support Tickets</span>
                <span className="text-xs text-[#4EFF9B] mt-1">3 high priority</span>
              </button>
              
              <button 
                onClick={() => handleQuickAction('moderateContent')}
                className="flex flex-col items-center justify-center p-4 bg-[#112C23] rounded-xl hover:bg-[#4EFF9B]/20 transition-colors"
              >
                <div className="bg-[#4EFF9B] text-[#0D221A] rounded-full w-10 h-10 flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="text-sm">Moderate Content</span>
                <span className="text-xs text-[#4EFF9B] mt-1">7 flagged</span>
              </button>
            </div>
          </div>
        </div>

        {/* Charts and System Health */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* User Growth Chart */}
          <div className="lg:col-span-2 bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
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

          {/* System Health Status */}
          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-6">System Health</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#A0C4B5]">Database</span>
                <span className={`px-2 py-1 rounded-full text-xs ${systemHealth.database === 'green' ? 'bg-green-900/50 text-green-400' : systemHealth.database === 'yellow' ? 'bg-yellow-900/50 text-yellow-400' : 'bg-red-900/50 text-red-400'}`}>
                  {systemHealth.database === 'green' ? 'Operational' : systemHealth.database === 'yellow' ? 'Degraded' : 'Down'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-[#A0C4B5]">AI API</span>
                <span className={`px-2 py-1 rounded-full text-xs ${systemHealth.aiApi === 'green' ? 'bg-green-900/50 text-green-400' : systemHealth.aiApi === 'yellow' ? 'bg-yellow-900/50 text-yellow-400' : 'bg-red-900/50 text-red-400'}`}>
                  {systemHealth.aiApi === 'green' ? 'Operational' : systemHealth.aiApi === 'yellow' ? 'Degraded' : 'Down'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-[#A0C4B5]">Payment Gateway</span>
                <span className={`px-2 py-1 rounded-full text-xs ${systemHealth.paymentGateway === 'green' ? 'bg-green-900/50 text-green-400' : systemHealth.paymentGateway === 'yellow' ? 'bg-yellow-900/50 text-yellow-400' : 'bg-red-900/50 text-red-400'}`}>
                  {systemHealth.paymentGateway === 'green' ? 'Operational' : systemHealth.paymentGateway === 'yellow' ? 'Degraded' : 'Down'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-[#A0C4B5]">Storage</span>
                <span className="text-sm">{systemHealth.storage}%</span>
              </div>
              
              <div className="pt-2">
                <div className="flex justify-between text-xs text-[#A0C4B5] mb-1">
                  <span>Server Resources</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>CPU</span>
                      <span>{systemHealth.server.cpu}%</span>
                    </div>
                    <div className="w-full bg-[#112C23] rounded-full h-2">
                      <div 
                        className="bg-[#4EFF9B] h-2 rounded-full" 
                        style={{ width: `${systemHealth.server.cpu}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Memory</span>
                      <span>{systemHealth.server.memory}%</span>
                    </div>
                    <div className="w-full bg-[#112C23] rounded-full h-2">
                      <div 
                        className="bg-[#4EFF9B] h-2 rounded-full" 
                        style={{ width: `${systemHealth.server.memory}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Disk</span>
                      <span>{systemHealth.server.disk}%</span>
                    </div>
                    <div className="w-full bg-[#112C23] rounded-full h-2">
                      <div 
                        className="bg-[#4EFF9B] h-2 rounded-full" 
                        style={{ width: `${systemHealth.server.disk}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-[#A0C4B5]">Error Rate</span>
                <span className="text-sm">{systemHealth.errorRate}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed and Generation Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Feed */}
          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              <button className="text-[#4EFF9B] text-sm">View All</button>
            </div>
            
            <div className="space-y-4">
              {activityFeed.map(activity => (
                <div key={activity.id} className="flex items-start">
                  <div className="mr-3 mt-1">
                    <div className="w-2 h-2 bg-[#4EFF9B] rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-[#A0C4B5] mt-1">{activity.time}</p>
                  </div>
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
  value: string | number, 
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