"use client"
import { useEffect, useState } from "react"
import { adminUsersApi } from "@/services/api"

type User = {
  _id: string
  name: string
  email: string
  role?: string
  points?: number
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    adminUsersApi.list().then(setUsers).catch(e => setError(e?.message || "Failed to load users"))
  }, [])

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Users</h2>
      {error && <p className="text-red-400">{error}</p>}
      <div className="card p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="py-2">Name</th>
              <th className="py-2">Email</th>
              <th className="py-2">Role</th>
              <th className="py-2">Points</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-t border-gray-800">
                <td className="py-2">{u.name}</td>
                <td className="py-2">{u.email}</td>
                <td className="py-2">{u.role ?? 'user'}</td>
                <td className="py-2">{u.points ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}