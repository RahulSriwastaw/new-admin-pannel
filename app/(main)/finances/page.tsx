"use client"
import { useState } from "react"

export default function FinancesPage() {
  const [activeTab, setActiveTab] = useState('transactions')
  
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

      <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
        <h2 className="text-xl font-semibold mb-4">Finances Management</h2>
        <p className="text-[#A0C4B5]">
          Manage all financial aspects of the platform including transactions, points, withdrawals, and payment gateways.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <div className="bg-[#112C23] rounded-xl p-4">
            <h3 className="font-medium text-[#4EFF9B] mb-2">Total Revenue</h3>
            <p className="text-2xl font-bold">₹2,45,600</p>
            <p className="text-sm text-green-400 mt-1">↑ 24.7% from last month</p>
          </div>
          <div className="bg-[#112C23] rounded-xl p-4">
            <h3 className="font-medium text-[#4EFF9B] mb-2">Pending Withdrawals</h3>
            <p className="text-2xl font-bold">₹12,500</p>
            <p className="text-sm text-yellow-400 mt-1">3 requests pending</p>
          </div>
          <div className="bg-[#112C23] rounded-xl p-4">
            <h3 className="font-medium text-[#4EFF9B] mb-2">Active Points Packages</h3>
            <p className="text-2xl font-bold">8</p>
            <p className="text-sm text-[#A0C4B5] mt-1">3 popular packages</p>
          </div>
          <div className="bg-[#112C23] rounded-xl p-4">
            <h3 className="font-medium text-[#4EFF9B] mb-2">Active Promo Codes</h3>
            <p className="text-2xl font-bold">12</p>
            <p className="text-sm text-[#A0C4B5] mt-1">2 expiring soon</p>
          </div>
        </div>
      </div>

      <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#112C23] rounded-lg">
            <div>
              <p className="font-medium">Withdrawal Request Approved</p>
              <p className="text-sm text-[#A0C4B5]">₹5,000 transferred to Jane Artist</p>
            </div>
            <span className="text-sm text-[#4EFF9B]">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-[#112C23] rounded-lg">
            <div>
              <p className="font-medium">New Points Package Created</p>
              <p className="text-sm text-[#A0C4B5]">Premium Package - ₹199 for 1500 points</p>
            </div>
            <span className="text-sm text-[#4EFF9B]">1 day ago</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-[#112C23] rounded-lg">
            <div>
              <p className="font-medium">Promo Code Activated</p>
              <p className="text-sm text-[#A0C4B5]">SUMMER20 - 20% off all packages</p>
            </div>
            <span className="text-sm text-[#4EFF9B]">2 days ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}