"use client"
import { useState } from "react"
import { adminAuthApi } from "@/services/api"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await adminAuthApi.login({ email, password })
      localStorage.setItem("admin_token", res.token)
      window.location.href = "/dashboard"
    } catch (err: any) {
      setError(err?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto">
      <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700"
                 type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700"
                 type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button className="px-4 py-2 rounded bg-primary hover:opacity-90 disabled:opacity-50" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="text-xs mt-2 opacity-70">Default: email `rahul@malik`, pass `Rupantramalik@rahul`</p>
    </div>
  )
}