import './globals.css'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'Rupantar AI Admin',
  description: 'Admin panel for managing users, templates, creators, analytics',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 bg-[#112C23] min-h-screen p-6 flex flex-col">
            {/* Avatar */}
            <div className="mb-10">
              <div className="w-12 h-12 rounded-full bg-[#4EFF9B] flex items-center justify-center text-[#0D221A] font-bold text-xl">
                A
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1">
              <ul className="space-y-2">
                <li>
                  <a href="/dashboard" className="flex items-center p-3 rounded-xl bg-[#4EFF9B]/20 text-[#4EFF9B] font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="/users" className="flex items-center p-3 rounded-xl text-[#A0C4B5] hover:bg-[#15362B] hover:text-[#E9F5EE] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Users
                  </a>
                </li>
                <li>
                  <a href="/creators" className="flex items-center p-3 rounded-xl text-[#A0C4B5] hover:bg-[#15362B] hover:text-[#E9F5EE] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Creators
                  </a>
                </li>
                <li>
                  <a href="/templates" className="flex items-center p-3 rounded-xl text-[#A0C4B5] hover:bg-[#15362B] hover:text-[#E9F5EE] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                    Templates
                  </a>
                </li>
                <li>
                  <a href="/finances" className="flex items-center p-3 rounded-xl text-[#A0C4B5] hover:bg-[#15362B] hover:text-[#E9F5EE] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Finances
                  </a>
                </li>
                <li>
                  <a href="/settings" className="flex items-center p-3 rounded-xl text-[#A0C4B5] hover:bg-[#15362B] hover:text-[#E9F5EE] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </a>
                </li>
                <li>
                  <a href="/help" className="flex items-center p-3 rounded-xl text-[#A0C4B5] hover:bg-[#15362B] hover:text-[#E9F5EE] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Help
                  </a>
                </li>
                <li>
                  <a href="/reports" className="flex items-center p-3 rounded-xl text-[#A0C4B5] hover:bg-[#15362B] hover:text-[#E9F5EE] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Reports
                  </a>
                </li>
              </ul>
            </nav>
            
            {/* Sidebar Footer */}
            <div className="mt-auto pt-6 border-t border-[#15362B]">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#4EFF9B] flex items-center justify-center text-[#0D221A] font-bold">
                  A
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-[#A0C4B5]">admin@rupantara.ai</p>
                </div>
              </div>
            </div>
          </aside>
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Top Header */}
            <header className="bg-[#15362B] border-b border-[#4EFF9B]/20 p-4">
              <div className="flex items-center justify-between">
                {/* Search Bar */}
                <div className="relative w-96">
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full bg-[#112C23] rounded-xl py-2 px-4 pl-10 text-[#E9F5EE] focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-[#A0C4B5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                {/* Right Side Icons */}
                <div className="flex items-center space-x-4">
                  {/* Notification Bell */}
                  <button className="relative p-2 rounded-full hover:bg-[#112C23] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#A0C4B5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[#4EFF9B] rounded-full"></span>
                  </button>
                  
                  {/* User Profile */}
                  <div className="w-10 h-10 rounded-full bg-[#4EFF9B] flex items-center justify-center text-[#0D221A] font-bold cursor-pointer">
                    A
                  </div>
                </div>
              </div>
            </header>
            
            {/* Page Content */}
            <main className="flex-1 p-6 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}