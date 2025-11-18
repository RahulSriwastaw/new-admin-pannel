"use client"
import { useEffect, useState } from "react"
import { adminCreatorsApi } from "@/services/api"

type CreatorApplication = {
  id: string
  name: string
  email: string
  phone: string
  username: string
  appliedDate: string
  daysPending: number
  socialLinks: {
    facebook?: string
    youtube?: string
    instagram?: string
    telegram?: string
    whatsapp?: string
  }
  demoTemplates: {
    id: string
    imageUrl: string
    prompt: string
    qualityScore: number
    originalityScore: number
    contentCheck: 'safe' | 'flagged'
  }[]
}

type ApprovedCreator = {
  id: string
  name: string
  username: string
  joinDate: string
  totalTemplates: number
  pendingTemplates: number
  approvedTemplates: number
  totalUses: number
  totalEarnings: number
  followers: number
  averageRating: number
  status: 'active' | 'inactive'
  isVerified: boolean
  avatar?: string
}

type RejectedApplication = {
  id: string
  name: string
  email: string
  rejectionDate: string
  reason: string
  reapplyDate: string
}

export default function CreatorsPage() {
  const [activeTab, setActiveTab] = useState('pending')
  const [pendingApplications, setPendingApplications] = useState<CreatorApplication[]>([])
  const [approvedCreators, setApprovedCreators] = useState<ApprovedCreator[]>([])
  const [rejectedApplications, setRejectedApplications] = useState<RejectedApplication[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [selectedApplication, setSelectedApplication] = useState<CreatorApplication | null>(null)
  const [selectedCreator, setSelectedCreator] = useState<ApprovedCreator | null>(null)
  const [showCreatorDetail, setShowCreatorDetail] = useState(false)
  const [creatorDetailTab, setCreatorDetailTab] = useState('profile')
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("appliedDate")
  const [verificationStatus, setVerificationStatus] = useState("all")

  useEffect(() => {
    // Mock data for demonstration
    setPendingApplications([
      {
        id: 'APP-001',
        name: 'John Creator',
        email: 'john@example.com',
        phone: '+91 9876543210',
        username: 'john_creator',
        appliedDate: '2023-06-15',
        daysPending: 3,
        socialLinks: {
          facebook: 'https://facebook.com/john',
          youtube: 'https://youtube.com/john',
          instagram: 'https://instagram.com/john',
          telegram: 'https://t.me/john',
          whatsapp: '+91 9876543210'
        },
        demoTemplates: [
          {
            id: 'TEMP-001',
            imageUrl: '',
            prompt: 'A beautiful landscape with mountains and sunset',
            qualityScore: 85,
            originalityScore: 92,
            contentCheck: 'safe'
          },
          {
            id: 'TEMP-002',
            imageUrl: '',
            prompt: 'Portrait of a young woman with flowers',
            qualityScore: 78,
            originalityScore: 88,
            contentCheck: 'safe'
          }
        ]
      }
    ])

    setApprovedCreators([
      {
        id: 'CRE-001',
        name: 'Jane Artist',
        username: 'jane_artist',
        joinDate: '2023-05-20',
        totalTemplates: 42,
        pendingTemplates: 3,
        approvedTemplates: 39,
        totalUses: 1250,
        totalEarnings: 25600,
        followers: 1242,
        averageRating: 4.7,
        status: 'active',
        isVerified: true,
        avatar: ''
      },
      {
        id: 'CRE-002',
        name: 'Mike Designer',
        username: 'mike_designer',
        joinDate: '2023-06-01',
        totalTemplates: 18,
        pendingTemplates: 1,
        approvedTemplates: 17,
        totalUses: 420,
        totalEarnings: 8400,
        followers: 356,
        averageRating: 4.3,
        status: 'active',
        isVerified: false,
        avatar: ''
      }
    ])

    setRejectedApplications([
      {
        id: 'REJ-001',
        name: 'Sarah Smith',
        email: 'sarah@example.com',
        rejectionDate: '2023-06-10',
        reason: 'Low quality templates',
        reapplyDate: '2023-06-13'
      }
    ])
  }, [])

  const refresh = () => adminCreatorsApi.list().then(setApprovedCreators)
  const act = async (id: string, fn: () => Promise<any>) => { setLoadingId(id); try { await fn(); await refresh() } catch (e: any) { setError(e?.message || 'Action failed') } finally { setLoadingId(null) } }

  const handleApproveApplication = (application: CreatorApplication) => {
    setSelectedApplication(application)
  }

  const handleRejectApplication = (application: CreatorApplication) => {
    // In a real implementation, this would show a rejection form
    alert(`Rejecting application for ${application.name}`)
  }

  const handleViewCreator = (creator: ApprovedCreator) => {
    setSelectedCreator(creator)
    setShowCreatorDetail(true)
    setCreatorDetailTab('profile')
  }

  const handleApproveCreator = async (id: string) => {
    await act(id, () => adminCreatorsApi.approve(id))
  }

  const handleRejectCreator = async (id: string, reason: string) => {
    await act(id, () => adminCreatorsApi.reject(id, reason))
  }

  const handleBanCreator = async (id: string) => {
    await act(id, () => adminCreatorsApi.ban(id))
  }

  const handleUnbanCreator = async (id: string) => {
    await act(id, () => adminCreatorsApi.unban(id))
  }

  const handleVerifyCreator = async (id: string) => {
    await act(id, () => adminCreatorsApi.verify(id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Creator Management</h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors">
            Export Creators
          </button>
          <button className="px-4 py-2 bg-[#4EFF9B] text-[#0D221A] font-medium rounded-lg hover:bg-[#3ad485] transition-colors">
            Analytics
          </button>
        </div>
      </div>
      
      {error && <p className="text-red-400">{error}</p>}
      
      {/* Tabs */}
      <div className="flex border-b border-[#112C23]">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'pending'
              ? 'text-[#4EFF9B] border-b-2 border-[#4EFF9B]'
              : 'text-[#A0C4B5] hover:text-[#E9F5EE]'
          }`}
          onClick={() => setActiveTab('pending')}
        >
          Pending Applications ({pendingApplications.length})
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'approved'
              ? 'text-[#4EFF9B] border-b-2 border-[#4EFF9B]'
              : 'text-[#A0C4B5] hover:text-[#E9F5EE]'
          }`}
          onClick={() => setActiveTab('approved')}
        >
          Approved Creators ({approvedCreators.length})
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'rejected'
              ? 'text-[#4EFF9B] border-b-2 border-[#4EFF9B]'
              : 'text-[#A0C4B5] hover:text-[#E9F5EE]'
          }`}
          onClick={() => setActiveTab('rejected')}
        >
          Rejected Applications ({rejectedApplications.length})
        </button>
      </div>

      {/* Pending Applications Tab */}
      {activeTab === 'pending' && (
        <div className="space-y-6">
          {pendingApplications.length === 0 ? (
            <div className="bg-[#15362B] rounded-2xl p-12 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-xl font-semibold mb-2">No Pending Applications</h3>
              <p className="text-[#A0C4B5]">All creator applications have been reviewed.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pendingApplications.map(application => (
                <div key={application.id} className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{application.name}</h3>
                      <p className="text-[#A0C4B5] text-sm">{application.email}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      application.daysPending > 3 
                        ? 'bg-orange-900/50 text-orange-400' 
                        : 'bg-blue-900/50 text-blue-400'
                    }`}>
                      {application.daysPending} days pending
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-[#A0C4B5] text-sm">Username</p>
                      <p>@{application.username}</p>
                    </div>
                    <div>
                      <p className="text-[#A0C4B5] text-sm">Applied Date</p>
                      <p>{new Date(application.appliedDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[#A0C4B5] text-sm">Phone</p>
                      <p>{application.phone}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Social Media Links</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(application.socialLinks).map(([platform, link]) => (
                        <a 
                          key={platform}
                          href={link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg text-sm transition-colors"
                        >
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </a>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Demo Templates</h4>
                    <div className="space-y-4">
                      {application.demoTemplates.map((template, index) => (
                        <div key={template.id} className="bg-[#112C23] rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium">Template {index + 1}</h5>
                            <div className="flex space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                template.contentCheck === 'safe' 
                                  ? 'bg-green-900/50 text-green-400' 
                                  : 'bg-red-900/50 text-red-400'
                              }`}>
                                {template.contentCheck}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-[#A0C4B5] mb-3">{template.prompt}</p>
                          <div className="flex space-x-4 text-sm">
                            <div>
                              <p className="text-[#A0C4B5]">Quality</p>
                              <p>{template.qualityScore}/100</p>
                            </div>
                            <div>
                              <p className="text-[#A0C4B5]">Originality</p>
                              <p>{template.originalityScore}/100</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleApproveApplication(application)}
                      className="flex-1 px-4 py-2 bg-[#4EFF9B] text-[#0D221A] font-medium rounded-lg hover:bg-[#3ad485] transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectApplication(application)}
                      className="flex-1 px-4 py-2 bg-red-900/50 hover:bg-red-900/70 text-red-400 rounded-lg transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Approved Creators Tab */}
      {activeTab === 'approved' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Name, username, email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                >
                  <option value="joinDate">Join Date</option>
                  <option value="totalEarnings">Total Earnings</option>
                  <option value="totalTemplates">Total Templates</option>
                  <option value="averageRating">Rating</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Verification</label>
                <select
                  value={verificationStatus}
                  onChange={(e) => setVerificationStatus(e.target.value)}
                  className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                >
                  <option value="all">All Statuses</option>
                  <option value="verified">Verified</option>
                  <option value="notVerified">Not Verified</option>
                </select>
              </div>
            </div>
          </div>
          
          {approvedCreators.length === 0 ? (
            <div className="bg-[#15362B] rounded-2xl p-12 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm text-center">
              <div className="text-5xl mb-4">👤</div>
              <h3 className="text-xl font-semibold mb-2">No Approved Creators</h3>
              <p className="text-[#A0C4B5]">No creators have been approved yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {approvedCreators.map(creator => (
                <div key={creator.id} className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-[#112C23] flex items-center justify-center mr-3">
                        {creator.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{creator.name}</h3>
                        <p className="text-[#A0C4B5] text-sm">@{creator.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {creator.isVerified && (
                        <span className="px-2 py-1 bg-blue-900/50 text-blue-400 text-xs rounded-full">
                          Verified
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        creator.status === 'active' 
                          ? 'bg-green-900/50 text-green-400' 
                          : 'bg-gray-900/50 text-gray-400'
                      }`}>
                        {creator.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-[#A0C4B5] text-sm">Join Date</p>
                      <p>{new Date(creator.joinDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[#A0C4B5] text-sm">Followers</p>
                      <p>{creator.followers.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[#A0C4B5] text-sm">Templates</p>
                      <p>{creator.totalTemplates} ({creator.pendingTemplates} pending)</p>
                    </div>
                    <div>
                      <p className="text-[#A0C4B5] text-sm">Rating</p>
                      <p>{creator.averageRating}/5.0</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-[#A0C4B5] text-sm">Total Earnings</p>
                      <p className="text-lg font-semibold">₹{creator.totalEarnings.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[#A0C4B5] text-sm">Total Uses</p>
                      <p>{creator.totalUses.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewCreator(creator)}
                      className="flex-1 px-3 py-2 bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors text-sm"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => handleVerifyCreator(creator.id)}
                      disabled={creator.isVerified || loadingId === creator.id}
                      className="flex-1 px-3 py-2 bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors text-sm disabled:opacity-50"
                    >
                      {loadingId === creator.id ? 'Verifying...' : creator.isVerified ? 'Verified' : 'Verify'}
                    </button>
                    <button
                      onClick={() => handleBanCreator(creator.id)}
                      disabled={loadingId === creator.id}
                      className="px-3 py-2 bg-red-900/50 hover:bg-red-900/70 text-red-400 rounded-lg transition-colors text-sm disabled:opacity-50"
                    >
                      {loadingId === creator.id ? 'Banning...' : 'Ban'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Rejected Applications Tab */}
      {activeTab === 'rejected' && (
        <div className="space-y-6">
          {rejectedApplications.length === 0 ? (
            <div className="bg-[#15362B] rounded-2xl p-12 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm text-center">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-semibold mb-2">No Rejected Applications</h3>
              <p className="text-[#A0C4B5]">No creator applications have been rejected.</p>
            </div>
          ) : (
            <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[#A0C4B5]">
                      <th className="pb-4">Name</th>
                      <th className="pb-4">Email</th>
                      <th className="pb-4">Rejection Date</th>
                      <th className="pb-4">Reason</th>
                      <th className="pb-4">Reapply Date</th>
                      <th className="pb-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rejectedApplications.map(application => (
                      <tr key={application.id} className="border-t border-[#112C23]">
                        <td className="py-4">{application.name}</td>
                        <td className="py-4">{application.email}</td>
                        <td className="py-4">{new Date(application.rejectionDate).toLocaleDateString()}</td>
                        <td className="py-4">{application.reason}</td>
                        <td className="py-4">
                          <span className="text-sm">
                            {new Date(application.reapplyDate).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex space-x-2">
                            <button className="px-3 py-1 text-sm bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors">
                              Review Again
                            </button>
                            <button className="px-3 py-1 text-sm bg-[#4EFF9B] text-[#0D221A] rounded-lg hover:bg-[#3ad485] transition-colors">
                              Approve
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Approve Application Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Approve Creator Application</h2>
              <button 
                onClick={() => setSelectedApplication(null)}
                className="text-[#A0C4B5] hover:text-[#E9F5EE]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-[#112C23] rounded-xl p-4">
                <h3 className="font-medium mb-3">Applicant Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[#A0C4B5] text-sm">Full Name</p>
                    <p>{selectedApplication.name}</p>
                  </div>
                  <div>
                    <p className="text-[#A0C4B5] text-sm">Email</p>
                    <p>{selectedApplication.email}</p>
                  </div>
                  <div>
                    <p className="text-[#A0C4B5] text-sm">Username</p>
                    <p>@{selectedApplication.username}</p>
                  </div>
                  <div>
                    <p className="text-[#A0C4B5] text-sm">Phone</p>
                    <p>{selectedApplication.phone}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#112C23] rounded-xl p-4">
                <h3 className="font-medium mb-3">Review Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[#A0C4B5] text-sm">Total Generations</p>
                    <p>142</p>
                  </div>
                  <div>
                    <p className="text-[#A0C4B5] text-sm">Points Balance</p>
                    <p>1,250 points</p>
                  </div>
                  <div>
                    <p className="text-[#A0C4B5] text-sm">Member Since</p>
                    <p>1 year, 3 months</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#112C23] rounded-xl p-4">
                <h3 className="font-medium mb-3">Approval Actions</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-[#A0C4B5] mb-2">Welcome Message (Optional)</label>
                    <textarea
                      className="w-full px-4 py-2 bg-[#15362B] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                      placeholder="Enter a welcome message for the creator"
                      rows={3}
                    ></textarea>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => setSelectedApplication(null)}
                      className="flex-1 px-4 py-2 bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      className="flex-1 px-4 py-2 bg-[#4EFF9B] text-[#0D221A] font-medium rounded-lg hover:bg-[#3ad485] transition-colors"
                    >
                      Confirm Approval
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Creator Detail Modal */}
      {showCreatorDetail && selectedCreator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Creator Profile</h2>
              <button 
                onClick={() => setShowCreatorDetail(false)}
                className="text-[#A0C4B5] hover:text-[#E9F5EE]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Creator Header */}
            <div className="flex items-center mb-6 p-4 bg-[#112C23] rounded-xl">
              <div className="w-16 h-16 rounded-full bg-[#4EFF9B] text-[#0D221A] flex items-center justify-center text-2xl font-bold mr-4">
                {selectedCreator.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{selectedCreator.name}</h3>
                <p className="text-[#A0C4B5]">@{selectedCreator.username}</p>
                <div className="flex space-x-2 mt-2">
                  {selectedCreator.isVerified && (
                    <span className="px-2 py-1 bg-blue-900/50 text-blue-400 text-xs rounded-full">
                      Verified
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedCreator.status === 'active' 
                      ? 'bg-green-900/50 text-green-400' 
                      : 'bg-gray-900/50 text-gray-400'
                  }`}>
                    {selectedCreator.status}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-[#112C23] mb-6">
              <button
                className={`px-4 py-2 font-medium ${
                  creatorDetailTab === 'profile'
                    ? "text-[#4EFF9B] border-b-2 border-[#4EFF9B]"
                    : "text-[#A0C4B5] hover:text-[#E9F5EE]"
                }`}
                onClick={() => setCreatorDetailTab('profile')}
              >
                Profile
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  creatorDetailTab === 'templates'
                    ? "text-[#4EFF9B] border-b-2 border-[#4EFF9B]"
                    : "text-[#A0C4B5] hover:text-[#E9F5EE]"
                }`}
                onClick={() => setCreatorDetailTab('templates')}
              >
                Templates
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  creatorDetailTab === 'earnings'
                    ? "text-[#4EFF9B] border-b-2 border-[#4EFF9B]"
                    : "text-[#A0C4B5] hover:text-[#E9F5EE]"
                }`}
                onClick={() => setCreatorDetailTab('earnings')}
              >
                Earnings
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  creatorDetailTab === 'performance'
                    ? "text-[#4EFF9B] border-b-2 border-[#4EFF9B]"
                    : "text-[#A0C4B5] hover:text-[#E9F5EE]"
                }`}
                onClick={() => setCreatorDetailTab('performance')}
              >
                Performance
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  creatorDetailTab === 'actions'
                    ? "text-[#4EFF9B] border-b-2 border-[#4EFF9B]"
                    : "text-[#A0C4B5] hover:text-[#E9F5EE]"
                }`}
                onClick={() => setCreatorDetailTab('actions')}
              >
                Actions
              </button>
            </div>
            
            {/* Tab Content */}
            {creatorDetailTab === 'profile' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#112C23] rounded-xl p-4">
                    <h4 className="font-medium mb-4">Profile Information</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[#A0C4B5] text-sm">Full Name</p>
                        <p>{selectedCreator.name}</p>
                      </div>
                      <div>
                        <p className="text-[#A0C4B5] text-sm">Username</p>
                        <p>@{selectedCreator.username}</p>
                      </div>
                      <div>
                        <p className="text-[#A0C4B5] text-sm">Join Date</p>
                        <p>{new Date(selectedCreator.joinDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-[#112C23] rounded-xl p-4">
                    <h4 className="font-medium mb-4">Social Media</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[#A0C4B5] text-sm">Instagram</p>
                        <p className="text-[#4EFF9B]">@creator_insta</p>
                      </div>
                      <div>
                        <p className="text-[#A0C4B5] text-sm">YouTube</p>
                        <p className="text-[#4EFF9B]">Creator Studio</p>
                      </div>
                      <div>
                        <p className="text-[#A0C4B5] text-sm">Telegram</p>
                        <p className="text-[#4EFF9B]">@creator_telegram</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#112C23] rounded-xl p-4">
                  <h4 className="font-medium mb-4">Bio</h4>
                  <p className="text-[#A0C4B5]">
                    Professional digital artist with 5+ years of experience in AI-generated art. 
                    Specializing in portrait and landscape compositions with a focus on realism and detail.
                  </p>
                </div>
              </div>
            )}
            
            {creatorDetailTab === 'templates' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">All Templates</h4>
                  <div className="flex space-x-2">
                    <select className="px-3 py-1 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg text-sm">
                      <option>All Statuses</option>
                      <option>Pending</option>
                      <option>Approved</option>
                      <option>Rejected</option>
                    </select>
                    <button className="px-3 py-1 bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg text-sm">
                      Quick Approve
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="bg-[#112C23] rounded-xl p-4">
                      <div className="bg-[#15362B] border border-[#4EFF9B]/20 rounded-lg h-32 mb-3 flex items-center justify-center">
                        <span className="text-[#A0C4B5]">Template {i}</span>
                      </div>
                      <h5 className="font-medium mb-1">Beautiful Landscape {i}</h5>
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          i % 3 === 0 ? 'bg-yellow-900/50 text-yellow-400' :
                          i % 2 === 0 ? 'bg-green-900/50 text-green-400' :
                          'bg-gray-900/50 text-gray-400'
                        }`}>
                          {i % 3 === 0 ? 'Pending' : i % 2 === 0 ? 'Approved' : 'Rejected'}
                        </span>
                        <div className="flex space-x-1">
                          <button className="px-2 py-1 bg-[#15362B] hover:bg-[#4EFF9B]/20 rounded text-xs">
                            Approve
                          </button>
                          <button className="px-2 py-1 bg-[#15362B] hover:bg-red-900/20 text-red-400 rounded text-xs">
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {creatorDetailTab === 'earnings' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#112C23] rounded-xl p-4">
                    <p className="text-[#A0C4B5] text-sm">Total Earnings</p>
                    <p className="text-2xl font-bold">₹{selectedCreator.totalEarnings.toLocaleString()}</p>
                  </div>
                  <div className="bg-[#112C23] rounded-xl p-4">
                    <p className="text-[#A0C4B5] text-sm">Pending Withdrawals</p>
                    <p className="text-2xl font-bold">₹2,500</p>
                  </div>
                  <div className="bg-[#112C23] rounded-xl p-4">
                    <p className="text-[#A0C4B5] text-sm">This Month</p>
                    <p className="text-2xl font-bold">₹8,400</p>
                  </div>
                </div>
                
                <div className="bg-[#112C23] rounded-xl p-4">
                  <h4 className="font-medium mb-4">Earnings Graph</h4>
                  <div className="h-48 flex items-end space-x-2">
                    {[60, 80, 45, 90, 70, 85, 65].map((value, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div 
                          className="w-full bg-gradient-to-t from-[#4EFF9B]/70 to-[#4EFF9B] rounded-t-lg"
                          style={{ height: `${value}%` }}
                        ></div>
                        <span className="text-xs text-[#A0C4B5] mt-2">Jun {index + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-[#112C23] rounded-xl p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Withdrawal History</h4>
                    <button className="px-3 py-1 bg-[#15362B] hover:bg-[#4EFF9B]/20 rounded-lg text-sm">
                      Approve Pending
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-[#A0C4B5]">
                          <th className="pb-2">Date</th>
                          <th className="pb-2">Amount</th>
                          <th className="pb-2">Status</th>
                          <th className="pb-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t border-[#112C23]">
                          <td className="py-2">2023-06-15</td>
                          <td className="py-2">₹5,000</td>
                          <td className="py-2">
                            <span className="px-2 py-1 bg-green-900/50 text-green-400 rounded-full text-xs">
                              Completed
                            </span>
                          </td>
                          <td className="py-2">
                            <button className="px-2 py-1 bg-[#15362B] hover:bg-[#4EFF9B]/20 rounded text-xs">
                              View
                            </button>
                          </td>
                        </tr>
                        <tr className="border-t border-[#112C23]">
                          <td className="py-2">2023-06-10</td>
                          <td className="py-2">₹2,500</td>
                          <td className="py-2">
                            <span className="px-2 py-1 bg-yellow-900/50 text-yellow-400 rounded-full text-xs">
                              Pending
                            </span>
                          </td>
                          <td className="py-2">
                            <div className="flex space-x-1">
                              <button className="px-2 py-1 bg-[#15362B] hover:bg-[#4EFF9B]/20 rounded text-xs">
                                Approve
                              </button>
                              <button className="px-2 py-1 bg-[#15362B] hover:bg-red-900/20 text-red-400 rounded text-xs">
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            
            {creatorDetailTab === 'performance' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#112C23] rounded-xl p-4">
                    <p className="text-[#A0C4B5] text-sm">Total Template Uses</p>
                    <p className="text-2xl font-bold">{selectedCreator.totalUses.toLocaleString()}</p>
                  </div>
                  <div className="bg-[#112C23] rounded-xl p-4">
                    <p className="text-[#A0C4B5] text-sm">Unique Users Reached</p>
                    <p className="text-2xl font-bold">1,242</p>
                  </div>
                  <div className="bg-[#112C23] rounded-xl p-4">
                    <p className="text-[#A0C4B5] text-sm">Average Rating</p>
                    <p className="text-2xl font-bold">{selectedCreator.averageRating}/5.0</p>
                  </div>
                </div>
                
                <div className="bg-[#112C23] rounded-xl p-4">
                  <h4 className="font-medium mb-4">Follower Growth</h4>
                  <div className="h-48 flex items-end space-x-2">
                    {[30, 45, 60, 75, 90, 110, 125].map((value, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div 
                          className="w-full bg-gradient-to-t from-[#4EFF9B]/70 to-[#4EFF9B] rounded-t-lg"
                          style={{ height: `${(value / 150) * 100}%` }}
                        ></div>
                        <span className="text-xs text-[#A0C4B5] mt-2">Jun {index + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-[#112C23] rounded-xl p-4">
                  <h4 className="font-medium mb-4">Top Performing Templates</h4>
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-[#15362B]">
                        <div>
                          <p>Portrait Master {i}</p>
                          <p className="text-xs text-[#A0C4B5]">Used 240 times</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">4.{7 - i}/5.0</p>
                          <p className="text-xs text-[#A0C4B5]">₹{i * 1200}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {creatorDetailTab === 'actions' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#112C23] rounded-xl p-4">
                    <h4 className="font-medium mb-4">Send Message</h4>
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
                      <button className="w-full px-4 py-2 bg-[#4EFF9B] text-[#0D221A] font-medium rounded-lg hover:bg-[#3ad485] transition-colors">
                        Send Message
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-[#112C23] rounded-xl p-4">
                    <h4 className="font-medium mb-4">Creator Actions</h4>
                    <div className="space-y-3">
                      <button className="w-full px-4 py-2 bg-[#15362B] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors text-left">
                        <div className="font-medium">Grant Verification Badge</div>
                        <div className="text-sm text-[#A0C4B5] mt-1">Manually verify this creator</div>
                      </button>
                      <button className="w-full px-4 py-2 bg-[#15362B] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors text-left">
                        <div className="font-medium">Feature Creator</div>
                        <div className="text-sm text-[#A0C4B5] mt-1">Spotlight on homepage</div>
                      </button>
                      <button className="w-full px-4 py-2 bg-yellow-900/20 hover:bg-yellow-900/30 text-yellow-400 rounded-lg transition-colors text-left">
                        <div className="font-medium">Issue Warning</div>
                        <div className="text-sm text-[#A0C4B5] mt-1">Send warning for policy violations</div>
                      </button>
                      <button className="w-full px-4 py-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded-lg transition-colors text-left">
                        <div className="font-medium">Suspend Creator</div>
                        <div className="text-sm text-[#A0C4B5] mt-1">Temporarily disable account</div>
                      </button>
                      <button className="w-full px-4 py-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded-lg transition-colors text-left">
                        <div className="font-medium">Revoke Creator Status</div>
                        <div className="text-sm text-[#A0C4B5] mt-1">Revert to regular user</div>
                      </button>
                    </div>
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