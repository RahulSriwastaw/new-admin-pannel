"use client"
import { useEffect, useState } from "react"
import { adminTemplatesApi } from "@/services/api"

type Template = {
  id: string
  title: string
  status?: string
  usageCount?: number
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [actingId, setActingId] = useState<string | null>(null)

  useEffect(() => {
    adminTemplatesApi.list().then(setTemplates).catch(e => setError(e?.message || "Failed to load templates"))
  }, [])

  const refresh = async () => { setRefreshing(true); try { const t = await adminTemplatesApi.list(); setTemplates(t) } finally { setRefreshing(false) } }

  const act = async (id: string, fn: () => Promise<any>) => {
    setActingId(id)
    try { await fn(); await refresh() } catch (e: any) { setError(e?.message || 'Action failed') } finally { setActingId(null) }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Templates</h2>
      {error && <p className="text-red-400">{error}</p>}
      <div className="flex mb-2">
        <button className="px-3 py-2 rounded bg-gray-700" onClick={refresh} disabled={refreshing}>{refreshing ? 'Refreshing...' : 'Refresh'}</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map(t => (
          <div key={t.id} className="card p-4">
            <div className="font-semibold">{t.title}</div>
            <div className="text-sm opacity-70">Status: {t.status ?? 'approved'}</div>
            <div className="text-sm opacity-70">Uses: {t.usageCount ?? 0}</div>
            <div className="mt-2 space-x-2">
              <button className="px-2 py-1 rounded bg-green-700" disabled={actingId===t.id} onClick={() => act(t.id, () => adminTemplatesApi.approve(t.id))}>Approve</button>
              <button className="px-2 py-1 rounded bg-red-700" disabled={actingId===t.id} onClick={() => act(t.id, () => adminTemplatesApi.reject(t.id, 'Not suitable'))}>Reject</button>
              <button className="px-2 py-1 rounded bg-gray-700" disabled={actingId===t.id} onClick={() => act(t.id, () => adminTemplatesApi.delete(t.id))}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}