"use client"
import { useEffect, useState } from "react"
import { adminUsersApi } from "@/services/api"

type User = {
  _id: string
  name: string
  email: string
  phone?: string
  role?: string
  points?: number
  registrationDate?: string
  lastActivity?: string
  status?: string
  avatar?: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [pointsInput, setPointsInput] = useState<Record<string, string>>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("registrationDate")
  const [sortOrder, setSortOrder] = useState("desc")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(10)
  const [showUserDetail, setShowUserDetail] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState("profile")

  useEffect(() => {
    adminUsersApi.list().then(setUsers).catch(e => setError(e?.message || "Failed to load users"))
  }, [])

  useEffect(() => {
    let result = [...users]
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user._id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Apply role filter
    if (roleFilter !== "all") {
      result = result.filter(user => (user.role || "user") === roleFilter)
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(user => (user.status || "active") === statusFilter)
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let aValue, bValue
      switch (sortBy) {
        case "registrationDate":
          aValue = new Date(a.registrationDate || "").getTime()
          bValue = new Date(b.registrationDate || "").getTime()
          break
        case "points":
          aValue = a.points || 0
          bValue = b.points || 0
          break
        case "lastActivity":
          aValue = new Date(a.lastActivity || "").getTime()
          bValue = new Date(b.lastActivity || "").getTime()
          break
        default:
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
    
    setFilteredUsers(result)
  }, [users, searchTerm, roleFilter, statusFilter, sortBy, sortOrder])

  const refresh = () => adminUsersApi.list().then(setUsers)
  const act = async (id: string, fn: () => Promise<any>) => {
    setLoadingId(id)
    try { await fn(); await refresh() } catch (e: any) { setError(e?.message || 'Action failed') } finally { setLoadingId(null) }
  }

  const handleSelectUser = (id: string) => {
    setSelectedUsers(prev => 
      prev.includes(id) 
        ? prev.filter(userId => userId !== id) 
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map(user => user._id))
    }
  }

  const handleBulkAction = async (action: string) => {
    // In a real implementation, this would handle bulk actions
    alert(`Bulk action ${action} performed on ${selectedUsers.length} users`)
    setSelectedUsers([])
  }

  const handleViewUser = (user: User) => {
    setShowUserDetail(user)
    setActiveTab("profile")
  }

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors">
            Export Users
          </button>
          <button className="px-4 py-2 bg-[#4EFF9B] text-[#0D221A] font-medium rounded-lg hover:bg-[#3ad485] transition-colors">
            Add User
          </button>
        </div>
      </div>
      
      {error && <p className="text-red-400">{error}</p>}
      
      {/* Filters and Search */}
      <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Search</label>
            <input
              type="text"
              placeholder="Name, Email, User ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Role</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
            >
              <option value="all">All Roles</option>
              <option value="user">Regular Users</option>
              <option value="creator">Creators</option>
              <option value="admin">Admins</option>
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="banned">Banned</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Sort By</label>
            <div className="flex space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
              >
                <option value="registrationDate">Registration Date</option>
                <option value="points">Points Balance</option>
                <option value="lastActivity">Last Activity</option>
                <option value="name">Name</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="px-3 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bg-[#15362B] rounded-2xl p-4 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="text-[#A0C4B5]">
              {selectedUsers.length} user(s) selected
            </div>
            <div className="flex space-x-2">
              <select className="px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50">
                <option>Bulk Actions</option>
                <option>Send Notification</option>
                <option>Export Selected</option>
                <option>Change Status</option>
                <option>Add Points</option>
                <option>Delete Selected</option>
              </select>
              <button 
                onClick={() => handleBulkAction("execute")}
                className="px-4 py-2 bg-[#4EFF9B] text-[#0D221A] font-medium rounded-lg hover:bg-[#3ad485] transition-colors"
              >
                Execute
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Users Table */}
      <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#A0C4B5]">
                <th className="pb-4 w-12">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === currentUsers.length && currentUsers.length > 0}
                    onChange={handleSelectAll}
                    className="rounded bg-[#112C23] border-[#4EFF9B]/20"
                  />
                </th>
                <th className="pb-4">User</th>
                <th className="pb-4">Contact</th>
                <th className="pb-4">Role</th>
                <th className="pb-4">Points</th>
                <th className="pb-4">Registration</th>
                <th className="pb-4">Last Activity</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-[#A0C4B5]">
                    No users found
                  </td>
                </tr>
              ) : (
                currentUsers.map(u => (
                  <tr key={u._id} className="border-t border-[#112C23]">
                    <td className="py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(u._id)}
                        onChange={() => handleSelectUser(u._id)}
                        className="rounded bg-[#112C23] border-[#4EFF9B]/20"
                      />
                    </td>
                    <td className="py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-[#112C23] flex items-center justify-center mr-3">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{u.name}</div>
                          <div className="text-xs text-[#A0C4B5]">{u._id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div>{u.email}</div>
                      <div className="text-xs text-[#A0C4B5]">{u.phone || "N/A"}</div>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        u.role === "admin" ? "bg-purple-900/50 text-purple-400" :
                        u.role === "creator" ? "bg-blue-900/50 text-blue-400" :
                        "bg-gray-900/50 text-gray-400"
                      }`}>
                        {u.role || "user"}
                      </span>
                    </td>
                    <td className="py-4">{u.points ?? 0}</td>
                    <td className="py-4">
                      {u.registrationDate ? new Date(u.registrationDate).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="py-4">
                      {u.lastActivity ? new Date(u.lastActivity).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        u.status === "banned" ? "bg-red-900/50 text-red-400" :
                        u.status === "inactive" ? "bg-yellow-900/50 text-yellow-400" :
                        "bg-green-900/50 text-green-400"
                      }`}>
                        {u.status || "active"}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewUser(u)}
                          className="px-3 py-1 text-sm bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors"
                        >
                          View
                        </button>
                        <button className="px-3 py-1 text-sm bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors">
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#112C23]">
            <div className="text-[#A0C4B5] text-sm">
              Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-lg ${currentPage === 1 ? 'bg-[#112C23] text-[#A0C4B5]' : 'bg-[#112C23] hover:bg-[#4EFF9B]/20'}`}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-lg ${
                    currentPage === i + 1 
                      ? 'bg-[#4EFF9B] text-[#0D221A]' 
                      : 'bg-[#112C23] hover:bg-[#4EFF9B]/20'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-lg ${currentPage === totalPages ? 'bg-[#112C23] text-[#A0C4B5]' : 'bg-[#112C23] hover:bg-[#4EFF9B]/20'}`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* User Detail Modal */}
      {showUserDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">User Details</h2>
              <button 
                onClick={() => setShowUserDetail(null)}
                className="text-[#A0C4B5] hover:text-[#E9F5EE]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* User Header */}
            <div className="flex items-center mb-6 p-4 bg-[#112C23] rounded-xl">
              <div className="w-16 h-16 rounded-full bg-[#4EFF9B] text-[#0D221A] flex items-center justify-center text-2xl font-bold mr-4">
                {showUserDetail.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{showUserDetail.name}</h3>
                <p className="text-[#A0C4B5]">{showUserDetail.email}</p>
                <div className="flex space-x-2 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    showUserDetail.role === "admin" ? "bg-purple-900/50 text-purple-400" :
                    showUserDetail.role === "creator" ? "bg-blue-900/50 text-blue-400" :
                    "bg-gray-900/50 text-gray-400"
                  }`}>
                    {showUserDetail.role || "user"}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    showUserDetail.status === "banned" ? "bg-red-900/50 text-red-400" :
                    showUserDetail.status === "inactive" ? "bg-yellow-900/50 text-yellow-400" :
                    "bg-green-900/50 text-green-400"
                  }`}>
                    {showUserDetail.status || "active"}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-[#112C23] mb-6">
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "profile"
                    ? "text-[#4EFF9B] border-b-2 border-[#4EFF9B]"
                    : "text-[#A0C4B5] hover:text-[#E9F5EE]"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                Profile
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "activity"
                    ? "text-[#4EFF9B] border-b-2 border-[#4EFF9B]"
                    : "text-[#A0C4B5] hover:text-[#E9F5EE]"
                }`}
                onClick={() => setActiveTab("activity")}
              >
                Activity
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "transactions"
                    ? "text-[#4EFF9B] border-b-2 border-[#4EFF9B]"
                    : "text-[#A0C4B5] hover:text-[#E9F5EE]"
                }`}
                onClick={() => setActiveTab("transactions")}
              >
                Transactions
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "content"
                    ? "text-[#4EFF9B] border-b-2 border-[#4EFF9B]"
                    : "text-[#A0C4B5] hover:text-[#E9F5EE]"
                }`}
                onClick={() => setActiveTab("content")}
              >
                Content
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "actions"
                    ? "text-[#4EFF9B] border-b-2 border-[#4EFF9B]"
                    : "text-[#A0C4B5] hover:text-[#E9F5EE]"
                }`}
                onClick={() => setActiveTab("actions")}
              >
                Actions
              </button>
            </div>
            
            {/* Tab Content */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#112C23] rounded-xl p-4">
                    <h4 className="font-medium mb-4">Personal Information</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[#A0C4B5] text-sm">Full Name</p>
                        <p>{showUserDetail.name}</p>
                      </div>
                      <div>
                        <p className="text-[#A0C4B5] text-sm">Email</p>
                        <p>{showUserDetail.email}</p>
                      </div>
                      <div>
                        <p className="text-[#A0C4B5] text-sm">Phone</p>
                        <p>{showUserDetail.phone || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-[#112C23] rounded-xl p-4">
                    <h4 className="font-medium mb-4">Account Information</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[#A0C4B5] text-sm">Account ID</p>
                        <p>{showUserDetail._id}</p>
                      </div>
                      <div>
                        <p className="text-[#A0C4B5] text-sm">Registration Date</p>
                        <p>{showUserDetail.registrationDate ? new Date(showUserDetail.registrationDate).toLocaleString() : "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-[#A0C4B5] text-sm">Last Login</p>
                        <p>{showUserDetail.lastActivity ? new Date(showUserDetail.lastActivity).toLocaleString() : "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-[#A0C4B5] text-sm">Points Balance</p>
                        <p>{showUserDetail.points ?? 0} points</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button className="px-4 py-2 bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors">
                    Edit Profile
                  </button>
                  <button className="px-4 py-2 bg-[#4EFF9B] text-[#0D221A] font-medium rounded-lg hover:bg-[#3ad485] transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === "activity" && (
              <div className="space-y-4">
                <div className="bg-[#112C23] rounded-xl p-4">
                  <h4 className="font-medium mb-4">Recent Activity</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Image generation completed</span>
                      <span className="text-[#A0C4B5]">2 hours ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Points purchased: 300 points</span>
                      <span className="text-[#A0C4B5]">1 day ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Logged in from new device</span>
                      <span className="text-[#A0C4B5]">2 days ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Template used: Landscape Portrait</span>
                      <span className="text-[#A0C4B5]">3 days ago</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#112C23] rounded-xl p-4">
                    <h4 className="font-medium mb-4">Usage Statistics</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[#A0C4B5] text-sm">Total Generations</p>
                        <p>142</p>
                      </div>
                      <div>
                        <p className="text-[#A0C4B5] text-sm">Most Used Template</p>
                        <p>Portrait Pro</p>
                      </div>
                      <div>
                        <p className="text-[#A0C4B5] text-sm">Referral Count</p>
                        <p>3 users</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-[#112C23] rounded-xl p-4">
                    <h4 className="font-medium mb-4">Device Information</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[#A0C4B5] text-sm">Last Device</p>
                        <p>iPhone 14 Pro</p>
                      </div>
                      <div>
                        <p className="text-[#A0C4B5] text-sm">Last IP</p>
                        <p>192.168.1.100</p>
                      </div>
                      <div>
                        <p className="text-[#A0C4B5] text-sm">Location</p>
                        <p>New Delhi, India</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "transactions" && (
              <div className="space-y-4">
                <div className="bg-[#112C23] rounded-xl p-4">
                  <h4 className="font-medium mb-4">Points Transaction History</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-[#A0C4B5]">
                          <th className="pb-2">Date</th>
                          <th className="pb-2">Type</th>
                          <th className="pb-2">Amount</th>
                          <th className="pb-2">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t border-[#112C23]">
                          <td className="py-2">2023-06-15</td>
                          <td className="py-2">Purchase</td>
                          <td className="py-2 text-green-400">+300</td>
                          <td className="py-2">1,250</td>
                        </tr>
                        <tr className="border-t border-[#112C23]">
                          <td className="py-2">2023-06-14</td>
                          <td className="py-2">Generation</td>
                          <td className="py-2 text-red-400">-20</td>
                          <td className="py-2">950</td>
                        </tr>
                        <tr className="border-t border-[#112C23]">
                          <td className="py-2">2023-06-12</td>
                          <td className="py-2">Referral Bonus</td>
                          <td className="py-2 text-green-400">+25</td>
                          <td className="py-2">970</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button className="px-4 py-2 bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors">
                    Export Transaction History
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === "content" && (
              <div className="space-y-4">
                <div className="bg-[#112C23] rounded-xl p-4">
                  <h4 className="font-medium mb-4">Generated Content</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="relative group">
                        <div className="bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg h-32 flex items-center justify-center">
                          <span className="text-[#A0C4B5]">Image {i}</span>
                        </div>
                        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="px-3 py-1 bg-[#4EFF9B] text-[#0D221A] text-sm rounded">
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-[#112C23] rounded-xl p-4">
                  <h4 className="font-medium mb-4">Flagged Content</h4>
                  <p className="text-[#A0C4B5]">No flagged content found</p>
                </div>
              </div>
            )}
            
            {activeTab === "actions" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#112C23] rounded-xl p-4">
                    <h4 className="font-medium mb-4">Adjust Points</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-[#A0C4B5] mb-2">Points to Add/Deduct</label>
                        <input
                          type="number"
                          className="w-full px-4 py-2 bg-[#15362B] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                          placeholder="Enter points"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#A0C4B5] mb-2">Reason</label>
                        <textarea
                          className="w-full px-4 py-2 bg-[#15362B] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                          placeholder="Enter reason for adjustment"
                          rows={3}
                        ></textarea>
                      </div>
                      <button className="w-full px-4 py-2 bg-[#4EFF9B] text-[#0D221A] font-medium rounded-lg hover:bg-[#3ad485] transition-colors">
                        Adjust Points
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-[#112C23] rounded-xl p-4">
                    <h4 className="font-medium mb-4">Send Notification</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-[#A0C4B5] mb-2">Subject</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 bg-[#15362B] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                          placeholder="Enter subject"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#A0C4B5] mb-2">Message</label>
                        <textarea
                          className="w-full px-4 py-2 bg-[#15362B] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                          placeholder="Enter message"
                          rows={3}
                        ></textarea>
                      </div>
                      <div className="flex space-x-2">
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded bg-[#15362B] border-[#4EFF9B]/20 mr-2" />
                          <span className="text-sm">Email</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded bg-[#15362B] border-[#4EFF9B]/20 mr-2" defaultChecked />
                          <span className="text-sm">In-App</span>
                        </label>
                      </div>
                      <button className="w-full px-4 py-2 bg-[#4EFF9B] text-[#0D221A] font-medium rounded-lg hover:bg-[#3ad485] transition-colors">
                        Send Notification
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#112C23] rounded-xl p-4">
                  <h4 className="font-medium mb-4">Account Actions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="px-4 py-3 bg-[#15362B] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors text-left">
                      <div className="font-medium">Reset Password</div>
                      <div className="text-sm text-[#A0C4B5] mt-1">Send password reset email</div>
                    </button>
                    <button className="px-4 py-3 bg-[#15362B] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors text-left">
                      <div className="font-medium">Verify Email/Phone</div>
                      <div className="text-sm text-[#A0C4B5] mt-1">Mark as verified</div>
                    </button>
                    <button className="px-4 py-3 bg-[#15362B] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors text-left">
                      <div className="font-medium">Change Role</div>
                      <div className="text-sm text-[#A0C4B5] mt-1">Change user role</div>
                    </button>
                    <button className="px-4 py-3 bg-[#15362B] hover:bg-yellow-900/20 rounded-lg transition-colors text-left">
                      <div className="font-medium text-yellow-400">Suspend Account</div>
                      <div className="text-sm text-[#A0C4B5] mt-1">Temporarily disable account</div>
                    </button>
                    <button className="px-4 py-3 bg-[#15362B] hover:bg-red-900/20 rounded-lg transition-colors text-left">
                      <div className="font-medium text-red-400">Ban Account</div>
                      <div className="text-sm text-[#A0C4B5] mt-1">Permanently ban user</div>
                    </button>
                    <button className="px-4 py-3 bg-[#15362B] hover:bg-red-900/20 rounded-lg transition-colors text-left">
                      <div className="font-medium text-red-400">Delete Account</div>
                      <div className="text-sm text-[#A0C4B5] mt-1">Permanently delete account</div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}