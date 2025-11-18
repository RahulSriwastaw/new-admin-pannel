"use client"
import { useState } from "react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  
  // Mock settings data
  const [generalSettings, setGeneralSettings] = useState({
    appName: "Rupantar AI",
    appTagline: "Transform your imagination into reality",
    maintenanceMode: false,
    userRegistration: true,
    creatorApplications: true,
  })
  
  const [pointsSettings, setPointsSettings] = useState({
    rupeeToPointRate: 10,
    imageGenerationCost: 20,
    dailyLoginReward: 3,
    referralBonus: 25,
    adReward: 5,
    maxAdsPerDay: 5,
  })
  
  const [adsSettings, setAdsSettings] = useState({
    adsEnabled: true,
    rewardPoints: 5,
    maxAdsPerDay: 5,
    fraudDetection: true,
  })
  
  const [paymentSettings, setPaymentSettings] = useState({
    currency: "INR",
    gstRate: 18,
    platformCommission: 10,
    refundTime: 7,
  })

  const tabs = [
    { id: 'general', name: 'General' },
    { id: 'points', name: 'Points & Rewards' },
    { id: 'ads', name: 'Ads Control' },
    { id: 'payments', name: 'Payments' },
    { id: 'security', name: 'Security' },
    { id: 'admins', name: 'Admin Management' },
    { id: 'email', name: 'Email Configuration' },
    { id: 'storage', name: 'Storage' },
    { id: 'backup', name: 'Backup & Maintenance' }
  ]

  const handleSave = () => {
    // In a real app, this would save to the backend
    alert('Settings saved successfully!')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      {/* Tabs */}
      <div className="flex border-b border-[#112C23]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 font-medium ${
              activeTab === tab.id
                ? 'text-[#4EFF9B] border-b-2 border-[#4EFF9B]'
                : 'text-[#A0C4B5] hover:text-[#E9F5EE]'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-6">General Settings</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#A0C4B5] mb-2">App Name</label>
              <input
                type="text"
                value={generalSettings.appName}
                onChange={(e) => setGeneralSettings({...generalSettings, appName: e.target.value})}
                className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#A0C4B5] mb-2">App Tagline</label>
              <input
                type="text"
                value={generalSettings.appTagline}
                onChange={(e) => setGeneralSettings({...generalSettings, appTagline: e.target.value})}
                className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="maintenanceMode"
                  checked={generalSettings.maintenanceMode}
                  onChange={(e) => setGeneralSettings({...generalSettings, maintenanceMode: e.target.checked})}
                  className="w-4 h-4 text-[#4EFF9B] bg-[#112C23] border-[#4EFF9B]/20 rounded focus:ring-[#4EFF9B]/50"
                />
                <label htmlFor="maintenanceMode" className="ml-2 text-sm text-[#A0C4B5]">
                  Maintenance Mode
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="userRegistration"
                  checked={generalSettings.userRegistration}
                  onChange={(e) => setGeneralSettings({...generalSettings, userRegistration: e.target.checked})}
                  className="w-4 h-4 text-[#4EFF9B] bg-[#112C23] border-[#4EFF9B]/20 rounded focus:ring-[#4EFF9B]/50"
                />
                <label htmlFor="userRegistration" className="ml-2 text-sm text-[#A0C4B5]">
                  User Registration Enabled
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="creatorApplications"
                  checked={generalSettings.creatorApplications}
                  onChange={(e) => setGeneralSettings({...generalSettings, creatorApplications: e.target.checked})}
                  className="w-4 h-4 text-[#4EFF9B] bg-[#112C23] border-[#4EFF9B]/20 rounded focus:ring-[#4EFF9B]/50"
                />
                <label htmlFor="creatorApplications" className="ml-2 text-sm text-[#A0C4B5]">
                  Creator Applications Enabled
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Points & Rewards Settings */}
      {activeTab === 'points' && (
        <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-6">Points & Rewards System</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">₹1 = X Points</label>
                <input
                  type="number"
                  value={pointsSettings.rupeeToPointRate}
                  onChange={(e) => setPointsSettings({...pointsSettings, rupeeToPointRate: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Image Generation Cost (Points)</label>
                <input
                  type="number"
                  value={pointsSettings.imageGenerationCost}
                  onChange={(e) => setPointsSettings({...pointsSettings, imageGenerationCost: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Daily Login Reward (Points)</label>
                <input
                  type="number"
                  value={pointsSettings.dailyLoginReward}
                  onChange={(e) => setPointsSettings({...pointsSettings, dailyLoginReward: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Referral Bonus (Points)</label>
                <input
                  type="number"
                  value={pointsSettings.referralBonus}
                  onChange={(e) => setPointsSettings({...pointsSettings, referralBonus: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Ad Watch Reward (Points)</label>
                <input
                  type="number"
                  value={pointsSettings.adReward}
                  onChange={(e) => setPointsSettings({...pointsSettings, adReward: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Max Ads Per Day</label>
                <input
                  type="number"
                  value={pointsSettings.maxAdsPerDay}
                  onChange={(e) => setPointsSettings({...pointsSettings, maxAdsPerDay: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ads Control Settings */}
      {activeTab === 'ads' && (
        <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-6">Ads Control</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="adsEnabled"
                  checked={adsSettings.adsEnabled}
                  onChange={(e) => setAdsSettings({...adsSettings, adsEnabled: e.target.checked})}
                  className="w-4 h-4 text-[#4EFF9B] bg-[#112C23] border-[#4EFF9B]/20 rounded focus:ring-[#4EFF9B]/50"
                />
                <label htmlFor="adsEnabled" className="ml-2 text-sm text-[#A0C4B5]">
                  Enable Ad Rewards
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Reward Points per Ad</label>
                <input
                  type="number"
                  value={adsSettings.rewardPoints}
                  onChange={(e) => setAdsSettings({...adsSettings, rewardPoints: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Max Ads Per Day</label>
                <input
                  type="number"
                  value={adsSettings.maxAdsPerDay}
                  onChange={(e) => setAdsSettings({...adsSettings, maxAdsPerDay: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="fraudDetection"
                  checked={adsSettings.fraudDetection}
                  onChange={(e) => setAdsSettings({...adsSettings, fraudDetection: e.target.checked})}
                  className="w-4 h-4 text-[#4EFF9B] bg-[#112C23] border-[#4EFF9B]/20 rounded focus:ring-[#4EFF9B]/50"
                />
                <label htmlFor="fraudDetection" className="ml-2 text-sm text-[#A0C4B5]">
                  Enable Fraud Detection
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Settings */}
      {activeTab === 'payments' && (
        <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-6">Payment Settings</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Currency</label>
                <select
                  value={paymentSettings.currency}
                  onChange={(e) => setPaymentSettings({...paymentSettings, currency: e.target.value})}
                  className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">GST/Tax Rate (%)</label>
                <input
                  type="number"
                  value={paymentSettings.gstRate}
                  onChange={(e) => setPaymentSettings({...paymentSettings, gstRate: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Platform Commission (%)</label>
                <input
                  type="number"
                  value={paymentSettings.platformCommission}
                  onChange={(e) => setPaymentSettings({...paymentSettings, platformCommission: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Refund Time (Days)</label>
                <input
                  type="number"
                  value={paymentSettings.refundTime}
                  onChange={(e) => setPaymentSettings({...paymentSettings, refundTime: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Session Timeout (Minutes)</label>
                <input
                  type="number"
                  defaultValue="30"
                  className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Password Expiry (Days)</label>
                <input
                  type="number"
                  defaultValue="90"
                  className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="2faRequired"
                  defaultChecked
                  className="w-4 h-4 text-[#4EFF9B] bg-[#112C23] border-[#4EFF9B]/20 rounded focus:ring-[#4EFF9B]/50"
                />
                <label htmlFor="2faRequired" className="ml-2 text-sm text-[#A0C4B5]">
                  Require 2FA for All Admins
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="ipWhitelist"
                  className="w-4 h-4 text-[#4EFF9B] bg-[#112C23] border-[#4EFF9B]/20 rounded focus:ring-[#4EFF9B]/50"
                />
                <label htmlFor="ipWhitelist" className="ml-2 text-sm text-[#A0C4B5]">
                  Enable IP Whitelisting
                </label>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-[#E9F5EE] mb-4">IP Whitelist</h3>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Enter IP address"
                  className="flex-1 px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                />
                <button className="px-4 py-2 bg-[#4EFF9B] text-[#0D221A] font-medium rounded-r-lg hover:bg-[#3ad485] transition-colors">
                  Add IP
                </button>
              </div>
              <div className="mt-2 text-sm text-[#A0C4B5]">
                Current IPs: 192.168.1.1, 10.0.0.1
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Management Settings */}
      {activeTab === 'admins' && (
        <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-6">Admin Management</h2>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-[#E9F5EE]">Admin Users</h3>
              <button className="px-4 py-2 bg-[#4EFF9B] text-[#0D221A] font-medium rounded-lg hover:bg-[#3ad485] transition-colors">
                Add New Admin
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[#A0C4B5]">
                    <th className="pb-4">Admin</th>
                    <th className="pb-4">Email</th>
                    <th className="pb-4">Role</th>
                    <th className="pb-4">Last Active</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-[#112C23]">
                    <td className="py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-[#112C23] flex items-center justify-center mr-3">
                          A
                        </div>
                        <div>
                          <div className="font-medium">Admin User</div>
                          <div className="text-xs text-[#A0C4B5]">You</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">admin@rupantara.ai</td>
                    <td className="py-4">
                      <span className="px-2 py-1 bg-[#4EFF9B]/20 text-[#4EFF9B] text-xs rounded-full">
                        Super Admin
                      </span>
                    </td>
                    <td className="py-4">Just now</td>
                    <td className="py-4">
                      <span className="px-2 py-1 bg-green-900/50 text-green-400 text-xs rounded-full">
                        Active
                      </span>
                    </td>
                    <td className="py-4">
                      <button className="px-3 py-1 text-sm bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors">
                        Edit
                      </button>
                    </td>
                  </tr>
                  <tr className="border-t border-[#112C23]">
                    <td className="py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-[#112C23] flex items-center justify-center mr-3">
                          M
                        </div>
                        <div>
                          <div className="font-medium">Moderator User</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">moderator@rupantara.ai</td>
                    <td className="py-4">
                      <span className="px-2 py-1 bg-blue-900/50 text-blue-400 text-xs rounded-full">
                        Moderator
                      </span>
                    </td>
                    <td className="py-4">2 hours ago</td>
                    <td className="py-4">
                      <span className="px-2 py-1 bg-green-900/50 text-green-400 text-xs rounded-full">
                        Active
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 text-sm bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors">
                          Edit
                        </button>
                        <button className="px-3 py-1 text-sm bg-red-900/50 hover:bg-red-900/70 text-red-400 rounded-lg transition-colors">
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="pt-6">
              <h3 className="text-lg font-medium text-[#E9F5EE] mb-4">2FA Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="require2FA"
                    defaultChecked
                    className="w-4 h-4 text-[#4EFF9B] bg-[#112C23] border-[#4EFF9B]/20 rounded focus:ring-[#4EFF9B]/50"
                  />
                  <label htmlFor="require2FA" className="ml-2 text-sm text-[#A0C4B5]">
                    Require 2FA for All Admins
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#A0C4B5] mb-2">2FA Method</label>
                  <select className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50">
                    <option>Google Authenticator</option>
                    <option>SMS</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="pt-6">
              <h3 className="text-lg font-medium text-[#E9F5EE] mb-4">Activity Audit Log</h3>
              <div className="bg-[#112C23] rounded-lg p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#A0C4B5]">Jun 15, 2023 14:30</span>
                  <span className="text-[#E9F5EE]">Admin User</span>
                </div>
                <p className="text-[#4EFF9B]">Updated AI Configuration - Gemini model activated</p>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-[#A0C4B5]">IP: 192.168.1.100</span>
                  <span className="text-[#A0C4B5]">Success</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Configuration */}
      {activeTab === 'email' && (
        <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-6">Email Configuration</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">SMTP Host</label>
                <input
                  type="text"
                  defaultValue="smtp.gmail.com"
                  className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">SMTP Port</label>
                <input
                  type="number"
                  defaultValue="587"
                  className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Username</label>
                <input
                  type="text"
                  defaultValue="admin@rupantara.ai"
                  className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Password</label>
                <input
                  type="password"
                  defaultValue="••••••••"
                  className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">From Email</label>
                <input
                  type="email"
                  defaultValue="noreply@rupantara.ai"
                  className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">From Name</label>
                <input
                  type="text"
                  defaultValue="Rupantar AI"
                  className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors">
                Test Connection
              </button>
              <button className="px-4 py-2 bg-[#4EFF9B] text-[#0D221A] font-medium rounded-lg hover:bg-[#3ad485] transition-colors">
                Save Configuration
              </button>
            </div>
            
            <div className="pt-6">
              <h3 className="text-lg font-medium text-[#E9F5EE] mb-4">Email Templates</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <EmailTemplateCard 
                  title="Welcome Email" 
                  description="Sent to new users after registration"
                />
                <EmailTemplateCard 
                  title="Payment Confirmation" 
                  description="Sent after successful payments"
                />
                <EmailTemplateCard 
                  title="Password Reset" 
                  description="Sent when users request password reset"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Storage Configuration */}
      {activeTab === 'storage' && (
        <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-6">Storage Configuration</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Storage Provider</label>
                <select className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50">
                  <option>Cloudinary</option>
                  <option>AWS S3</option>
                  <option>Google Cloud Storage</option>
                  <option>Azure Blob Storage</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Bucket Name</label>
                <input
                  type="text"
                  defaultValue="rupantara-ai-storage"
                  className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Access Key ID</label>
                <input
                  type="password"
                  defaultValue="••••••••"
                  className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Secret Access Key</label>
                <input
                  type="password"
                  defaultValue="••••••••"
                  className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                />
              </div>
            </div>
            
            <div className="pt-6">
              <h3 className="text-lg font-medium text-[#E9F5EE] mb-4">Storage Usage</h3>
              <div className="bg-[#112C23] rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-[#A0C4B5]">Storage Used</span>
                  <span className="text-[#E9F5EE]">45.2 GB of 100 GB</span>
                </div>
                <div className="w-full bg-[#15362B] rounded-full h-2">
                  <div className="bg-[#4EFF9B] h-2 rounded-full" style={{ width: '45.2%' }}></div>
                </div>
                <div className="flex justify-between mt-4">
                  <div>
                    <p className="text-[#A0C4B5] text-sm">User Uploads</p>
                    <p className="text-[#E9F5EE]">22.5 GB</p>
                  </div>
                  <div>
                    <p className="text-[#A0C4B5] text-sm">Generated Images</p>
                    <p className="text-[#E9F5EE]">18.3 GB</p>
                  </div>
                  <div>
                    <p className="text-[#A0C4B5] text-sm">Creator Demos</p>
                    <p className="text-[#E9F5EE]">4.4 GB</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <button className="px-4 py-2 bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors">
                Test Connection
              </button>
              <button className="px-4 py-2 bg-[#4EFF9B] text-[#0D221A] font-medium rounded-lg hover:bg-[#3ad485] transition-colors">
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backup & Maintenance */}
      {activeTab === 'backup' && (
        <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-6">Backup & Maintenance</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#112C23] rounded-xl p-5">
                <h3 className="font-semibold text-lg mb-4">Automatic Backups</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="autoBackup"
                      defaultChecked
                      className="w-4 h-4 text-[#4EFF9B] bg-[#112C23] border-[#4EFF9B]/20 rounded focus:ring-[#4EFF9B]/50"
                    />
                    <label htmlFor="autoBackup" className="ml-2 text-sm text-[#A0C4B5]">
                      Enable Automatic Backups
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Backup Frequency</label>
                    <select className="w-full px-4 py-2 bg-[#15362B] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50">
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Backup Time</label>
                    <input
                      type="time"
                      defaultValue="02:00"
                      className="w-full px-4 py-2 bg-[#15362B] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Retention Period</label>
                    <select className="w-full px-4 py-2 bg-[#15362B] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50">
                      <option>7 days</option>
                      <option>30 days</option>
                      <option>90 days</option>
                      <option>1 year</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#112C23] rounded-xl p-5">
                <h3 className="font-semibold text-lg mb-4">Maintenance Mode</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="maintenanceMode"
                      className="w-4 h-4 text-[#4EFF9B] bg-[#112C23] border-[#4EFF9B]/20 rounded focus:ring-[#4EFF9B]/50"
                    />
                    <label htmlFor="maintenanceMode" className="ml-2 text-sm text-[#A0C4B5]">
                      Enable Maintenance Mode
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Maintenance Message</label>
                    <textarea
                      rows={3}
                      defaultValue="We're currently performing scheduled maintenance. We'll be back shortly."
                      className="w-full px-4 py-2 bg-[#15362B] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Estimated Downtime</label>
                    <input
                      type="text"
                      defaultValue="2 hours"
                      className="w-full px-4 py-2 bg-[#15362B] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-6">
              <h3 className="text-lg font-medium text-[#E9F5EE] mb-4">Manual Backup</h3>
              <div className="bg-[#112C23] rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Create Database Backup</p>
                    <p className="text-sm text-[#A0C4B5]">Backup all data including users, templates, and transactions</p>
                  </div>
                  <button className="px-4 py-2 bg-[#4EFF9B] text-[#0D221A] font-medium rounded-lg hover:bg-[#3ad485] transition-colors">
                    Backup Now
                  </button>
                </div>
              </div>
            </div>
            
            <div className="pt-6">
              <h3 className="text-lg font-medium text-[#E9F5EE] mb-4">Available Backups</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[#A0C4B5]">
                      <th className="pb-4">Backup Date</th>
                      <th className="pb-4">Size</th>
                      <th className="pb-4">Status</th>
                      <th className="pb-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-[#112C23]">
                      <td className="py-4">Jun 15, 2023 02:00</td>
                      <td className="py-4">2.4 GB</td>
                      <td className="py-4">
                        <span className="px-2 py-1 bg-green-900/50 text-green-400 text-xs rounded-full">
                          Completed
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 text-sm bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors">
                            Download
                          </button>
                          <button className="px-3 py-1 text-sm bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors">
                            Restore
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-t border-[#112C23]">
                      <td className="py-4">Jun 14, 2023 02:00</td>
                      <td className="py-4">2.3 GB</td>
                      <td className="py-4">
                        <span className="px-2 py-1 bg-green-900/50 text-green-400 text-xs rounded-full">
                          Completed
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 text-sm bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors">
                            Download
                          </button>
                          <button className="px-3 py-1 text-sm bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors">
                            Restore
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-[#4EFF9B] text-[#0D221A] font-medium rounded-lg hover:bg-[#3ad485] transition-colors"
        >
          Save Settings
        </button>
      </div>
    </div>
  )
}

function EmailTemplateCard({ title, description }: { 
  title: string, 
  description: string 
}) {
  return (
    <div className="bg-[#112C23] rounded-xl p-4 hover:bg-[#112C23]/80 transition-colors">
      <h4 className="font-medium mb-2">{title}</h4>
      <p className="text-[#A0C4B5] text-sm mb-3">{description}</p>
      <button className="text-[#4EFF9B] text-sm font-medium hover:underline">
        Edit Template
      </button>
    </div>
  )
}
