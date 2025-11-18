"use client"
import { useState, useEffect } from "react"
import { adminTransactionsApi } from "@/services/api"

type Transaction = {
  id: string
  userId: string
  userName: string
  userEmail: string
  type: 'purchase' | 'generation' | 'refund' | 'withdrawal' | 'creator_earning'
  amount: number
  points: number
  status: 'success' | 'failed' | 'pending' | 'refunded'
  gateway: string
  createdAt: string
  details?: {
    packageName?: string
    templateName?: string
    creatorName?: string
    bankDetails?: {
      accountHolder: string
      bankName: string
      accountNumber: string
      ifsc: string
    }
  }
}

type PointsPackage = {
  id: string
  name: string
  price: number
  points: number
  bonusPoints: number
  popular?: boolean
  enabled: boolean
}

type PromoCode = {
  id: string
  code: string
  discountType: 'percentage' | 'fixed' | 'bonus'
  discountValue: number
  applicableOn: string
  usageLimit: number
  perUserLimit: number
  startDate: string
  endDate: string
  status: 'active' | 'expired' | 'disabled'
  totalUses: number
}

type WithdrawalRequest = {
  id: string
  creator: {
    id: string
    name: string
    email: string
  }
  amount: number
  availableBalance: number
  bankDetails: {
    accountHolder: string
    bankName: string
    accountNumber: string
    ifsc: string
    pan: string
  }
  requestDate: string
  status: 'pending' | 'processing' | 'completed' | 'rejected'
  platformFee: number
  tds: number
  netPayable: number
}

