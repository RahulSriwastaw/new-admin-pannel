"use client"
import { useState } from "react"

type FlaggedContent = {
  id: string
  contentType: 'prompt' | 'image' | 'template'
  thumbnail: string
  user: {
    id: string
    name: string
    email: string
  }
  flaggedReason: string
  aiScores: {
    nsfw: number
    violence: number
    hateSpeech: number
    overallRisk: 'low' | 'medium' | 'high' | 'critical'
  }
  flaggedDate: string
  status: 'pending' | 'reviewed' | 'approved' | 'blocked'
}

type UserReport = {
  id: string
  contentPreview: string
  reportedBy: {
    id: string
    name: string
    email: string
  }
  reportReason: string
  additionalComments: string
  reportDate: string
  contentCreator: {
    id: string
    name: string
    email: string
  }
  status: 'pending' | 'reviewed' | 'actioned'
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

type BannedKeyword = {
  id: string
  keyword: string
  category: 'nsfw' | 'violence' | 'drugs' | 'hateSpeech' | 'childSafety' | 'illegalActivities'
  severity: 'low' | 'medium' | 'high' | 'critical'
  action: 'auto-block' | 'flag' | 'warning'
  timesDetected: number
  lastDetected: string
}

type UserStrike = {
  id: string
  user: {
    id: string
    name: string
    email: string
  }
  violationType: string
  violationDescription: string
  dateIssued: string
  issuedBy: string
  actionTaken: string
  expiryDate?: string
  userStatus: string
}

type ModerationLog = {
  id: string
  date: string
  admin: string
  actionType: string
  contentAffected: string
  reason: string
  outcome: string
}

export default function ModerationPage() {
  const [activeTab, setActiveTab] = useState('flagged')
  const [searchTerm, setSearchTerm] = useState("")
  const [flaggedContent, setFlaggedContent] = useState<FlaggedContent[]>([])
  const [userReports, setUserReports] = useState<UserReport[]>([])
  const [bannedKeywords, setBannedKeywords] = useState<BannedKeyword[]>([])
  const [userStrikes, setUserStrikes] = useState<UserStrike[]>([])
  const [moderationLogs, setModerationLogs] = useState<ModerationLog[]>([])
  const [selectedContent, setSelectedContent] = useState<FlaggedContent | null>(null)
  const [selectedReport, setSelectedReport] = useState<UserReport | null>(null)
  const [showContentDetail, setShowContentDetail] = useState(false)
  const [showReportDetail, setShowReportDetail] = useState(false)
  const [newKeyword, setNewKeyword] = useState({
    keyword: '',
    category: 'nsfw',
    severity: 'medium',
    action: 'flag'
  })

  // Initialize with mock data
  useState(() => {
    // Mock flagged content
    setFlaggedContent([
      {
        id: 'FLAG-001',
        contentType: 'image',
        thumbnail: '',
        user: {
          id: 'USER-001',
          name: 'John Doe',
          email: 'john@example.com'
        },
        flaggedReason: 'NSFW content detected',
        aiScores: {
          nsfw: 0.95,
          violence: 0.1,
          hateSpeech: 0.05,
          overallRisk: 'high'
        },
        flaggedDate: '2023-06-15',
        status: 'pending'
      },
      {
        id: 'FLAG-002',
        contentType: 'prompt',
        thumbnail: '',
        user: {
          id: 'USER-002',
          name: 'Jane Smith',
          email: 'jane@example.com'
        },
        flaggedReason: 'Hate speech detected',
        aiScores: {
          nsfw: 0.05,
          violence: 0.2,
          hateSpeech: 0.85,
          overallRisk: 'high'
        },
        flaggedDate: '2023-06-14',
        status: 'pending'
      }
    ])

    // Mock user reports
    setUserReports([
      {
        id: 'REPORT-001',
        contentPreview: 'Inappropriate template content',
        reportedBy: {
          id: 'USER-003',
          name: 'Mike Johnson',
          email: 'mike@example.com'
        },
        reportReason: 'Inappropriate content',
        additionalComments: 'This template contains explicit content that violates community guidelines',
        reportDate: '2023-06-15',
        contentCreator: {
          id: 'CREATOR-001',
          name: 'Sarah Wilson',
          email: 'sarah@example.com'
        },
        status: 'pending',
        priority: 'high'
      }
    ])

    // Mock banned keywords
    setBannedKeywords([
      {
        id: 'KEY-001',
        keyword: 'explicit',
        category: 'nsfw',
        severity: 'high',
        action: 'auto-block',
        timesDetected: 42,
        lastDetected: '2023-06-15'
      },
      {
        id: 'KEY-002',
        keyword: 'violence',
        category: 'violence',
        severity: 'medium',
        action: 'flag',
        timesDetected: 18,
        lastDetected: '2023-06-14'
      }
    ])

    // Mock user strikes
    setUserStrikes([
      {
        id: 'STRIKE-001',
        user: {
          id: 'USER-002',
          name: 'Jane Smith',
          email: 'jane@example.com'
        },
        violationType: 'Hate speech',
        violationDescription: 'Used hate speech in image prompt',
        dateIssued: '2023-06-10',
        issuedBy: 'Admin User',
        actionTaken: 'Warning',
        userStatus: 'Active'
      }
    ])

    // Mock moderation logs
    setModerationLogs([
      {
        id: 'LOG-001',
        date: '2023-06-15 14:30',
        admin: 'Admin User',
        actionType: 'Content Blocked',
        contentAffected: 'Image from John Doe',
        reason: 'NSFW content detected',
        outcome: 'Content removed, user warned'
      }
    ])
  })

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-900/50 text-green-400'
      case 'medium': return 'bg-yellow-900/50 text-yellow-400'
      case 'high': return 'bg-orange-900/50 text-orange-400'
      case 'critical': return 'bg-red-900/50 text-red-400'
      default: return 'bg-gray-900/50 text-gray-400'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-blue-900/50 text-blue-400'
      case 'medium': return 'bg-yellow-900/50 text-yellow-400'
      case 'high': return 'bg-orange-900/50 text-orange-400'
      case 'urgent': return 'bg-red-900/50 text-red-400'
      default: return 'bg-gray-900/50 text-gray-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-900/50 text-yellow-400'
      case 'reviewed': return 'bg-blue-900/50 text-blue-400'
      case 'approved': return 'bg-green-900/50 text-green-400'
      case 'blocked': return 'bg-red-900/50 text-red-400'
      case 'actioned': return 'bg-purple-900/50 text-purple-400'
      default: return 'bg-gray-900/50 text-gray-400'
    }
  }

  const handleViewContent = (content: FlaggedContent) => {
    setSelectedContent(content)
    setShowContentDetail(true)
  }

  const handleViewReport = (report: UserReport) => {
    setSelectedReport(report)
    setShowReportDetail(true)
  }

  const handleApproveContent = (id: string) => {
    // In a real implementation, this would approve the content
    alert(`Approving content ${id}`)
  }

  const handleBlockContent = (id: string) => {
    // In a real implementation, this would block the content
    alert(`Blocking content ${id}`)
  }

  const handleBanUser = (id: string) => {
    // In a real implementation, this would ban the user
    alert(`Banning user ${id}`)
  }

  const handleAddKeyword = () => {
    if (!newKeyword.keyword.trim()) return
    
    const keyword: BannedKeyword = {
      id: `KEY-${Date.now()}`,
      keyword: newKeyword.keyword,
      category: newKeyword.category as any,
      severity: newKeyword.severity as any,
      action: newKeyword.action as any,
      timesDetected: 0,
      lastDetected: new Date().toISOString().split('T')[0]
    }
    
    setBannedKeywords([...bannedKeywords, keyword])
    setNewKeyword({
      keyword: '',
      category: 'nsfw',
      severity: 'medium',
      action: 'flag'
    })
  }

  const handleIssueStrike = () => {
    // In a real implementation, this would issue a strike to a user
    alert('Issuing strike to user')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Content Moderation</h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors">
            Export Logs
          </button>
          <button className="px-4 py-2 bg-[#4EFF9B] text-[#0D221A] font-medium rounded-lg hover:bg-[#3ad485] transition-colors">
            Settings
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Pending Reviews" 
          value="12" 
          change="+2" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard 
          title="Auto-Blocked Today" 
          value="8" 
          change="+3" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          }
        />
        <StatCard 
          title="User Reports" 
          value="5" 
          change="-1" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
          }
        />
        <StatCard 
          title="Total Bans" 
          value="3" 
          change="0" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          }
        />
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-[#112C23]">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'flagged'
              ? 'text-[#4EFF9B] border-b-2 border-[#4EFF9B]'
              : 'text-[#A0C4B5] hover:text-[#E9F5EE]'
          }`}
          onClick={() => setActiveTab('flagged')}
        >
          Flagged Content
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'reports'
              ? 'text-[#4EFF9B] border-b-2 border-[#4EFF9B]'
              : 'text-[#A0C4B5] hover:text-[#E9F5EE]'
          }`}
          onClick={() => setActiveTab('reports')}
        >
          User Reports
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'keywords'
              ? 'text-[#4EFF9B] border-b-2 border-[#4EFF9B]'
              : 'text-[#A0C4B5] hover:text-[#E9F5EE]'
          }`}
          onClick={() => setActiveTab('keywords')}
        >
          Banned Keywords
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'strikes'
              ? 'text-[#4EFF9B] border-b-2 border-[#4EFF9B]'
              : 'text-[#A0C4B5] hover:text-[#E9F5EE]'
          }`}
          onClick={() => setActiveTab('strikes')}
        >
          User Strikes
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'logs'
              ? 'text-[#4EFF9B] border-b-2 border-[#4EFF9B]'
              : 'text-[#A0C4B5] hover:text-[#E9F5EE]'
          }`}
          onClick={() => setActiveTab('logs')}
        >
          Moderation Logs
        </button>
      </div>

      {/* Flagged Content Tab */}
      {activeTab === 'flagged' && (
        <div className="space-y-6">
          {/* Search */}
          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search flagged content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-[#A0C4B5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <div className="flex space-x-2">
                <select className="px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50">
                  <option>All Content Types</option>
                  <option>Prompts</option>
                  <option>Images</option>
                  <option>Templates</option>
                </select>
                <select className="px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50">
                  <option>All Statuses</option>
                  <option>Pending</option>
                  <option>Reviewed</option>
                  <option>Approved</option>
                  <option>Blocked</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Flagged Content List */}
          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[#A0C4B5]">
                    <th className="pb-4">Content</th>
                    <th className="pb-4">User</th>
                    <th className="pb-4">Reason</th>
                    <th className="pb-4">Risk Level</th>
                    <th className="pb-4">Date</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {flaggedContent.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-[#A0C4B5]">
                        No flagged content found
                      </td>
                    </tr>
                  ) : (
                    flaggedContent.map(content => (
                      <tr key={content.id} className="border-t border-[#112C23]">
                        <td className="py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded bg-[#112C23] flex items-center justify-center mr-3">
                              {content.contentType === 'image' ? '🖼️' : content.contentType === 'prompt' ? '📝' : '📄'}
                            </div>
                            <div>
                              <div className="font-medium capitalize">{content.contentType}</div>
                              <div className="text-xs text-[#A0C4B5]">ID: {content.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div>{content.user.name}</div>
                          <div className="text-xs text-[#A0C4B5]">{content.user.email}</div>
                        </td>
                        <td className="py-4">
                          <div className="max-w-xs truncate">{content.flaggedReason}</div>
                        </td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getRiskColor(content.aiScores.overallRisk)}`}>
                            {content.aiScores.overallRisk.charAt(0).toUpperCase() + content.aiScores.overallRisk.slice(1)}
                          </span>
                        </td>
                        <td className="py-4">{content.flaggedDate}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(content.status)}`}>
                            {content.status.charAt(0).toUpperCase() + content.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewContent(content)}
                              className="px-3 py-1 text-sm bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors"
                            >
                              Review
                            </button>
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

      {/* User Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search user reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-[#A0C4B5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <div className="flex space-x-2">
                <select className="px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50">
                  <option>All Report Reasons</option>
                  <option>Inappropriate content</option>
                  <option>Copyright violation</option>
                  <option>Spam</option>
                  <option>Misleading</option>
                  <option>Hate speech</option>
                </select>
                <select className="px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50">
                  <option>All Priorities</option>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* User Reports List */}
          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[#A0C4B5]">
                    <th className="pb-4">Content</th>
                    <th className="pb-4">Reported By</th>
                    <th className="pb-4">Reason</th>
                    <th className="pb-4">Date</th>
                    <th className="pb-4">Priority</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userReports.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-[#A0C4B5]">
                        No user reports found
                      </td>
                    </tr>
                  ) : (
                    userReports.map(report => (
                      <tr key={report.id} className="border-t border-[#112C23]">
                        <td className="py-4">
                          <div className="max-w-xs truncate">{report.contentPreview}</div>
                        </td>
                        <td className="py-4">
                          <div>{report.reportedBy.name}</div>
                          <div className="text-xs text-[#A0C4B5]">{report.reportedBy.email}</div>
                        </td>
                        <td className="py-4">
                          <div className="max-w-xs truncate">{report.reportReason}</div>
                        </td>
                        <td className="py-4">{report.reportDate}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(report.priority)}`}>
                            {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(report.status)}`}>
                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewReport(report)}
                              className="px-3 py-1 text-sm bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors"
                            >
                              Review
                            </button>
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

      {/* Banned Keywords Tab */}
      {activeTab === 'keywords' && (
        <div className="space-y-6">
          {/* Add Keyword Form */}
          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">Add New Banned Keyword</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Keyword/Phrase</label>
                <input
                  type="text"
                  value={newKeyword.keyword}
                  onChange={(e) => setNewKeyword({...newKeyword, keyword: e.target.value})}
                  className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                  placeholder="Enter keyword"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Category</label>
                <select
                  value={newKeyword.category}
                  onChange={(e) => setNewKeyword({...newKeyword, category: e.target.value})}
                  className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                >
                  <option value="nsfw">NSFW</option>
                  <option value="violence">Violence</option>
                  <option value="drugs">Drugs</option>
                  <option value="hateSpeech">Hate Speech</option>
                  <option value="childSafety">Child Safety</option>
                  <option value="illegalActivities">Illegal Activities</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Severity</label>
                <select
                  value={newKeyword.severity}
                  onChange={(e) => setNewKeyword({...newKeyword, severity: e.target.value})}
                  className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Action</label>
                <select
                  value={newKeyword.action}
                  onChange={(e) => setNewKeyword({...newKeyword, action: e.target.value})}
                  className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                >
                  <option value="auto-block">Auto-block</option>
                  <option value="flag">Flag for review</option>
                  <option value="warning">Warning only</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                onClick={handleAddKeyword}
                className="px-4 py-2 bg-[#4EFF9B] text-[#0D221A] font-medium rounded-lg hover:bg-[#3ad485] transition-colors"
              >
                Add Keyword
              </button>
            </div>
          </div>
          
          {/* Banned Keywords List */}
          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[#A0C4B5]">
                    <th className="pb-4">Keyword</th>
                    <th className="pb-4">Category</th>
                    <th className="pb-4">Severity</th>
                    <th className="pb-4">Action</th>
                    <th className="pb-4">Times Detected</th>
                    <th className="pb-4">Last Detected</th>
                    <th className="pb-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bannedKeywords.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-[#A0C4B5]">
                        No banned keywords found
                      </td>
                    </tr>
                  ) : (
                    bannedKeywords.map(keyword => (
                      <tr key={keyword.id} className="border-t border-[#112C23]">
                        <td className="py-4 font-medium">{keyword.keyword}</td>
                        <td className="py-4">
                          <span className="px-2 py-1 bg-[#112C23] rounded-full text-xs">
                            {keyword.category}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getRiskColor(keyword.severity)}`}>
                            {keyword.severity.charAt(0).toUpperCase() + keyword.severity.slice(1)}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className="px-2 py-1 bg-[#112C23] rounded-full text-xs">
                            {keyword.action}
                          </span>
                        </td>
                        <td className="py-4">{keyword.timesDetected}</td>
                        <td className="py-4">{keyword.lastDetected}</td>
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* User Strikes Tab */}
      {activeTab === 'strikes' && (
        <div className="space-y-6">
          {/* Issue Strike Form */}
          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">Issue User Strike</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Select User</label>
                    <select className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50">
                      <option>Select user</option>
                      <option>John Doe (john@example.com)</option>
                      <option>Jane Smith (jane@example.com)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Violation Type</label>
                    <select className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50">
                      <option>Content policy violation</option>
                      <option>Spam behavior</option>
                      <option>Inappropriate prompts</option>
                      <option>Harassment</option>
                      <option>Multiple violations</option>
                      <option>Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Violation Description</label>
                    <textarea
                      className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                      rows={3}
                      placeholder="Enter detailed violation description"
                    ></textarea>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Evidence Attachment</label>
                    <div className="flex items-center justify-center w-full px-4 py-6 bg-[#112C23] border-2 border-dashed border-[#4EFF9B]/20 rounded-lg">
                      <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-[#A0C4B5] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-sm text-[#A0C4B5]">Click to upload or drag and drop</p>
                        <p className="text-xs text-[#A0C4B5]">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleIssueStrike}
                    className="w-full px-4 py-2 bg-[#4EFF9B] text-[#0D221A] font-medium rounded-lg hover:bg-[#3ad485] transition-colors"
                  >
                    Issue Strike
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* User Strikes List */}
          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[#A0C4B5]">
                    <th className="pb-4">User</th>
                    <th className="pb-4">Violation Type</th>
                    <th className="pb-4">Date Issued</th>
                    <th className="pb-4">Issued By</th>
                    <th className="pb-4">Action Taken</th>
                    <th className="pb-4">User Status</th>
                    <th className="pb-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userStrikes.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-[#A0C4B5]">
                        No user strikes found
                      </td>
                    </tr>
                  ) : (
                    userStrikes.map(strike => (
                      <tr key={strike.id} className="border-t border-[#112C23]">
                        <td className="py-4">
                          <div>{strike.user.name}</div>
                          <div className="text-xs text-[#A0C4B5]">{strike.user.email}</div>
                        </td>
                        <td className="py-4">{strike.violationType}</td>
                        <td className="py-4">{strike.dateIssued}</td>
                        <td className="py-4">{strike.issuedBy}</td>
                        <td className="py-4">{strike.actionTaken}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            strike.userStatus === 'Active' 
                              ? 'bg-green-900/50 text-green-400' 
                              : 'bg-red-900/50 text-red-400'
                          }`}>
                            {strike.userStatus}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex space-x-2">
                            <button className="px-3 py-1 text-sm bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors">
                              View
                            </button>
                            <button className="px-3 py-1 text-sm bg-red-900/50 hover:bg-red-900/70 text-red-400 rounded-lg transition-colors">
                              Revoke
                            </button>
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

      {/* Moderation Logs Tab */}
      {activeTab === 'logs' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Date Range</label>
                <div className="flex space-x-2">
                  <input
                    type="date"
                    className="flex-1 px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                  />
                  <input
                    type="date"
                    className="flex-1 px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Admin/Moderator</label>
                <select className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50">
                  <option>All Admins</option>
                  <option>Admin User</option>
                  <option>Moderator 1</option>
                  <option>Moderator 2</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Action Type</label>
                <select className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50">
                  <option>All Actions</option>
                  <option>Content Approved</option>
                  <option>Content Blocked</option>
                  <option>User Banned</option>
                  <option>Strike Issued</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button className="w-full px-4 py-2 bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors">
                  Export to CSV
                </button>
              </div>
            </div>
          </div>
          
          {/* Moderation Logs List */}
          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[#A0C4B5]">
                    <th className="pb-4">Date & Time</th>
                    <th className="pb-4">Admin/Moderator</th>
                    <th className="pb-4">Action Type</th>
                    <th className="pb-4">Content/User Affected</th>
                    <th className="pb-4">Reason</th>
                    <th className="pb-4">Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {moderationLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#A0C4B5]">
                        No moderation logs found
                      </td>
                    </tr>
                  ) : (
                    moderationLogs.map(log => (
                      <tr key={log.id} className="border-t border-[#112C23]">
                        <td className="py-4">{log.date}</td>
                        <td className="py-4">{log.admin}</td>
                        <td className="py-4">{log.actionType}</td>
                        <td className="py-4 max-w-xs truncate">{log.contentAffected}</td>
                        <td className="py-4 max-w-xs truncate">{log.reason}</td>
                        <td className="py-4">{log.outcome}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Flagged Content Detail Modal */}
      {showContentDetail && selectedContent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Flagged Content Review</h2>
              <button 
                onClick={() => setShowContentDetail(false)}
                className="text-[#A0C4B5] hover:text-[#E9F5EE]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Content Display */}
              <div className="lg:col-span-2 bg-[#112C23] rounded-xl p-4">
                <h3 className="font-medium mb-4">Content Display</h3>
                <div className="bg-[#15362B] border border-[#4EFF9B]/20 rounded-lg h-80 flex items-center justify-center">
                  <span className="text-[#A0C4B5]">
                    {selectedContent.contentType === 'image' 
                      ? 'Image Content Preview' 
                      : selectedContent.contentType === 'prompt'
                        ? 'Prompt Text: ' + selectedContent.flaggedReason
                        : 'Template Preview'}
                  </span>
                </div>
              </div>
              
              {/* AI Moderation Report */}
              <div className="space-y-6">
                <div className="bg-[#112C23] rounded-xl p-4">
                  <h3 className="font-medium mb-4">User Information</h3>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#15362B] flex items-center justify-center mr-3">
                      {selectedContent.user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{selectedContent.user.name}</p>
                      <p className="text-sm text-[#A0C4B5]">{selectedContent.user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#A0C4B5]">Previous Violations</span>
                      <span>1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#A0C4B5]">Strike Count</span>
                      <span>0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#A0C4B5]">Account Status</span>
                      <span className="text-green-400">Active</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#112C23] rounded-xl p-4">
                  <h3 className="font-medium mb-4">AI Moderation Report</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[#A0C4B5] text-sm">NSFW Content</p>
                      <div className="flex items-center">
                        <div className="w-full bg-[#15362B] rounded-full h-2 mr-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full" 
                            style={{ width: `${selectedContent.aiScores.nsfw * 100}%` }}
                          ></div>
                        </div>
                        <span>{(selectedContent.aiScores.nsfw * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-[#A0C4B5] text-sm">Violence</p>
                      <div className="flex items-center">
                        <div className="w-full bg-[#15362B] rounded-full h-2 mr-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full" 
                            style={{ width: `${selectedContent.aiScores.violence * 100}%` }}
                          ></div>
                        </div>
                        <span>{(selectedContent.aiScores.violence * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-[#A0C4B5] text-sm">Hate Speech</p>
                      <div className="flex items-center">
                        <div className="w-full bg-[#15362B] rounded-full h-2 mr-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full" 
                            style={{ width: `${selectedContent.aiScores.hateSpeech * 100}%` }}
                          ></div>
                        </div>
                        <span>{(selectedContent.aiScores.hateSpeech * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <p className="text-[#A0C4B5] text-sm">Overall Risk Level</p>
                      <span className={`px-2 py-1 rounded-full text-xs ${getRiskColor(selectedContent.aiScores.overallRisk)}`}>
                        {selectedContent.aiScores.overallRisk.charAt(0).toUpperCase() + selectedContent.aiScores.overallRisk.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Review Actions */}
            <div className="mt-6 pt-6 border-t border-[#112C23]">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowContentDetail(false)
                    handleApproveContent(selectedContent.id)
                  }}
                  className="px-4 py-2 bg-green-900/50 hover:bg-green-900/70 text-green-400 rounded-lg transition-colors"
                >
                  Approve Content
                </button>
                <button
                  onClick={() => {
                    setShowContentDetail(false)
                    handleBlockContent(selectedContent.id)
                  }}
                  className="px-4 py-2 bg-orange-900/50 hover:bg-orange-900/70 text-orange-400 rounded-lg transition-colors"
                >
                  Block Content
                </button>
                <button
                  onClick={() => {
                    setShowContentDetail(false)
                    handleBanUser(selectedContent.user.id)
                  }}
                  className="px-4 py-2 bg-red-900/50 hover:bg-red-900/70 text-red-400 rounded-lg transition-colors"
                >
                  Ban User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Report Detail Modal */}
      {showReportDetail && selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">User Report Review</h2>
              <button 
                onClick={() => setShowReportDetail(false)}
                className="text-[#A0C4B5] hover:text-[#E9F5EE]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Content Display */}
              <div className="lg:col-span-2 bg-[#112C23] rounded-xl p-4">
                <h3 className="font-medium mb-4">Reported Content</h3>
                <div className="bg-[#15362B] border border-[#4EFF9B]/20 rounded-lg h-64 flex items-center justify-center">
                  <span className="text-[#A0C4B5]">Content Preview: {selectedReport.contentPreview}</span>
                </div>
              </div>
              
              {/* Report Details */}
              <div className="space-y-6">
                <div className="bg-[#112C23] rounded-xl p-4">
                  <h3 className="font-medium mb-4">Reporter Information</h3>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#15362B] flex items-center justify-center mr-3">
                      {selectedReport.reportedBy.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{selectedReport.reportedBy.name}</p>
                      <p className="text-sm text-[#A0C4B5]">{selectedReport.reportedBy.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-[#A0C4B5] text-sm">Report Date</p>
                      <p>{selectedReport.reportDate}</p>
                    </div>
                    <div>
                      <p className="text-[#A0C4B5] text-sm">Report Reason</p>
                      <p>{selectedReport.reportReason}</p>
                    </div>
                    <div>
                      <p className="text-[#A0C4B5] text-sm">Priority</p>
                      <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(selectedReport.priority)}`}>
                        {selectedReport.priority.charAt(0).toUpperCase() + selectedReport.priority.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#112C23] rounded-xl p-4">
                  <h3 className="font-medium mb-4">Additional Comments</h3>
                  <p className="text-[#A0C4B5]">{selectedReport.additionalComments}</p>
                </div>
                
                <div className="bg-[#112C23] rounded-xl p-4">
                  <h3 className="font-medium mb-4">Content Creator</h3>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#15362B] flex items-center justify-center mr-3">
                      {selectedReport.contentCreator.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{selectedReport.contentCreator.name}</p>
                      <p className="text-sm text-[#A0C4B5]">{selectedReport.contentCreator.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#A0C4B5]">Total Uses</span>
                      <span>142</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#A0C4B5]">Average Rating</span>
                      <span>4.2</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Review Actions */}
            <div className="mt-6 pt-6 border-t border-[#112C23]">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowReportDetail(false)}
                  className="px-4 py-2 bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors"
                >
                  Dismiss Report
                </button>
                <button
                  onClick={() => setShowReportDetail(false)}
                  className="px-4 py-2 bg-green-900/50 hover:bg-green-900/70 text-green-400 rounded-lg transition-colors"
                >
                  Approve Content
                </button>
                <button
                  onClick={() => setShowReportDetail(false)}
                  className="px-4 py-2 bg-orange-900/50 hover:bg-orange-900/70 text-orange-400 rounded-lg transition-colors"
                >
                  Remove Content
                </button>
                <button
                  onClick={() => setShowReportDetail(false)}
                  className="px-4 py-2 bg-red-900/50 hover:bg-red-900/70 text-red-400 rounded-lg transition-colors"
                >
                  Ban Creator
                </button>
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