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
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [pointsInput, setPointsInput] = useState<Record<string, string>>({})

  useEffect(() => {
    adminUsersApi.list().then(setUsers).catch(e => setError(e?.message || "Failed to load users"))
  }, [])

  const refresh = () => adminUsersApi.list().then(setUsers)
  const act = async (id: string, fn: () => Promise<any>) => {
    setLoadingId(id)
    try { await fn(); await refresh() } catch (e: any) { setError(e?.message || 'Action failed') } finally { setLoadingId(null) }
  }

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
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-t border-gray-800">
                <td className="py-2">{u.name}</td>
                <td className="py-2">{u.email}</td>
                <td className="py-2">{u.role ?? 'user'}</td>
                <td className="py-2">{u.points ?? 0}</td>
                <td className="py-2 space-x-2">
                  <button className="px-2 py-1 rounded bg-gray-700" disabled={loadingId===u._id} onClick={() => act(u._id, () => adminUsersApi.verify(u._id))}>Verify</button>
                  <button className="px-2 py-1 rounded bg-red-700" disabled={loadingId===u._id} onClick={() => act(u._id, () => adminUsersApi.ban(u._id))}>Ban</button>
                  <button className="px-2 py-1 rounded bg-green-700" disabled={loadingId===u._id} onClick={() => act(u._id, () => adminUsersApi.unban(u._id))}>Unban</button>
                  <input className="px-2 py-1 rounded bg-gray-900 border border-gray-700 w-20" placeholder="pts" value={pointsInput[u._id]||''} onChange={e=> setPointsInput(prev=> ({...prev, [u._id]: e.target.value}))} />
                  <button className="px-2 py-1 rounded bg-primary" disabled={loadingId===u._id} onClick={() => act(u._id, () => adminUsersApi.addPoints(u._id, parseInt(pointsInput[u._id]||'0',10)||0))}>Add</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}