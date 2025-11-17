"use client"
import { useEffect, useState } from "react"
import { adminTemplatesApi } from "@/services/api"

type Template = {
  _id: string
  title: string
  status?: string
  usageCount?: number
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    adminTemplatesApi.list().then(setTemplates).catch(e => setError(e?.message || "Failed to load templates"))
  }, [])

  const refresh = async () => { setRefreshing(true); try { const t = await adminTemplatesApi.list(); setTemplates(t) } finally { setRefreshing(false) } }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Templates</h2>
      {error && <p className="text-red-400">{error}</p>}
      <div className="flex mb-2">
        <button className="px-3 py-2 rounded bg-gray-700" onClick={refresh} disabled={refreshing}>{refreshing ? 'Refreshing...' : 'Refresh'}</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map(t => (
          <div key={t._id} className="card p-4">
            <div className="font-semibold">{t.title}</div>
            <div className="text-sm opacity-70">Status: {t.status ?? 'approved'}</div>
            <div className="text-sm opacity-70">Uses: {t.usageCount ?? 0}</div>
          </div>
        ))}
      </div>
    </div>
  )
}