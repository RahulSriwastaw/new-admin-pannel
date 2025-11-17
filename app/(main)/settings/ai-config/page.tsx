"use client"
import { useEffect, useState } from "react"
import { adminAIConfigApi } from "@/services/api"

type ActiveConfig = {
  id: string
  provider: string
  name: string
  isActive: boolean
  modelVersion?: string
  costPerImage?: number
}

export default function AIConfigPage() {
  const [active, setActive] = useState<ActiveConfig | null>(null)
  const [form, setForm] = useState<any>({ provider: 'google_gemini', name: 'Gemini', apiKey: '', projectId: '', modelVersion: '' })
  const [message, setMessage] = useState<string | null>(null)
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    adminAIConfigApi.getActive().then(setActive).catch(()=>{})
  }, [])

  const submit = async () => {
    setMessage(null)
    try {
      const res = await adminAIConfigApi.createOrUpdate({ ...form, isActive: true })
      const id = res?.config?.id || res?.id || active?.id
      if (id) await adminAIConfigApi.activate(id)
      setMessage('Configuration saved and activated')
      const a = await adminAIConfigApi.getActive(); setActive(a)
    } catch (e: any) {
      setMessage(e?.message || 'Failed to save config')
    }
  }

  const test = async () => {
    if (!active?.id) return
    setTesting(true)
    try { const res = await adminAIConfigApi.test(active.id); setMessage(res?.message || 'Test successful') } catch (e: any) { setMessage(e?.message || 'Test failed') } finally { setTesting(false) }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">AI Configuration</h2>
      {message && <p className="text-sm">{message}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-4 space-y-2">
          <label>Provider</label>
          <select className="bg-gray-900 border border-gray-700 rounded p-2" value={form.provider} onChange={e=> setForm({ ...form, provider: e.target.value })}>
            <option value="google_gemini">Google Gemini</option>
            <option value="openai">OpenAI DALL·E</option>
            <option value="stability">Stability AI</option>
            <option value="minimax">MiniMax</option>
            <option value="custom">Custom</option>
          </select>
          <label>Name</label>
          <input className="bg-gray-900 border border-gray-700 rounded p-2" value={form.name} onChange={e=> setForm({ ...form, name: e.target.value })} />
          <label>API Key</label>
          <input className="bg-gray-900 border border-gray-700 rounded p-2" value={form.apiKey} onChange={e=> setForm({ ...form, apiKey: e.target.value })} />
          {form.provider==='google_gemini' && (<>
            <label>Project ID</label>
            <input className="bg-gray-900 border border-gray-700 rounded p-2" value={form.projectId} onChange={e=> setForm({ ...form, projectId: e.target.value })} />
          </>)}
          <label>Model Version</label>
          <input className="bg-gray-900 border border-gray-700 rounded p-2" value={form.modelVersion} onChange={e=> setForm({ ...form, modelVersion: e.target.value })} />
          <button className="px-3 py-2 rounded bg-primary" onClick={submit}>Save & Activate</button>
        </div>
        <div className="card p-4 space-y-2">
          <div className="font-semibold">Active</div>
          {active ? (
            <div className="text-sm">
              <div>Provider: {active.provider}</div>
              <div>Name: {active.name}</div>
              <div>Status: {active.isActive ? 'Active' : 'Inactive'}</div>
              <button className="mt-2 px-3 py-2 rounded bg-gray-700" onClick={test} disabled={testing}>{testing ? 'Testing...' : 'Test API'}</button>
            </div>
          ) : (
            <div className="text-sm opacity-70">No active configuration</div>
          )}
        </div>
      </div>
    </div>
  )
}