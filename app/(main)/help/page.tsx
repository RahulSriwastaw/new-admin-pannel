"use client"
import { useState } from "react"

type SupportTicket = {
  id: string
  subject: string
  user: string
  date: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
}

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState('tickets')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Mock support tickets data
  const supportTickets: SupportTicket[] = [
    {
      id: 'TKT-001',
      subject: 'User unable to generate images',
      user: 'John Doe',
      date: '2023-06-15',
      priority: 'high',
      status: 'open'
    },
    {
      id: 'TKT-002',
      subject: 'Payment gateway not working',
      user: 'Jane Smith',
      date: '2023-06-14',
      priority: 'urgent',
      status: 'in-progress'
    },
    {
      id: 'TKT-003',
      subject: 'Template approval request',
      user: 'Creator Studio',
      date: '2023-06-13',
      priority: 'medium',
      status: 'resolved'
    },
    {
      id: 'TKT-004',
      subject: 'Account verification issue',
      user: 'Mike Johnson',
      date: '2023-06-12',
      priority: 'low',
      status: 'closed'
    },
  ]

  const filteredTickets = supportTickets.filter(ticket => 
    ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
      case 'open': return 'bg-green-900/50 text-green-400'
      case 'in-progress': return 'bg-blue-900/50 text-blue-400'
      case 'resolved': return 'bg-purple-900/50 text-purple-400'
      case 'closed': return 'bg-gray-900/50 text-gray-400'
      default: return 'bg-gray-900/50 text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Help & Support</h1>
        <button className="px-4 py-2 bg-[#4EFF9B] text-[#0D221A] font-medium rounded-lg hover:bg-[#3ad485] transition-colors">
          New Ticket
        </button>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-[#112C23]">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'tickets'
              ? 'text-[#4EFF9B] border-b-2 border-[#4EFF9B]'
              : 'text-[#A0C4B5] hover:text-[#E9F5EE]'
          }`}
          onClick={() => setActiveTab('tickets')}
        >
          Support Tickets
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'documentation'
              ? 'text-[#4EFF9B] border-b-2 border-[#4EFF9B]'
              : 'text-[#A0C4B5] hover:text-[#E9F5EE]'
          }`}
          onClick={() => setActiveTab('documentation')}
        >
          Documentation
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'faq'
              ? 'text-[#4EFF9B] border-b-2 border-[#4EFF9B]'
              : 'text-[#A0C4B5] hover:text-[#E9F5EE]'
          }`}
          onClick={() => setActiveTab('faq')}
        >
          FAQ
        </button>
      </div>

      {/* Support Tickets */}
      {activeTab === 'tickets' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80 px-4 py-2 pl-10 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-[#A0C4B5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <div className="flex space-x-2">
              <select className="px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50">
                <option>All Statuses</option>
                <option>Open</option>
                <option>In Progress</option>
                <option>Resolved</option>
                <option>Closed</option>
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

          {/* Tickets Table */}
          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[#A0C4B5]">
                    <th className="pb-4">Ticket ID</th>
                    <th className="pb-4">Subject</th>
                    <th className="pb-4">User</th>
                    <th className="pb-4">Date</th>
                    <th className="pb-4">Priority</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-[#A0C4B5]">
                        No tickets found
                      </td>
                    </tr>
                  ) : (
                    filteredTickets.map((ticket) => (
                      <tr key={ticket.id} className="border-t border-[#112C23]">
                        <td className="py-4 font-medium">{ticket.id}</td>
                        <td className="py-4">{ticket.subject}</td>
                        <td className="py-4">{ticket.user}</td>
                        <td className="py-4">{ticket.date}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
                            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1).replace('-', ' ')}
                          </span>
                        </td>
                        <td className="py-4">
                          <button className="px-3 py-1 text-sm bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors">
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard 
              title="Open Tickets" 
              value="12" 
              change="+2" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              }
            />
            <StatCard 
              title="Avg. Response Time" 
              value="2.4h" 
              change="-0.3h" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard 
              title="Resolution Rate" 
              value="92%" 
              change="+3%" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard 
              title="Satisfaction" 
              value="4.7/5" 
              change="+0.1" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              }
            />
          </div>
        </div>
      )}

      {/* Documentation */}
      {activeTab === 'documentation' && (
        <div className="space-y-6">
          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4">Admin Documentation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DocCard 
                title="User Management" 
                description="Learn how to manage users, ban accounts, and verify creators."
                link="#"
              />
              <DocCard 
                title="Template Moderation" 
                description="Review and approve templates, handle flagged content."
                link="#"
              />
              <DocCard 
                title="Financial Controls" 
                description="Manage payments, payouts, and revenue tracking."
                link="#"
              />
              <DocCard 
                title="AI Configuration" 
                description="Set up and configure AI models for image generation."
                link="#"
              />
              <DocCard 
                title="Security Settings" 
                description="Configure 2FA, IP whitelisting, and session management."
                link="#"
              />
              <DocCard 
                title="Analytics Dashboard" 
                description="Understanding metrics and generating reports."
                link="#"
              />
            </div>
          </div>
        </div>
      )}

      {/* FAQ */}
      {activeTab === 'faq' && (
        <div className="space-y-6">
          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 shadow-lg backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <FAQItem 
                question="How do I approve a creator application?" 
                answer="Navigate to the Creators section, find the pending application, and click the 'Approve' button. The creator will receive a notification and gain access to creator features."
              />
              <FAQItem 
                question="What should I do if a template violates community guidelines?" 
                answer="Flag the template in the Templates section and select the appropriate violation reason. You can then reject the template with a detailed explanation to the creator."
              />
              <FAQItem 
                question="How do I process creator payouts?" 
                answer="Go to the Finances section and review pending withdrawal requests. Verify the creator's bank details and click 'Approve' to process the payout."
              />
              <FAQItem 
                question="How can I configure payment gateways?" 
                answer="In the Settings section under Payments, you can enable/disable gateways and configure API keys for each payment provider."
              />
              <FAQItem 
                question="How do I handle support tickets?" 
                answer="Check the Help section regularly for new tickets. Assign tickets to team members, respond to users, and update ticket status as issues are resolved."
              />
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

function DocCard({ title, description, link }: { 
  title: string, 
  description: string, 
  link: string 
}) {
  return (
    <div className="bg-[#112C23] rounded-xl p-5 hover:bg-[#112C23]/80 transition-colors">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-[#A0C4B5] text-sm mb-4">{description}</p>
      <a href={link} className="text-[#4EFF9B] text-sm font-medium hover:underline">
        Read Documentation →
      </a>
    </div>
  )
}

function FAQItem({ question, answer }: { 
  question: string, 
  answer: string 
}) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="border border-[#112C23] rounded-lg overflow-hidden">
      <button 
        className="w-full p-4 text-left flex justify-between items-center bg-[#112C23]/50 hover:bg-[#112C23]/80 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium">{question}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="p-4 bg-[#112C23]/30">
          <p className="text-[#A0C4B5]">{answer}</p>
        </div>
      )}
    </div>
  )
}