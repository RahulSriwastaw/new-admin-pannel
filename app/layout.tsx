import './globals.css'
import type { ReactNode } from 'react'
import { Sidebar } from '@/components/Sidebar'

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
          <Sidebar />

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