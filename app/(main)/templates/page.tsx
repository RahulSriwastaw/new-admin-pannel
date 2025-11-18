"use client"
import { useEffect, useState } from "react"
import { adminTemplatesApi } from "@/services/api"

type Template = {
  id: string
  title: string
  description: string
  creator: {
    id: string
    name: string
    username: string
  }
  category: string
  tags: string[]
  status: 'pending' | 'approved' | 'rejected' | 'featured' | 'trending'
  pricing: {
    type: 'free' | 'premium'
    price?: number
  }
  thumbnail: string
  submissionDate: string
  autoChecks: {
    contentSafety: {
      nsfwScore: 'safe' | 'warning' | 'unsafe'
      violenceScore: number
      hateSpeechScore: number
      overall: 'pass' | 'review' | 'fail'
    }
    promptQuality: {
      clarityScore: number
      effectiveness: number
      grammar: number
    }
    imageQuality: {
      resolution: number
      sharpness: number
      quality: number
    }
    originality: {
      reverseSearch: boolean
      plagiarism: boolean
      stockPhoto: boolean
    }
  }
  performance: {
    totalUses: number
    revenue: number
    averageRating: number
    saves: number
  }
}

export default function TemplatesPage() {
  const [activeTab, setActiveTab] = useState('pending')
  const [templates, setTemplates] = useState<Template[]>([])
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([])
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [actingId, setActingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("submissionDate")
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [showTemplateDetail, setShowTemplateDetail] = useState(false)

  useEffect(() => {
    // Mock data for demonstration
    const mockTemplates: Template[] = [
      {
        id: 'TEMP-001',
        title: 'Beautiful Landscape',
        description: 'A stunning landscape with mountains and sunset',
        creator: {
          id: 'CRE-001',
          name: 'Jane Artist',
          username: 'jane_artist'
        },
        category: 'Nature',
        tags: ['landscape', 'mountains', 'sunset'],
        status: 'pending',
        pricing: {
          type: 'free'
        },
        thumbnail: '',
        submissionDate: '2023-06-15',
        autoChecks: {
          contentSafety: {
            nsfwScore: 'safe',
            violenceScore: 0.1,
            hateSpeechScore: 0.05,
            overall: 'pass'
          },
          promptQuality: {
            clarityScore: 85,
            effectiveness: 90,
            grammar: 95
          },
          imageQuality: {
            resolution: 92,
            sharpness: 88,
            quality: 90
          },
          originality: {
            reverseSearch: false,
            plagiarism: false,
            stockPhoto: false
          }
        },
        performance: {
          totalUses: 120,
          revenue: 0,
          averageRating: 4.7,
          saves: 42
        }
      },
      {
        id: 'TEMP-002',
        title: 'Portrait Master',
        description: 'Professional portrait with detailed facial features',
        creator: {
          id: 'CRE-002',
          name: 'Mike Designer',
          username: 'mike_designer'
        },
        category: 'Portraits',
        tags: ['portrait', 'face', 'professional'],
        status: 'approved',
        pricing: {
          type: 'premium',
          price: 50
        },
        thumbnail: '',
        submissionDate: '2023-06-10',
        autoChecks: {
          contentSafety: {
            nsfwScore: 'safe',
            violenceScore: 0.05,
            hateSpeechScore: 0.02,
            overall: 'pass'
          },
          promptQuality: {
            clarityScore: 92,
            effectiveness: 88,
            grammar: 97
          },
          imageQuality: {
            resolution: 95,
            sharpness: 90,
            quality: 93
          },
          originality: {
            reverseSearch: false,
            plagiarism: false,
            stockPhoto: false
          }
        },
        performance: {
          totalUses: 240,
          revenue: 12000,
          averageRating: 4.8,
          saves: 87
        }
      },
      {
        id: 'TEMP-003',
        title: 'Urban Architecture',
        description: 'Modern city skyline with detailed buildings',
        creator: {
          id: 'CRE-001',
          name: 'Jane Artist',
          username: 'jane_artist'
        },
        category: 'Architecture',
        tags: ['city', 'buildings', 'urban'],
        status: 'featured',
        pricing: {
          type: 'premium',
          price: 75
        },
        thumbnail: '',
        submissionDate: '2023-06-05',
        autoChecks: {
          contentSafety: {
            nsfwScore: 'safe',
            violenceScore: 0.15,
            hateSpeechScore: 0.08,
            overall: 'pass'
          },
          promptQuality: {
            clarityScore: 88,
            effectiveness: 85,
            grammar: 92
          },
          imageQuality: {
            resolution: 89,
            sharpness: 87,
            quality: 88
          },
          originality: {
            reverseSearch: false,
            plagiarism: false,
            stockPhoto: true
          }
        },
        performance: {
          totalUses: 180,
          revenue: 13500,
          averageRating: 4.6,
          saves: 65
        }
      }
    ]
    
    setTemplates(mockTemplates)
  }, [])

  useEffect(() => {
    let result = [...templates]
    
    // Filter by active tab
    if (activeTab !== 'all') {
      result = result.filter(template => template.status === activeTab)
    }
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(template => 
        template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
    
    // Apply category filter
    if (categoryFilter !== "all") {
      result = result.filter(template => template.category === categoryFilter)
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "submissionDate":
          return new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()
        case "creatorRating":
          return b.performance.averageRating - a.performance.averageRating
        case "category":
          return a.category.localeCompare(b.category)
        default:
          return 0
      }
    })
    
    setFilteredTemplates(result)
  }, [templates, activeTab, searchTerm, categoryFilter, sortBy])

  const refresh = async () => { 
    setRefreshing(true); 
    try { 
      const t = await adminTemplatesApi.list(); 
      setTemplates(t) 
    } finally { 
      setRefreshing(false) 
    } 
  }

  const act = async (id: string, fn: () => Promise<any>) => {
    setActingId(id)
    try { await fn(); await refresh() } catch (e: any) { setError(e?.message || 'Action failed') } finally { setActingId(null) }
  }

  const handleApproveTemplate = async (id: string) => {
    await act(id, () => adminTemplatesApi.approve(id))
  }

  const handleRejectTemplate = async (id: string, reason: string) => {
    await act(id, () => adminTemplatesApi.reject(id, reason))
  }

  const handleDeleteTemplate = async (id: string) => {
    await act(id, () => adminTemplatesApi.delete(id))
  }

  const handleViewTemplate = (template: Template) => {
    setSelectedTemplate(template)
    setShowTemplateDetail(true)
  }

  const handleFeatureTemplate = (id: string) => {
    // In a real implementation, this would feature the template
    alert(`Featuring template ${id}`)
  }

  const handleTrendingTemplate = (id: string) => {
    // In a real implementation, this would mark template as trending
    alert(`Marking template ${id} as trending`)
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-900/50 text-yellow-400'
      case 'approved': return 'bg-green-900/50 text-green-400'
      case 'rejected': return 'bg-red-900/50 text-red-400'
      case 'featured': return 'bg-purple-900/50 text-purple-400'
      case 'trending': return 'bg-blue-900/50 text-blue-400'
      default: return 'bg-gray-900/50 text-gray-400'
    }
  }

  // Get safety score color
  const getSafetyScoreColor = (score: string) => {
    switch (score) {
      case 'safe': return 'bg-green-900/50 text-green-400'
      case 'warning': return 'bg-yellow-900/50 text-yellow-400'
      case 'unsafe': return 'bg-red-900/50 text-red-400'
      default: return 'bg-gray-900/50 text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Template Management</h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors">
            Export Templates
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
            activeTab === 'all'
              ? 'text-[#4EFF9B] border-b-2 border-[#4EFF9B]'
              : 'text-[#A0C4B5] hover:text-[#E9F5EE]'
          }`}
          onClick={() => setActiveTab('all')}
        >
          All Templates
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'pending'
              ? 'text-[#4EFF9B] border-b-2 border-[#4EFF9B]'
              : 'text-[#A0C4B5] hover:text-[#E9F5EE]'
          }`}
          onClick={() => setActiveTab('pending')}
        >
          Pending Review <span className="ml-1 bg-yellow-900/50 text-yellow-400 rounded-full px-2 py-0.5 text-xs">5</span>
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'approved'
              ? 'text-[#4EFF9B] border-b-2 border-[#4EFF9B]'
              : 'text-[#A0C4B5] hover:text-[#E9F5EE]'
          }`}
          onClick={() => setActiveTab('approved')}
        >
          Approved
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'rejected'
              ? 'text-[#4EFF9B] border-b-2 border-[#4EFF9B]'
              : 'text-[#A0C4B5] hover:text-[#E9F5EE]'
          }`}
          onClick={() => setActiveTab('rejected')}
        >
          Rejected
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'featured'
              ? 'text-[#4EFF9B] border-b-2 border-[#4EFF9B]'
              : 'text-[#A0C4B5] hover:text-[#E9F5EE]'
          }`}
          onClick={() => setActiveTab('featured')}
        >
          Featured
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'trending'
              ? 'text-[#4EFF9B] border-b-2 border-[#4EFF9B]'
              : 'text-[#A0C4B5] hover:text-[#E9F5EE]'
          }`}
          onClick={() => setActiveTab('trending')}
        >
          Trending
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Search</label>
            <input
              type="text"
              placeholder="Title, description, tags"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
            >
              <option value="all">All Categories</option>
              <option value="Nature">Nature</option>
              <option value="Portraits">Portraits</option>
              <option value="Architecture">Architecture</option>
              <option value="Abstract">Abstract</option>
              <option value="Animals">Animals</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
            >
              <option value="submissionDate">Submission Date</option>
              <option value="creatorRating">Creator Rating</option>
              <option value="category">Category</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button 
              onClick={refresh}
              disabled={refreshing}
              className="w-full px-4 py-2 bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors disabled:opacity-50"
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.length === 0 ? (
          <div className="col-span-full bg-[#15362B] rounded-2xl p-12 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm text-center">
            <div className="text-5xl mb-4">🖼️</div>
            <h3 className="text-xl font-semibold mb-2">No Templates Found</h3>
            <p className="text-[#A0C4B5]">No templates match your current filters.</p>
          </div>
        ) : (
          filteredTemplates.map(template => (
            <div key={template.id} className="bg-[#15362B] rounded-2xl p-4 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
              <div className="relative mb-4">
                <div className="bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg h-48 flex items-center justify-center">
                  <span className="text-[#A0C4B5]">Template Preview</span>
                </div>
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(template.status)}`}>
                    {template.status.charAt(0).toUpperCase() + template.status.slice(1)}
                  </span>
                </div>
                {template.status === 'featured' && (
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 bg-purple-900/50 text-purple-400 rounded-full text-xs">
                      Featured
                    </span>
                  </div>
                )}
                {template.status === 'trending' && (
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 bg-blue-900/50 text-blue-400 rounded-full text-xs">
                      Trending
                    </span>
                  </div>
                )}
              </div>
              
              <h3 className="font-semibold mb-1">{template.title}</h3>
              <p className="text-sm text-[#A0C4B5] mb-2 line-clamp-2">{template.description}</p>
              
              <div className="flex justify-between items-center mb-3">
                <div className="text-sm">
                  <span className="text-[#A0C4B5]">by </span>
                  <span className="font-medium">{template.creator.name}</span>
                </div>
                <div className="text-sm">
                  <span className={`px-2 py-1 rounded-full ${
                    template.pricing.type === 'free' 
                      ? 'bg-green-900/50 text-green-400' 
                      : 'bg-purple-900/50 text-purple-400'
                  }`}>
                    {template.pricing.type === 'free' ? 'Free' : `₹${template.pricing.price}`}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {template.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-[#112C23] text-[#A0C4B5] rounded-full text-xs">
                    {tag}
                  </span>
                ))}
                {template.tags.length > 3 && (
                  <span className="px-2 py-1 bg-[#112C23] text-[#A0C4B5] rounded-full text-xs">
                    +{template.tags.length - 3}
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-center text-sm mb-4">
                <div>
                  <p className="text-[#A0C4B5]">Uses</p>
                  <p>{template.performance.totalUses}</p>
                </div>
                <div>
                  <p className="text-[#A0C4B5]">Rating</p>
                  <p>{template.performance.averageRating}</p>
                </div>
                <div>
                  <p className="text-[#A0C4B5]">Saves</p>
                  <p>{template.performance.saves}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewTemplate(template)}
                  className="flex-1 px-3 py-2 bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors text-sm"
                >
                  Review
                </button>
                {template.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApproveTemplate(template.id)}
                      disabled={actingId === template.id}
                      className="px-3 py-2 bg-green-900/50 hover:bg-green-900/70 text-green-400 rounded-lg transition-colors text-sm disabled:opacity-50"
                    >
                      {actingId === template.id ? 'Approving...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleRejectTemplate(template.id, 'Low quality')}
                      disabled={actingId === template.id}
                      className="px-3 py-2 bg-red-900/50 hover:bg-red-900/70 text-red-400 rounded-lg transition-colors text-sm disabled:opacity-50"
                    >
                      {actingId === template.id ? 'Rejecting...' : 'Reject'}
                    </button>
                  </>
                )}
                {template.status === 'approved' && (
                  <>
                    <button
                      onClick={() => handleFeatureTemplate(template.id)}
                      className="px-3 py-2 bg-purple-900/50 hover:bg-purple-900/70 text-purple-400 rounded-lg transition-colors text-sm"
                    >
                      Feature
                    </button>
                    <button
                      onClick={() => handleTrendingTemplate(template.id)}
                      className="px-3 py-2 bg-blue-900/50 hover:bg-blue-900/70 text-blue-400 rounded-lg transition-colors text-sm"
                    >
                      Trending
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Template Detail Modal */}
      {showTemplateDetail && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Template Review</h2>
              <button 
                onClick={() => setShowTemplateDetail(false)}
                className="text-[#A0C4B5] hover:text-[#E9F5EE]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Visual Section */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-[#112C23] rounded-xl p-4">
                  <h3 className="font-medium mb-4">Template Preview</h3>
                  <div className="bg-[#15362B] border border-[#4EFF9B]/20 rounded-lg h-80 flex items-center justify-center">
                    <span className="text-[#A0C4B5]">Template Image Preview</span>
                  </div>
                </div>
                
                <div className="bg-[#112C23] rounded-xl p-4">
                  <h3 className="font-medium mb-4">Additional Examples</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="bg-[#15362B] border border-[#4EFF9B]/20 rounded-lg h-24 flex items-center justify-center">
                        <span className="text-[#A0C4B5] text-sm">Example {i}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Template Information */}
              <div className="space-y-6">
                <div className="bg-[#112C23] rounded-xl p-4">
                  <h3 className="font-medium mb-4">Template Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[#A0C4B5] text-sm">Title</p>
                      <p>{selectedTemplate.title}</p>
                    </div>
                    <div>
                      <p className="text-[#A0C4B5] text-sm">Description</p>
                      <p>{selectedTemplate.description}</p>
                    </div>
                    <div>
                      <p className="text-[#A0C4B5] text-sm">Category</p>
                      <p>{selectedTemplate.category}</p>
                    </div>
                    <div>
                      <p className="text-[#A0C4B5] text-sm">Tags</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedTemplate.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-[#15362B] rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[#A0C4B5] text-sm">Pricing</p>
                      <p>
                        <span className={`px-2 py-1 rounded-full ${
                          selectedTemplate.pricing.type === 'free' 
                            ? 'bg-green-900/50 text-green-400' 
                            : 'bg-purple-900/50 text-purple-400'
                        }`}>
                          {selectedTemplate.pricing.type === 'free' ? 'Free' : `₹${selectedTemplate.pricing.price}`}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Creator Information */}
                <div className="bg-[#112C23] rounded-xl p-4">
                  <h3 className="font-medium mb-4">Creator</h3>
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#15362B] flex items-center justify-center mr-3">
                      {selectedTemplate.creator.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{selectedTemplate.creator.name}</p>
                      <p className="text-sm text-[#A0C4B5]">@{selectedTemplate.creator.username}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-[#A0C4B5]">Total Templates</p>
                      <p>42</p>
                    </div>
                    <div>
                      <p className="text-[#A0C4B5]">Average Rating</p>
                      <p>4.7</p>
                    </div>
                    <div>
                      <p className="text-[#A0C4B5]">Total Earnings</p>
                      <p>₹25,600</p>
                    </div>
                  </div>
                </div>
                
                {/* Auto Quality Checks */}
                <div className="bg-[#112C23] rounded-xl p-4">
                  <h3 className="font-medium mb-4">Auto Quality Checks</h3>
                  <div className="space-y-4">
                    {/* Content Safety */}
                    <div>
                      <p className="text-[#A0C4B5] text-sm mb-2">Content Safety</p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>NSFW Score</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${getSafetyScoreColor(selectedTemplate.autoChecks.contentSafety.nsfwScore)}`}>
                            {selectedTemplate.autoChecks.contentSafety.nsfwScore}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Violence</span>
                          <span>{selectedTemplate.autoChecks.contentSafety.violenceScore}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Hate Speech</span>
                          <span>{selectedTemplate.autoChecks.contentSafety.hateSpeechScore}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Overall Safety</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            selectedTemplate.autoChecks.contentSafety.overall === 'pass' 
                              ? 'bg-green-900/50 text-green-400' 
                              : selectedTemplate.autoChecks.contentSafety.overall === 'review' 
                                ? 'bg-yellow-900/50 text-yellow-400' 
                                : 'bg-red-900/50 text-red-400'
                          }`}>
                            {selectedTemplate.autoChecks.contentSafety.overall}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Prompt Quality */}
                    <div>
                      <p className="text-[#A0C4B5] text-sm mb-2">Prompt Quality</p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Clarity</span>
                          <span>{selectedTemplate.autoChecks.promptQuality.clarityScore}/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Effectiveness</span>
                          <span>{selectedTemplate.autoChecks.promptQuality.effectiveness}/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Grammar</span>
                          <span>{selectedTemplate.autoChecks.promptQuality.grammar}/100</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Image Quality */}
                    <div>
                      <p className="text-[#A0C4B5] text-sm mb-2">Image Quality</p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Resolution</span>
                          <span>{selectedTemplate.autoChecks.imageQuality.resolution}/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sharpness</span>
                          <span>{selectedTemplate.autoChecks.imageQuality.sharpness}/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Quality</span>
                          <span>{selectedTemplate.autoChecks.imageQuality.quality}/100</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Originality */}
                    <div>
                      <p className="text-[#A0C4B5] text-sm mb-2">Originality</p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Reverse Search</span>
                          <span>{selectedTemplate.autoChecks.originality.reverseSearch ? '⚠️ Found' : '✅ Clear'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Plagiarism</span>
                          <span>{selectedTemplate.autoChecks.originality.plagiarism ? '⚠️ Detected' : '✅ Clear'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Stock Photo</span>
                          <span>{selectedTemplate.autoChecks.originality.stockPhoto ? '⚠️ Detected' : '✅ Clear'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Review Actions */}
            <div className="mt-6 pt-6 border-t border-[#112C23]">
              <div className="flex justify-end space-x-3">
                {selectedTemplate.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => {
                        setShowTemplateDetail(false)
                        handleRejectTemplate(selectedTemplate.id, 'Low quality')
                      }}
                      className="px-4 py-2 bg-red-900/50 hover:bg-red-900/70 text-red-400 rounded-lg transition-colors"
                    >
                      Reject Template
                    </button>
                    <button
                      onClick={() => {
                        setShowTemplateDetail(false)
                        handleApproveTemplate(selectedTemplate.id)
                      }}
                      className="px-4 py-2 bg-[#4EFF9B] text-[#0D221A] font-medium rounded-lg hover:bg-[#3ad485] transition-colors"
                    >
                      Approve Template
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setShowTemplateDetail(false)}
                      className="px-4 py-2 bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        setShowTemplateDetail(false)
                        handleFeatureTemplate(selectedTemplate.id)
                      }}
                      className="px-4 py-2 bg-purple-900/50 hover:bg-purple-900/70 text-purple-400 rounded-lg transition-colors"
                    >
                      Feature Template
                    </button>
                    <button
                      onClick={() => {
                        setShowTemplateDetail(false)
                        handleTrendingTemplate(selectedTemplate.id)
                      }}
                      className="px-4 py-2 bg-blue-900/50 hover:bg-blue-900/70 text-blue-400 rounded-lg transition-colors"
                    >
                      Mark as Trending
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}