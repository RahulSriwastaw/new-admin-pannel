"use client"
import { useEffect, useState } from "react"
import { adminCreatorsApi } from "@/services/api"

type Creator = {
  _id: string
  name: string
  totalEarnings?: number
  status?: string
}

export default function CreatorsPage() {
  const [creators, setCreators] = useState<Creator[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    adminCreatorsApi.list().then(setCreators).catch(e => setError(e?.message || "Failed to load creators"))
  }, [])

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Creators</h2>
      {error && <p className="text-red-400">{error}</p>}
      <div className="card p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="py-2">Name</th>
              <th className="py-2">Status</th>
              <th className="py-2">Earnings</th>
            </tr>
          </thead>
          <tbody>
            {creators.map(c => (
              <tr key={c._id} className="border-t border-gray-800">
                <td className="py-2">{c.name}</td>
                <td className="py-2">{c.status ?? 'active'}</td>
                <td className="py-2">₹{(c.totalEarnings ?? 0).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}