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
        <div className="min-h-screen">
          <header className="border-b border-gray-800">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
              <h1 className="text-xl font-semibold">Rupantar AI Admin</h1>
              <nav className="flex gap-4 text-sm">
                <a href="/dashboard" className="hover:text-primary">Dashboard</a>
                <a href="/users" className="hover:text-primary">Users</a>
                <a href="/creators" className="hover:text-primary">Creators</a>
                <a href="/templates" className="hover:text-primary">Templates</a>
                <a href="/moderation" className="hover:text-primary">Moderation</a>
              </nav>
            </div>
          </header>
          <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
        </div>
      </body>
    </html>
  )
}