export default function FinancesPage() {
  const [activeTab, setActiveTab] = useState('transactions')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('monthly')
  const [searchTerm, setSearchTerm] = useState("")
  const [transactionTypeFilter, setTransactionTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [showTransactionDetail, setShowTransactionDetail] = useState(false)
  const [pointsPackages, setPointsPackages] = useState<PointsPackage[]>([])
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([])
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalRequest | null>(null)
  const [showWithdrawalDetail, setShowWithdrawalDetail] = useState(false)
  const [newPackage, setNewPackage] = useState({
    name: '',
    price: 0,
    points: 0,
    bonusPoints: 0,
    popular: false,
    enabled: true
  })
  const [newPromoCode, setNewPromoCode] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed' | 'bonus',
    discountValue: 0,
    applicableOn: 'all',
    usageLimit: 100,
    perUserLimit: 1,
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    loadTransactions()
    // Initialize mock data
    setPointsPackages([
      {
        id: 'PACK-001',
        name: 'Mini Pack',
        price: 9,
        points: 50,
        bonusPoints: 0,
        enabled: true
      },
      {
        id: 'PACK-002',
        name: 'Pro Pack',
        price: 49,
        points: 300,
        bonusPoints: 50,
        popular: true,
        enabled: true
      },
      {
        id: 'PACK-003',
        name: 'Ultimate Pack',
        price: 199,
        points: 1500,
        bonusPoints: 300,
        enabled: true
      }
    ])
    
    setPromoCodes([
      {
        id: 'PROMO-001',
        code: 'DIWALI50',
        discountType: 'percentage',
        discountValue: 50,
        applicableOn: 'all',
        usageLimit: 1000,
        perUserLimit: 1,
        startDate: '2023-10-01',
        endDate: '2023-11-30',
        status: 'active',
        totalUses: 142
      }
    ])
    
    setWithdrawalRequests([
      {
        id: 'WITH-001',
        creator: {
          id: 'CRE-001',
          name: 'Jane Artist',
          email: 'jane@example.com'
        },
        amount: 5000,
        availableBalance: 7500,
        bankDetails: {
          accountHolder: 'Jane Artist',
          bankName: 'State Bank of India',
          accountNumber: 'XXXXXX1234',
          ifsc: 'SBIN0002499',
          pan: 'ABCDE1234F'
        },
        requestDate: '2023-06-15',
        status: 'pending',
        platformFee: 500,
        tds: 250,
        netPayable: 4250
      }
    ])
  }, [timeRange])

  const loadTransactions = async () => {
    try {
      setLoading(true)
      const data = await adminTransactionsApi.list(timeRange)
      setTransactions(data)
    } catch (err: any) {
      setError(err?.message || "Failed to load transactions")
    } finally {
      setLoading(false)
    }
  }

  // Mock data for revenue chart
  const revenueData = [
    { date: 'Jan', amount: 45000 },
    { date: 'Feb', amount: 38000 },
    { date: 'Mar', amount: 52000 },
    { date: 'Apr', amount: 48000 },
    { date: 'May', amount: 61000 },
    { date: 'Jun', amount: 55000 },
  ]

  // Mock data for overview cards
  const overviewStats = {
    totalRevenue: 245600,
    thisMonthRevenue: 55000,
    todayRevenue: 2200,
    totalPointsSold: 125000,
    averageTransactionValue: 75,
    paymentSuccessRate: 96.5
  }

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setShowTransactionDetail(true)
  }

  const handleProcessRefund = async (id: string) => {
    try {
      await adminTransactionsApi.refund(id)
      loadTransactions()
      alert('Refund processed successfully')
    } catch (err: any) {
      alert('Failed to process refund: ' + (err?.message || 'Unknown error'))
    }
  }

  const handleAddPackage = () => {
    if (!newPackage.name || newPackage.price <= 0 || newPackage.points <= 0) return
    
    const packageItem: PointsPackage = {
      id: `PACK-${Date.now()}`,
      ...newPackage
    }
    
    setPointsPackages([...pointsPackages, packageItem])
    setNewPackage({
      name: '',
      price: 0,
      points: 0,
      bonusPoints: 0,
      popular: false,
      enabled: true
    })
  }

  const handleAddPromoCode = () => {
    if (!newPromoCode.code || newPromoCode.discountValue <= 0) return
    
    const promo: PromoCode = {
      id: `PROMO-${Date.now()}`,
      ...newPromoCode,
      status: 'active',
      totalUses: 0
    }
    
    setPromoCodes([...promoCodes, promo])
    setNewPromoCode({
      code: '',
      discountType: 'percentage',
      discountValue: 0,
      applicableOn: 'all',
      usageLimit: 100,
      perUserLimit: 1,
      startDate: '',
      endDate: ''
    })
  }

  const handleViewWithdrawal = (withdrawal: WithdrawalRequest) => {
    setSelectedWithdrawal(withdrawal)
    setShowWithdrawalDetail(true)
  }

  const handleApproveWithdrawal = (id: string) => {
    // In a real implementation, this would approve the withdrawal
    alert(`Approving withdrawal ${id}`)
  }

  const handleRejectWithdrawal = (id: string) => {
    // In a real implementation, this would reject the withdrawal
    alert(`Rejecting withdrawal ${id}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-900/50 text-green-400'
      case 'failed': return 'bg-red-900/50 text-red-400'
      case 'pending': return 'bg-yellow-900/50 text-yellow-400'
      case 'refunded': return 'bg-blue-900/50 text-blue-400'
      case 'processing': return 'bg-purple-900/50 text-purple-400'
      case 'completed': return 'bg-green-900/50 text-green-400'
      case 'rejected': return 'bg-red-900/50 text-red-400'
      default: return 'bg-gray-900/50 text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Wallet & Transactions</h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors">
            Export Reports
          </button>
          <button className="px-4 py-2 bg-[#4EFF9B] text-[#0D221A] font-medium rounded-lg hover:bg-[#3ad485] transition-colors">
            Analytics
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#112C23]">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'transactions'
              ? 'text-[#4EFF9B] border-b-2 border-[#4EFF9B]'
              : 'text-[#A0C4B5] hover:text-[#E9F5EE]'
          }`}
          onClick={() => setActiveTab('transactions')}
        >
          All Transactions
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'points'
              ? 'text-[#4EFF9B] border-b-2 border-[#4EFF9B]'
              : 'text-[#A0C4B5] hover:text-[#E9F5EE]'
          }`}
          onClick={() => setActiveTab('points')}
        >
          Points Management
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'withdrawals'
              ? 'text-[#4EFF9B] border-b-2 border-[#4EFF9B]'
              : 'text-[#A0C4B5] hover:text-[#E9F5EE]'
          }`}
          onClick={() => setActiveTab('withdrawals')}
        >
          Creator Withdrawals
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'promo'
              ? 'text-[#4EFF9B] border-b-2 border-[#4EFF9B]'
              : 'text-[#A0C4B5] hover:text-[#E9F5EE]'
          }`}
          onClick={() => setActiveTab('promo')}
        >
          Promo Codes
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'gateways'
              ? 'text-[#4EFF9B] border-b-2 border-[#4EFF9B]'
              : 'text-[#A0C4B5] hover:text-[#E9F5EE]'
          }`}
          onClick={() => setActiveTab('gateways')}
        >
          Payment Gateways
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`₹${overviewStats.totalRevenue.toLocaleString()}`} 
          change="+24.7%" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard 
          title="This Month" 
          value={`₹${overviewStats.thisMonthRevenue.toLocaleString()}`} 
          change="+18.2%" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        <StatCard 
          title="Today's Revenue" 
          value={`₹${overviewStats.todayRevenue.toLocaleString()}`} 
          change="+5.3%" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard 
          title="Success Rate" 
          value={`${overviewStats.paymentSuccessRate}%`} 
          change="+2.1%" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* All Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Time Range</label>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setTimeRange('daily')}
                    className={`px-3 py-1 text-sm rounded-lg ${timeRange === 'daily' ? 'bg-[#4EFF9B] text-[#0D221A]' : 'bg-[#112C23] text-[#A0C4B5]'}`}
                  >
                    Daily
                  </button>
                  <button 
                    onClick={() => setTimeRange('weekly')}
                    className={`px-3 py-1 text-sm rounded-lg ${timeRange === 'weekly' ? 'bg-[#4EFF9B] text-[#0D221A]' : 'bg-[#112C23] text-[#A0C4B5]'}`}
                  >
                    Weekly
                  </button>
                  <button 
                    onClick={() => setTimeRange('monthly')}
                    className={`px-3 py-1 text-sm rounded-lg ${timeRange === 'monthly' ? 'bg-[#4EFF9B] text-[#0D221A]' : 'bg-[#112C23] text-[#A0C4B5]'}`}
                  >
                    Monthly
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Search</label>
                <input
                  type="text"
                  placeholder="User, Transaction ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Type</label>
                <select
                  value={transactionTypeFilter}
                  onChange={(e) => setTransactionTypeFilter(e.target.value)}
                  className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                >
                  <option value="all">All Types</option>
                  <option value="purchase">Purchase</option>
                  <option value="generation">Generation</option>
                  <option value="refund">Refund</option>
                  <option value="withdrawal">Withdrawal</option>
                  <option value="creator_earning">Creator Earning</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                >
                  <option value="all">All Statuses</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                  <option value="pending">Pending</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button 
                  onClick={loadTransactions}
                  className="w-full px-4 py-2 bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-6">Revenue Overview</h2>
              <div className="h-64 flex items-end space-x-2">
                {revenueData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div 
                      className="w-full bg-gradient-to-t from-[#4EFF9B]/70 to-[#4EFF9B] rounded-t-lg transition-all hover:opacity-75"
                      style={{ height: `${(item.amount / 70000) * 100}%` }}
                    ></div>
                    <span className="text-xs text-[#A0C4B5] mt-2">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Recent Transactions */}
            <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-6">Recent Transactions</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[#A0C4B5]">
                      <th className="pb-2">User</th>
                      <th className="pb-2">Type</th>
                      <th className="pb-2">Amount</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.slice(0, 5).map((transaction) => (
                      <tr key={transaction.id} className="border-t border-[#112C23]">
                        <td className="py-3">{transaction.userName}</td>
                        <td className="py-3">
                          <span className="px-2 py-1 rounded-full text-xs bg-[#112C23]">
                            {transaction.type}
                          </span>
                        </td>
                        <td className="py-3">₹{transaction.amount.toLocaleString()}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* All Transactions Table */}
          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">All Transactions</h2>
              <button className="px-4 py-2 bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors">
                Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[#A0C4B5]">
                    <th className="pb-2">Date</th>
                    <th className="pb-2">User</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Points</th>
                    <th className="pb-2">Gateway</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-4 text-center">Loading transactions...</td>
                    </tr>
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-4 text-center">No transactions found</td>
                    </tr>
                  ) : (
                    transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-t border-[#112C23]">
                        <td className="py-3">{new Date(transaction.createdAt).toLocaleDateString()}</td>
                        <td className="py-3">
                          <div>{transaction.userName}</div>
                          <div className="text-xs text-[#A0C4B5]">{transaction.userEmail}</div>
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-1 rounded-full text-xs bg-[#112C23]">
                            {transaction.type}
                          </span>
                        </td>
                        <td className="py-3">₹{transaction.amount.toLocaleString()}</td>
                        <td className="py-3">{transaction.points.toLocaleString()}</td>
                        <td className="py-3">{transaction.gateway}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleViewTransaction(transaction)}
                              className="px-3 py-1 text-sm bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors"
                            >
                              View
                            </button>
                            {transaction.status === 'success' && transaction.type === 'purchase' && (
                              <button 
                                onClick={() => handleProcessRefund(transaction.id)}
                                className="px-3 py-1 text-sm bg-red-900/50 hover:bg-red-900/70 text-red-400 rounded-lg transition-colors"
                              >
                                Refund
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Points Management Tab */}
      {activeTab === 'points' && (
        <div className="space-y-6">
          {/* Points Configuration */}
          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-6">Points Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#112C23] rounded-xl p-4">
                <h3 className="font-medium mb-3">Generation Cost</h3>
                <p className="text-2xl font-bold">20 <span className="text-sm font-normal">points</span></p>
                <p className="text-sm text-[#A0C4B5] mt-1">Per image generation</p>
              </div>
              <div className="bg-[#112C23] rounded-xl p-4">
                <h3 className="font-medium mb-3">Daily Login</h3>
                <p className="text-2xl font-bold">3 <span className="text-sm font-normal">points</span></p>
                <p className="text-sm text-[#A0C4B5] mt-1">Reward for daily login</p>
              </div>
              <div className="bg-[#112C23] rounded-xl p-4">
                <h3 className="font-medium mb-3">Referral Bonus</h3>
                <p className="text-2xl font-bold">25 <span className="text-sm font-normal">points</span></p>
                <p className="text-sm text-[#A0C4B5] mt-1">For successful referrals</p>
              </div>
              <div className="bg-[#112C23] rounded-xl p-4">
                <h3 className="font-medium mb-3">Ad Watch</h3>
                <p className="text-2xl font-bold">6 <span className="text-sm font-normal">points</span></p>
                <p className="text-sm text-[#A0C4B5] mt-1">Per ad watched</p>
              </div>
            </div>
          </div>
          
          {/* Points Packages */}
          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Points Packages</h2>
              <button 
                onClick={() => {
                  // In a real implementation, this would open a modal to add a new package
                  alert('Add new package functionality would open here')
                }}
                className="px-4 py-2 bg-[#4EFF9B] text-[#0D221A] font-medium rounded-lg hover:bg-[#3ad485] transition-colors"
              >
                Add Package
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pointsPackages.map(pkg => (
                <div key={pkg.id} className={`bg-[#112C23] rounded-xl p-5 border ${
                  pkg.popular ? 'border-[#4EFF9B]' : 'border-[#4EFF9B]/20'
                }`}>
                  {pkg.popular && (
                    <div className="text-xs text-[#4EFF9B] font-medium mb-2">MOST POPULAR</div>
                  )}
                  <h3 className="font-semibold text-lg mb-1">{pkg.name}</h3>
                  <div className="mb-3">
                    <span className="text-2xl font-bold">₹{pkg.price}</span>
                  </div>
                  <div className="mb-4">
                    <p className="font-medium">{pkg.points} Points</p>
                    {pkg.bonusPoints > 0 && (
                      <p className="text-sm text-[#4EFF9B]">+{pkg.bonusPoints} Bonus Points</p>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      pkg.enabled 
                        ? 'bg-green-900/50 text-green-400' 
                        : 'bg-red-900/50 text-red-400'
                    }`}>
                      {pkg.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-sm bg-[#15362B] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors">
                        Edit
                      </button>
                      <button className="px-3 py-1 text-sm bg-red-900/50 hover:bg-red-900/70 text-red-400 rounded-lg transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Promo Codes */}
          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Promo Codes</h2>
              <button 
                onClick={() => {
                  // In a real implementation, this would open a modal to add a new promo code
                  alert('Add new promo code functionality would open here')
                }}
                className="px-4 py-2 bg-[#4EFF9B] text-[#0D221A] font-medium rounded-lg hover:bg-[#3ad485] transition-colors"
              >
                Add Promo Code
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[#A0C4B5]">
                    <th className="pb-4">Code</th>
                    <th className="pb-4">Discount</th>
                    <th className="pb-4">Applicable On</th>
                    <th className="pb-4">Valid From/To</th>
                    <th className="pb-4">Usage</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {promoCodes.map(promo => (
                    <tr key={promo.id} className="border-t border-[#112C23]">
                      <td className="py-4 font-medium">{promo.code}</td>
                      <td className="py-4">
                        {promo.discountType === 'percentage' && `${promo.discountValue}% off`}
                        {promo.discountType === 'fixed' && `₹${promo.discountValue} off`}
                        {promo.discountType === 'bonus' && `+${promo.discountValue} points`}
                      </td>
                      <td className="py-4">{promo.applicableOn}</td>
                      <td className="py-4">
                        <div>{promo.startDate}</div>
                        <div className="text-xs text-[#A0C4B5]">to {promo.endDate}</div>
                      </td>
                      <td className="py-4">
                        <div>{promo.totalUses} / {promo.usageLimit}</div>
                        <div className="text-xs text-[#A0C4B5]">{promo.perUserLimit} per user</div>
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          promo.status === 'active' 
                            ? 'bg-green-900/50 text-green-400' 
                            : promo.status === 'expired' 
                              ? 'bg-gray-900/50 text-gray-400' 
                              : 'bg-red-900/50 text-red-400'
                        }`}>
                          {promo.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 text-sm bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors">
                            Edit
                          </button>
                          <button className="px-3 py-1 text-sm bg-red-900/50 hover:bg-red-900/70 text-red-400 rounded-lg transition-colors">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Creator Withdrawals Tab */}
      {activeTab === 'withdrawals' && (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard 
              title="Total Creators" 
              value="342" 
              change="+12" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
            />
            <StatCard 
              title="Pending Withdrawals" 
              value="₹12,500" 
              change="+3" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard 
              title="This Month" 
              value="₹45,000" 
              change="+15%" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
                </svg>
              }
            />
            <StatCard 
              title="Avg. Processing Time" 
              value="2.4 days" 
              change="-0.3" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>
          
          {/* Withdrawal Requests */}
          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Withdrawal Requests</h2>
              <div className="flex space-x-2">
                <select className="px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50">
                  <option>All Statuses</option>
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Completed</option>
                  <option>Rejected</option>
                </select>
                <button className="px-4 py-2 bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors">
                  Export
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[#A0C4B5]">
                    <th className="pb-4">Creator</th>
                    <th className="pb-4">Amount</th>
                    <th className="pb-4">Available Balance</th>
                    <th className="pb-4">Request Date</th>
                    <th className="pb-4">Bank</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawalRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-[#A0C4B5]">
                        No withdrawal requests found
                      </td>
                    </tr>
                  ) : (
                    withdrawalRequests.map(request => (
                      <tr key={request.id} className="border-t border-[#112C23]">
                        <td className="py-4">
                          <div>{request.creator.name}</div>
                          <div className="text-xs text-[#A0C4B5]">{request.creator.email}</div>
                        </td>
                        <td className="py-4">₹{request.amount.toLocaleString()}</td>
                        <td className="py-4">₹{request.availableBalance.toLocaleString()}</td>
                        <td className="py-4">{request.requestDate}</td>
                        <td className="py-4">
                          <div className="text-sm">{request.bankDetails.bankName}</div>
                          <div className="text-xs text-[#A0C4B5]">****{request.bankDetails.accountNumber.slice(-4)}</div>
                        </td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(request.status)}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewWithdrawal(request)}
                              className="px-3 py-1 text-sm bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors"
                            >
                              View
                            </button>
                            {request.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApproveWithdrawal(request.id)}
                                  className="px-3 py-1 text-sm bg-green-900/50 hover:bg-green-900/70 text-green-400 rounded-lg transition-colors"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleRejectWithdrawal(request.id)}
                                  className="px-3 py-1 text-sm bg-red-900/50 hover:bg-red-900/70 text-red-400 rounded-lg transition-colors"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Promo Codes Tab */}
      {activeTab === 'promo' && (
        <div className="space-y-6">
          {/* Add Promo Code Form */}
          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-6">Create New Promo Code</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Code Name</label>
                  <input
                    type="text"
                    value={newPromoCode.code}
                    onChange={(e) => setNewPromoCode({...newPromoCode, code: e.target.value})}
                    className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                    placeholder="e.g., DIWALI50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Discount Type</label>
                  <select
                    value={newPromoCode.discountType}
                    onChange={(e) => setNewPromoCode({...newPromoCode, discountType: e.target.value as any})}
                    className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                  >
                    <option value="percentage">Percentage (e.g., 50% off)</option>
                    <option value="fixed">Fixed amount (e.g., ₹20 off)</option>
                    <option value="bonus">Bonus points (e.g., +100 points free)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Discount Value</label>
                  <input
                    type="number"
                    value={newPromoCode.discountValue}
                    onChange={(e) => setNewPromoCode({...newPromoCode, discountValue: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                    placeholder="Enter value"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Applicable On</label>
                  <select
                    value={newPromoCode.applicableOn}
                    onChange={(e) => setNewPromoCode({...newPromoCode, applicableOn: e.target.value})}
                    className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                  >
                    <option value="all">All packages</option>
                    <option value="specific">Specific packages</option>
                    <option value="minAmount">Minimum purchase amount</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Usage Limits</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#A0C4B5] mb-1">Total Usage Limit</label>
                      <input
                        type="number"
                        value={newPromoCode.usageLimit}
                        onChange={(e) => setNewPromoCode({...newPromoCode, usageLimit: parseInt(e.target.value) || 0})}
                        className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#A0C4B5] mb-1">Per User Limit</label>
                      <input
                        type="number"
                        value={newPromoCode.perUserLimit}
                        onChange={(e) => setNewPromoCode({...newPromoCode, perUserLimit: parseInt(e.target.value) || 0})}
                        className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Validity Period</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#A0C4B5] mb-1">Start Date</label>
                      <input
                        type="date"
                        value={newPromoCode.startDate}
                        onChange={(e) => setNewPromoCode({...newPromoCode, startDate: e.target.value})}
                        className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#A0C4B5] mb-1">End Date</label>
                      <input
                        type="date"
                        value={newPromoCode.endDate}
                        onChange={(e) => setNewPromoCode({...newPromoCode, endDate: e.target.value})}
                        className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                      />
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleAddPromoCode}
                  className="w-full px-4 py-2 bg-[#4EFF9B] text-[#0D221A] font-medium rounded-lg hover:bg-[#3ad485] transition-colors mt-4"
                >
                  Create Promo Code
                </button>
              </div>
            </div>
          </div>
          
          {/* Promo Codes List */}
          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-6">Existing Promo Codes</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[#A0C4B5]">
                    <th className="pb-4">Code</th>
                    <th className="pb-4">Discount</th>
                    <th className="pb-4">Applicable On</th>
                    <th className="pb-4">Valid From/To</th>
                    <th className="pb-4">Usage</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {promoCodes.map(promo => (
                    <tr key={promo.id} className="border-t border-[#112C23]">
                      <td className="py-4 font-medium">{promo.code}</td>
                      <td className="py-4">
                        {promo.discountType === 'percentage' && `${promo.discountValue}% off`}
                        {promo.discountType === 'fixed' && `₹${promo.discountValue} off`}
                        {promo.discountType === 'bonus' && `+${promo.discountValue} points`}
                      </td>
                      <td className="py-4">{promo.applicableOn}</td>
                      <td className="py-4">
                        <div>{promo.startDate}</div>
                        <div className="text-xs text-[#A0C4B5]">to {promo.endDate}</div>
                      </td>
                      <td className="py-4">
                        <div>{promo.totalUses} / {promo.usageLimit}</div>
                        <div className="text-xs text-[#A0C4B5]">{promo.perUserLimit} per user</div>
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          promo.status === 'active' 
                            ? 'bg-green-900/50 text-green-400' 
                            : promo.status === 'expired' 
                              ? 'bg-gray-900/50 text-gray-400' 
                              : 'bg-red-900/50 text-red-400'
                        }`}>
                          {promo.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 text-sm bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors">
                            Edit
                          </button>
                          <button className="px-3 py-1 text-sm bg-red-900/50 hover:bg-red-900/70 text-red-400 rounded-lg transition-colors">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Payment Gateways Tab */}
      {activeTab === 'gateways' && (
        <div className="space-y-6">
          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-6">Payment Gateway Configuration</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Razorpay */}
              <div className="bg-[#112C23] rounded-xl p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">Razorpay</h3>
                    <p className="text-[#A0C4B5] text-sm">India (UPI, Card, Netbanking)</p>
                  </div>
                  <span className="px-2 py-1 bg-green-900/50 text-green-400 text-xs rounded-full">
                    Active
                  </span>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-xs text-[#A0C4B5] mb-1">Key ID</label>
                    <input
                      type="text"
                      defaultValue="rzp_live_XXXXXXXXXXXX"
                      className="w-full px-3 py-2 bg-[#15362B] border border-[#4EFF9B]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#A0C4B5] mb-1">Secret Key</label>
                    <input
                      type="password"
                      defaultValue="XXXXXXXXXXXXXXXXXXXXXXXX"
                      className="w-full px-3 py-2 bg-[#15362B] border border-[#4EFF9B]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                    />
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="razorpay-test"
                      className="rounded bg-[#15362B] border-[#4EFF9B]/20 mr-2"
                      defaultChecked
                    />
                    <label htmlFor="razorpay-test" className="text-sm">Test Mode</label>
                  </div>
                  <button className="px-3 py-1 bg-[#15362B] hover:bg-[#4EFF9B]/20 rounded-lg text-sm transition-colors">
                    Test Connection
                  </button>
                </div>
              </div>
              
              {/* Stripe */}
              <div className="bg-[#112C23] rounded-xl p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">Stripe</h3>
                    <p className="text-[#A0C4B5] text-sm">International</p>
                  </div>
                  <span className="px-2 py-1 bg-gray-900/50 text-gray-400 text-xs rounded-full">
                    Disabled
                  </span>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-xs text-[#A0C4B5] mb-1">Publishable Key</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-[#15362B] border border-[#4EFF9B]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#A0C4B5] mb-1">Secret Key</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 bg-[#15362B] border border-[#4EFF9B]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                    />
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="stripe-enable"
                      className="rounded bg-[#15362B] border-[#4EFF9B]/20 mr-2"
                    />
                    <label htmlFor="stripe-enable" className="text-sm">Enable</label>
                  </div>
                  <button 
                    disabled
                    className="px-3 py-1 bg-[#15362B] rounded-lg text-sm text-[#A0C4B5] cursor-not-allowed"
                  >
                    Test Connection
                  </button>
                </div>
              </div>
              
              {/* PayPal */}
              <div className="bg-[#112C23] rounded-xl p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">PayPal</h3>
                    <p className="text-[#A0C4B5] text-sm">Global</p>
                  </div>
                  <span className="px-2 py-1 bg-gray-900/50 text-gray-400 text-xs rounded-full">
                    Disabled
                  </span>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-xs text-[#A0C4B5] mb-1">Client ID</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-[#15362B] border border-[#4EFF9B]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#A0C4B5] mb-1">Secret</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 bg-[#15362B] border border-[#4EFF9B]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                    />
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="paypal-enable"
                      className="rounded bg-[#15362B] border-[#4EFF9B]/20 mr-2"
                    />
                    <label htmlFor="paypal-enable" className="text-sm">Enable</label>
                  </div>
                  <button 
                    disabled
                    className="px-3 py-1 bg-[#15362B] rounded-lg text-sm text-[#A0C4B5] cursor-not-allowed"
                  >
                    Test Connection
                  </button>
                </div>
              </div>
              
              {/* Gateway Selection */}
              <div className="bg-[#112C23] rounded-xl p-5">
                <h3 className="font-semibold text-lg mb-4">Gateway Selection</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Primary Gateway</span>
                    <select className="px-3 py-1 bg-[#15362B] border border-[#4EFF9B]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50">
                      <option>Razorpay</option>
                      <option>Stripe</option>
                      <option>PayPal</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Enable Multiple Gateways</span>
                    <input
                      type="checkbox"
                      className="rounded bg-[#15362B] border-[#4EFF9B]/20"
                    />
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-sm text-[#A0C4B5]">
                      Users will be able to choose their preferred payment method at checkout
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Detail Modal */}
      {showTransactionDetail && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Transaction Details</h2>
              <button 
                onClick={() => setShowTransactionDetail(false)}
                className="text-[#A0C4B5] hover:text-[#E9F5EE]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[#A0C4B5] text-sm">Transaction ID</p>
                  <p className="font-medium">{selectedTransaction.id}</p>
                </div>
                <div>
                  <p className="text-[#A0C4B5] text-sm">Date & Time</p>
                  <p>{new Date(selectedTransaction.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[#A0C4B5] text-sm">User</p>
                  <p>{selectedTransaction.userName}</p>
                  <p className="text-sm text-[#A0C4B5]">{selectedTransaction.userEmail}</p>
                </div>
                <div>
                  <p className="text-[#A0C4B5] text-sm">Type</p>
                  <p className="capitalize">{selectedTransaction.type.replace('_', ' ')}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[#A0C4B5] text-sm">Amount</p>
                  <p className="text-xl font-bold">₹{selectedTransaction.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[#A0C4B5] text-sm">Points</p>
                  <p className="text-xl font-bold">{selectedTransaction.points.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[#A0C4B5] text-sm">Payment Gateway</p>
                  <p>{selectedTransaction.gateway}</p>
                </div>
                <div>
                  <p className="text-[#A0C4B5] text-sm">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedTransaction.status)}`}>
                    {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                  </span>
                </div>
              </div>
              
              {selectedTransaction.details?.packageName && (
                <div className="bg-[#112C23] rounded-xl p-4">
                  <h3 className="font-medium mb-2">Package Details</h3>
                  <p>{selectedTransaction.details.packageName}</p>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowTransactionDetail(false)}
                  className="px-4 py-2 bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors"
                >
                  Close
                </button>
                {selectedTransaction.status === 'success' && selectedTransaction.type === 'purchase' && (
                  <button
                    onClick={() => {
                      setShowTransactionDetail(false)
                      handleProcessRefund(selectedTransaction.id)
                    }}
                    className="px-4 py-2 bg-red-900/50 hover:bg-red-900/70 text-red-400 rounded-lg transition-colors"
                  >
                    Issue Refund
                  </button>
                )}
                <button className="px-4 py-2 bg-[#4EFF9B] text-[#0D221A] font-medium rounded-lg hover:bg-[#3ad485] transition-colors">
                  Resend Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal Detail Modal */}
      {showWithdrawalDetail && selectedWithdrawal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Withdrawal Request Details</h2>
              <button 
                onClick={() => setShowWithdrawalDetail(false)}
                className="text-[#A0C4B5] hover:text-[#E9F5EE]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-[#112C23] rounded-xl p-4">
                <h3 className="font-medium mb-4">Creator Information</h3>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#15362B] flex items-center justify-center mr-3">
                    {selectedWithdrawal.creator.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{selectedWithdrawal.creator.name}</p>
                    <p className="text-sm text-[#A0C4B5]">{selectedWithdrawal.creator.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[#A0C4B5] text-sm">Request Date</p>
                    <p>{selectedWithdrawal.requestDate}</p>
                  </div>
                  <div>
                    <p className="text-[#A0C4B5] text-sm">Status</p>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedWithdrawal.status)}`}>
                      {selectedWithdrawal.status.charAt(0).toUpperCase() + selectedWithdrawal.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#112C23] rounded-xl p-4">
                <h3 className="font-medium mb-4">Financial Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#A0C4B5]">Amount Requested</span>
                    <span>₹{selectedWithdrawal.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A0C4B5]">Available Balance</span>
                    <span>₹{selectedWithdrawal.availableBalance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
