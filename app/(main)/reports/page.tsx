"use client"
import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

type TimeRange = '7d' | '30d' | '90d' | '1y'

type RevenueData = {
  date: string
  amount: number
}

type UserData = {
  date: string
  count: number
}

type TemplateData = {
  templateName: string
  uses: number
}

type CreatorData = {
  creatorName: string
  earnings: number
}

type CategoryData = {
  category: string
  count: number
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [timeRange, setTimeRange] = useState<TimeRange>('30d')
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [userData, setUserData] = useState<UserData[]>([])
  const [templateData, setTemplateData] = useState<TemplateData[]>([])
  const [creatorData, setCreatorData] = useState<CreatorData[]>([])
  const [categoryData, setCategoryData] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real implementation, this would fetch data from the backend
    // For now, we'll use mock data
    const mockRevenueData: RevenueData[] = [
      { date: '2023-01-01', amount: 1200 },
      { date: '2023-01-02', amount: 1900 },
      { date: '2023-01-03', amount: 1500 },
      { date: '2023-01-04', amount: 2200 },
      { date: '2023-01-05', amount: 1800 },
      { date: '2023-01-06', amount: 2500 },
      { date: '2023-01-07', amount: 2100 },
    ]

    const mockUserData: UserData[] = [
      { date: '2023-01-01', count: 45 },
      { date: '2023-01-02', count: 52 },
      { date: '2023-01-03', count: 48 },
      { date: '2023-01-04', count: 65 },
      { date: '2023-01-05', count: 58 },
      { date: '2023-01-06', count: 72 },
      { date: '2023-01-07', count: 68 },
    ]

    const mockTemplateData: TemplateData[] = [
      { templateName: 'Portrait Photography', uses: 1240 },
      { templateName: 'Landscape Art', uses: 980 },
      { templateName: 'Anime Style', uses: 870 },
      { templateName: 'Realistic Portraits', uses: 760 },
      { templateName: 'Abstract Art', uses: 650 },
    ]

    const mockCreatorData: CreatorData[] = [
      { creatorName: 'Alex Johnson', earnings: 12500 },
      { creatorName: 'Sarah Williams', earnings: 9800 },
      { creatorName: 'Michael Chen', earnings: 7600 },
      { creatorName: 'Emma Davis', earnings: 6500 },
      { creatorName: 'James Wilson', earnings: 5200 },
    ]

    const mockCategoryData: CategoryData[] = [
      { category: 'Photography', count: 45 },
      { category: 'Art', count: 32 },
      { category: 'Anime', count: 28 },
      { category: 'Realistic', count: 22 },
      { category: 'Abstract', count: 18 },
    ]

    setRevenueData(mockRevenueData)
    setUserData(mockUserData)
    setTemplateData(mockTemplateData)
    setCreatorData(mockCreatorData)
    setCategoryData(mockCategoryData)
    setLoading(false)
  }, [timeRange])

  const COLORS = ['#4EFF9B', '#3ad485', '#2a9a70', '#1a605a', '#0d221a']

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <div className="flex space-x-2">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <button className="px-4 py-2 bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#112C23]">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'overview'
              ? 'text-[#4EFF9B] border-b-2 border-[#4EFF9B]'
              : 'text-[#A0C4B5] hover:text-[#E9F5EE]'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'users'
              ? 'text-[#4EFF9B] border-b-2 border-[#4EFF9B]'
              : 'text-[#A0C4B5] hover:text-[#E9F5EE]'
          }`}
          onClick={() => setActiveTab('users')}
        >
          User Reports
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'generations'
              ? 'text-[#4EFF9B] border-b-2 border-[#4EFF9B]'
              : 'text-[#A0C4B5] hover:text-[#E9F5EE]'
          }`}
          onClick={() => setActiveTab('generations')}
        >
          Generation Reports
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'revenue'
              ? 'text-[#4EFF9B] border-b-2 border-[#4EFF9B]'
              : 'text-[#A0C4B5] hover:text-[#E9F5EE]'
          }`}
          onClick={() => setActiveTab('revenue')}
        >
          Revenue Reports
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'templates'
              ? 'text-[#4EFF9B] border-b-2 border-[#4EFF9B]'
              : 'text-[#A0C4B5] hover:text-[#E9F5EE]'
          }`}
          onClick={() => setActiveTab('templates')}
        >
          Template Reports
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'creators'
              ? 'text-[#4EFF9B] border-b-2 border-[#4EFF9B]'
              : 'text-[#A0C4B5] hover:text-[#E9F5EE]'
          }`}
          onClick={() => setActiveTab('creators')}
        >
          Creator Reports
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Users" 
              value="12,482" 
              change="+12%" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
            />
            <StatCard 
              title="Active Users" 
              value="8,642" 
              change="+8%" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
            />
            <StatCard 
              title="Total Generations" 
              value="86,420" 
              change="+15%" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            />
            <StatCard 
              title="Total Revenue" 
              value="₹2,45,600" 
              change="+22%" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4">User Growth</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#112C23" />
                    <XAxis dataKey="date" stroke="#A0C4B5" />
                    <YAxis stroke="#A0C4B5" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#112C23', 
                        borderColor: '#4EFF9B', 
                        color: '#E9F5EE' 
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#4EFF9B" 
                      strokeWidth={2} 
                      dot={{ stroke: '#4EFF9B', fill: '#15362B', strokeWidth: 2, r: 4 }} 
                      activeDot={{ r: 6, stroke: '#4EFF9B', fill: '#15362B' }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#112C23" />
                    <XAxis dataKey="date" stroke="#A0C4B5" />
                    <YAxis stroke="#A0C4B5" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#112C23', 
                        borderColor: '#4EFF9B', 
                        color: '#E9F5EE' 
                      }} 
                    />
                    <Bar dataKey="amount" fill="#4EFF9B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4">Popular Templates</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={templateData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#112C23" />
                    <XAxis type="number" stroke="#A0C4B5" />
                    <YAxis dataKey="templateName" type="category" stroke="#A0C4B5" width={100} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#112C23', 
                        borderColor: '#4EFF9B', 
                        color: '#E9F5EE' 
                      }} 
                    />
                    <Bar dataKey="uses" fill="#4EFF9B" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
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
                      dataKey="count"
                      label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#112C23', 
                        borderColor: '#4EFF9B', 
                        color: '#E9F5EE' 
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Reports Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">User Growth Over Time</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#112C23" />
                  <XAxis dataKey="date" stroke="#A0C4B5" />
                  <YAxis stroke="#A0C4B5" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#112C23', 
                      borderColor: '#4EFF9B', 
                      color: '#E9F5EE' 
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#4EFF9B" 
                    strokeWidth={2} 
                    dot={{ stroke: '#4EFF9B', fill: '#15362B', strokeWidth: 2, r: 4 }} 
                    activeDot={{ r: 6, stroke: '#4EFF9B', fill: '#15362B' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4">User Acquisition Sources</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Organic Search</span>
                  <span>45%</span>
                </div>
                <div className="w-full bg-[#112C23] rounded-full h-2">
                  <div className="bg-[#4EFF9B] h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
                
                <div className="flex justify-between">
                  <span>Social Media</span>
                  <span>30%</span>
                </div>
                <div className="w-full bg-[#112C23] rounded-full h-2">
                  <div className="bg-[#3ad485] h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
                
                <div className="flex justify-between">
                  <span>Referrals</span>
                  <span>15%</span>
                </div>
                <div className="w-full bg-[#112C23] rounded-full h-2">
                  <div className="bg-[#2a9a70] h-2 rounded-full" style={{ width: '15%' }}></div>
                </div>
                
                <div className="flex justify-between">
                  <span>Direct</span>
                  <span>10%</span>
                </div>
                <div className="w-full bg-[#112C23] rounded-full h-2">
                  <div className="bg-[#1a605a] h-2 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>

            <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4">User Retention</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Day 1</span>
                  <span>75%</span>
                </div>
                <div className="w-full bg-[#112C23] rounded-full h-2">
                  <div className="bg-[#4EFF9B] h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                
                <div className="flex justify-between">
                  <span>Day 7</span>
                  <span>60%</span>
                </div>
                <div className="w-full bg-[#112C23] rounded-full h-2">
                  <div className="bg-[#3ad485] h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                
                <div className="flex justify-between">
                  <span>Day 30</span>
                  <span>45%</span>
                </div>
                <div className="w-full bg-[#112C23] rounded-full h-2">
                  <div className="bg-[#2a9a70] h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>

            <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4">Top Users by Generations</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>John Doe</span>
                  <span>1,240</span>
                </div>
                <div className="flex justify-between">
                  <span>Jane Smith</span>
                  <span>980</span>
                </div>
                <div className="flex justify-between">
                  <span>Mike Johnson</span>
                  <span>870</span>
                </div>
                <div className="flex justify-between">
                  <span>Sarah Williams</span>
                  <span>760</span>
                </div>
                <div className="flex justify-between">
                  <span>David Brown</span>
                  <span>650</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generation Reports Tab */}
      {activeTab === 'generations' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              title="Total Generations" 
              value="86,420" 
              change="+15%" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            />
            <StatCard 
              title="Avg per User" 
              value="6.9" 
              change="+5%" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            />
            <StatCard 
              title="Success Rate" 
              value="98.5%" 
              change="+2%" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>

          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">Generations Over Time</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#112C23" />
                  <XAxis dataKey="date" stroke="#A0C4B5" />
                  <YAxis stroke="#A0C4B5" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#112C23', 
                      borderColor: '#4EFF9B', 
                      color: '#E9F5EE' 
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#4EFF9B" 
                    strokeWidth={2} 
                    dot={{ stroke: '#4EFF9B', fill: '#15362B', strokeWidth: 2, r: 4 }} 
                    activeDot={{ r: 6, stroke: '#4EFF9B', fill: '#15362B' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4">Quality Settings Distribution</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Standard (512x512)</span>
                  <span>40%</span>
                </div>
                <div className="w-full bg-[#112C23] rounded-full h-2">
                  <div className="bg-[#4EFF9B] h-2 rounded-full" style={{ width: '40%' }}></div>
                </div>
                
                <div className="flex justify-between">
                  <span>High (1024x1024)</span>
                  <span>35%</span>
                </div>
                <div className="w-full bg-[#112C23] rounded-full h-2">
                  <div className="bg-[#3ad485] h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
                
                <div className="flex justify-between">
                  <span>Ultra (2048x2048)</span>
                  <span>25%</span>
                </div>
                <div className="w-full bg-[#112C23] rounded-full h-2">
                  <div className="bg-[#2a9a70] h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>

            <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4">Aspect Ratio Preferences</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>1:1 (Square)</span>
                  <span>45%</span>
                </div>
                <div className="w-full bg-[#112C23] rounded-full h-2">
                  <div className="bg-[#4EFF9B] h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
                
                <div className="flex justify-between">
                  <span>16:9 (Landscape)</span>
                  <span>30%</span>
                </div>
                <div className="w-full bg-[#112C23] rounded-full h-2">
                  <div className="bg-[#3ad485] h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
                
                <div className="flex justify-between">
                  <span>9:16 (Portrait)</span>
                  <span>25%</span>
                </div>
                <div className="w-full bg-[#112C23] rounded-full h-2">
                  <div className="bg-[#2a9a70] h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Reports Tab */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard 
              title="Total Revenue" 
              value="₹2,45,600" 
              change="+22%" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard 
              title="Avg Order Value" 
              value="₹49" 
              change="+8%" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            />
            <StatCard 
              title="Conversion Rate" 
              value="12.5%" 
              change="+3%" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />
            <StatCard 
              title="Top Package" 
              value="Pro Pack" 
              change="₹49" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              }
            />
          </div>

          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#112C23" />
                  <XAxis dataKey="date" stroke="#A0C4B5" />
                  <YAxis stroke="#A0C4B5" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#112C23', 
                      borderColor: '#4EFF9B', 
                      color: '#E9F5EE' 
                    }} 
                  />
                  <Bar dataKey="amount" fill="#4EFF9B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4">Revenue by Package</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Ultimate Pack (₹199)</span>
                  <span>45%</span>
                </div>
                <div className="w-full bg-[#112C23] rounded-full h-2">
                  <div className="bg-[#4EFF9B] h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
                
                <div className="flex justify-between">
                  <span>Pro Pack (₹49)</span>
                  <span>35%</span>
                </div>
                <div className="w-full bg-[#112C23] rounded-full h-2">
                  <div className="bg-[#3ad485] h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
                
                <div className="flex justify-between">
                  <span>Mini Pack (₹9)</span>
                  <span>20%</span>
                </div>
                <div className="w-full bg-[#112C23] rounded-full h-2">
                  <div className="bg-[#2a9a70] h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
            </div>

            <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4">Top Spending Users</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Alex Johnson</span>
                  <span>₹2,450</span>
                </div>
                <div className="flex justify-between">
                  <span>Sarah Williams</span>
                  <span>₹1,980</span>
                </div>
                <div className="flex justify-between">
                  <span>Michael Chen</span>
                  <span>₹1,650</span>
                </div>
                <div className="flex justify-between">
                  <span>Emma Davis</span>
                  <span>₹1,240</span>
                </div>
                <div className="flex justify-between">
                  <span>James Wilson</span>
                  <span>₹980</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Reports Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              title="Total Templates" 
              value="1,847" 
              change="+12%" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              }
            />
            <StatCard 
              title="Avg Uses per Template" 
              value="46.8" 
              change="+8%" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            />
            <StatCard 
              title="Approval Rate" 
              value="87%" 
              change="+5%" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>

          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">Most Used Templates</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={templateData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#112C23" />
                  <XAxis type="number" stroke="#A0C4B5" />
                  <YAxis dataKey="templateName" type="category" stroke="#A0C4B5" width={120} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#112C23', 
                      borderColor: '#4EFF9B', 
                      color: '#E9F5EE' 
                    }} 
                  />
                  <Bar dataKey="uses" fill="#4EFF9B" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4">Category-wise Usage</h3>
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
                      dataKey="count"
                      label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#112C23', 
                        borderColor: '#4EFF9B', 
                        color: '#E9F5EE' 
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4">Template Performance</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Portrait Photography</span>
                    <span>1,240 uses</span>
                  </div>
                  <div className="w-full bg-[#112C23] rounded-full h-2">
                    <div className="bg-[#4EFF9B] h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Landscape Art</span>
                    <span>980 uses</span>
                  </div>
                  <div className="w-full bg-[#112C23] rounded-full h-2">
                    <div className="bg-[#3ad485] h-2 rounded-full" style={{ width: '79%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Anime Style</span>
                    <span>870 uses</span>
                  </div>
                  <div className="w-full bg-[#112C23] rounded-full h-2">
                    <div className="bg-[#2a9a70] h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Realistic Portraits</span>
                    <span>760 uses</span>
                  </div>
                  <div className="w-full bg-[#112C23] rounded-full h-2">
                    <div className="bg-[#1a605a] h-2 rounded-full" style={{ width: '61%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Creator Reports Tab */}
      {activeTab === 'creators' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              title="Total Creators" 
              value="248" 
              change="+15%" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />
            <StatCard 
              title="Avg Earnings" 
              value="₹5,200" 
              change="+12%" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard 
              title="Top Category" 
              value="Photography" 
              change="45 creators" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 22V12h6v10" />
                </svg>
              }
            />
          </div>

          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">Top Earning Creators</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={creatorData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#112C23" />
                  <XAxis type="number" stroke="#A0C4B5" />
                  <YAxis dataKey="creatorName" type="category" stroke="#A0C4B5" width={120} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#112C23', 
                      borderColor: '#4EFF9B', 
                      color: '#E9F5EE' 
                    }} 
                  />
                  <Bar dataKey="earnings" fill="#4EFF9B" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4">Creator Retention</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Month 1</span>
                  <span>85%</span>
                </div>
                <div className="w-full bg-[#112C23] rounded-full h-2">
                  <div className="bg-[#4EFF9B] h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                
                <div className="flex justify-between">
                  <span>Month 3</span>
                  <span>72%</span>
                </div>
                <div className="w-full bg-[#112C23] rounded-full h-2">
                  <div className="bg-[#3ad485] h-2 rounded-full" style={{ width: '72%' }}></div>
                </div>
                
                <div className="flex justify-between">
                  <span>Month 6</span>
                  <span>60%</span>
                </div>
                <div className="w-full bg-[#112C23] rounded-full h-2">
                  <div className="bg-[#2a9a70] h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>

            <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4">Average Templates per Creator</h3>
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="text-5xl font-bold text-[#4EFF9B] mb-2">7.4</div>
                  <div className="text-[#A0C4B5]">Templates per Creator</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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