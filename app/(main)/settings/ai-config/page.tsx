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
  const [list, setList] = useState<any[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [testing, setTesting] = useState(false)
  const [form, setForm] = useState<any>({ provider: 'openai', name: 'OpenAI', apiKey: '', modelVersion: '' })

  useEffect(() => {
    adminAIConfigApi.getActive().then(setActive).catch(()=>{})
    adminAIConfigApi.list().then(setList).catch(()=>{})
  }, [])

  const onProviderChange = (p: string) => {
    const presets: Record<string, any> = {
      openai: { provider: 'openai', name: 'OpenAI', apiKey: '', modelVersion: 'dall-e-3' },
      stability: { provider: 'stability', name: 'Stability', apiKey: '', modelVersion: 'stable-diffusion-xl-1024-v1-0' },
      google_gemini: { provider: 'google_gemini', name: 'Gemini', apiKey: '', projectId: '', modelVersion: '' },
      minimax: { provider: 'minimax', name: 'MiniMax', apiKey: '', endpoint: '' },
      minimax_i2i: { provider: 'minimax_i2i', name: 'MiniMax I2I', apiKey: '', endpoint: 'https://api.minimax.chat/v1/image/i2i', strength: 0.6 },
      custom: { provider: 'custom', name: 'Custom', endpoint: '', apiKey: '', settings: {} },
      quick_tools: { provider: 'quick_tools', name: 'Quick Tools', backgroundRemovalAPIKey: '', removeBgEndpoint: '', upscaleAPIKey: '', upscaleEndpoint: '', faceEnhanceAPIKey: '', faceEnhanceEndpoint: '', compressionAPIKey: '', compressionEndpoint: '' },
    }
    setForm(presets[p] || { provider: p, name: p, apiKey: '' })
  }

  const saveSettings = async () => {
    setMessage(null)
    try {
      const payload: any = { ...form, isActive: false }
      if (form.provider === 'custom' && typeof form.settings === 'string') {
        try { payload.settings = JSON.parse(form.settings || '{}') } catch { payload.settings = {} }
      }
      if (form.provider === 'minimax_i2i') {
        payload.strength = Number(form.strength ?? 0.6)
        payload.endpoint = form.endpoint || 'https://api.minimax.chat/v1/image/i2i'
      }
      if (form.provider === 'quick_tools') {
        payload.settings = {
          backgroundRemovalAPIKey: form.backgroundRemovalAPIKey || '',
          removeBgEndpoint: form.removeBgEndpoint || '',
          upscaleAPIKey: form.upscaleAPIKey || '',
          upscaleEndpoint: form.upscaleEndpoint || '',
          faceEnhanceAPIKey: form.faceEnhanceAPIKey || '',
          faceEnhanceEndpoint: form.faceEnhanceEndpoint || '',
          compressionAPIKey: form.compressionAPIKey || '',
          compressionEndpoint: form.compressionEndpoint || '',
        }
        delete payload.apiKey
        delete payload.endpoint
        delete payload.modelVersion
        delete payload.projectId
      }
      const res = await adminAIConfigApi.createOrUpdate(payload)
      const nextList = await adminAIConfigApi.list(); setList(nextList)
      setMessage('Settings saved')
    } catch (e: any) {
      setMessage(e?.message || 'Failed to save settings')
    }
  }

  const activateProvider = async (id?: string) => {
    setMessage(null)
    const targetId = id || active?.id
    if (!targetId) return
    try {
      await adminAIConfigApi.activate(targetId)
      const a = await adminAIConfigApi.getActive(); setActive(a)
      const nextList = await adminAIConfigApi.list(); setList(nextList)
      setMessage('Provider activated')
    } catch (e: any) {
      setMessage(e?.message || 'Failed to activate')
    }
  }

  const testProvider = async () => {
    if (!active?.id) return
    setTesting(true)
    try {
      const res = await adminAIConfigApi.test(active.id)
      const msg = res?.success ? `Test successful (${res?.provider || active.provider} - ${res?.model || active.name})` : 'Test failed'
      setMessage(msg)
    } catch (e: any) {
      setMessage(e?.message || 'Test failed')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">AI Configuration</h2>
      {message && <p className="text-sm">{message}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-4 space-y-3">
          <label>Provider</label>
          <select className="bg-gray-900 border border-gray-700 rounded p-2" value={form.provider} onChange={e=> onProviderChange(e.target.value)}>
            <option value="openai">OpenAI</option>
            <option value="stability">Stability AI</option>
            <option value="google_gemini">Google Gemini</option>
            <option value="minimax">MiniMax</option>
            <option value="minimax_i2i">MiniMax I2I</option>
            <option value="custom">Custom</option>
            <option value="quick_tools">Quick Tools</option>
          </select>
          <label>Name</label>
          <input className="bg-gray-900 border border-gray-700 rounded p-2" value={form.name || ''} onChange={e=> setForm({ ...form, name: e.target.value })} />

          {(form.provider === 'openai' || form.provider === 'stability') && (
            <>
              <label>API Key</label>
              <input className="bg-gray-900 border border-gray-700 rounded p-2" value={form.apiKey || ''} onChange={e=> setForm({ ...form, apiKey: e.target.value })} />
              <label>Model Version</label>
              <input className="bg-gray-900 border border-gray-700 rounded p-2" value={form.modelVersion || ''} onChange={e=> setForm({ ...form, modelVersion: e.target.value })} />
            </>
          )}

          {form.provider === 'google_gemini' && (
            <>
              <label>API Key</label>
              <input className="bg-gray-900 border border-gray-700 rounded p-2" value={form.apiKey || ''} onChange={e=> setForm({ ...form, apiKey: e.target.value })} />
              <label>Project ID</label>
              <input className="bg-gray-900 border border-gray-700 rounded p-2" value={form.projectId || ''} onChange={e=> setForm({ ...form, projectId: e.target.value })} />
            </>
          )}

          {form.provider === 'minimax' && (
            <>
              <label>API Key</label>
              <input className="bg-gray-900 border border-gray-700 rounded p-2" value={form.apiKey || ''} onChange={e=> setForm({ ...form, apiKey: e.target.value })} />
              <label>Endpoint (optional)</label>
              <input className="bg-gray-900 border border-gray-700 rounded p-2" value={form.endpoint || ''} onChange={e=> setForm({ ...form, endpoint: e.target.value })} />
            </>
          )}
          {form.provider === 'minimax_i2i' && (
            <>
              <label>API Key</label>
              <input className="bg-gray-900 border border-gray-700 rounded p-2" value={form.apiKey || ''} onChange={e=> setForm({ ...form, apiKey: e.target.value })} />
              <label>Endpoint</label>
              <input className="bg-gray-900 border border-gray-700 rounded p-2" value={form.endpoint || 'https://api.minimax.chat/v1/image/i2i'} onChange={e=> setForm({ ...form, endpoint: e.target.value })} />
              <label>Strength</label>
              <input type="number" step="0.1" min="0" max="1" className="bg-gray-900 border border-gray-700 rounded p-2" value={form.strength ?? 0.6} onChange={e=> setForm({ ...form, strength: Number(e.target.value) })} />
            </>
          )}

          {form.provider === 'custom' && (
            <>
              <label>Endpoint</label>
              <input className="bg-gray-900 border border-gray-700 rounded p-2" value={form.endpoint || ''} onChange={e=> setForm({ ...form, endpoint: e.target.value })} />
              <label>API Key</label>
              <input className="bg-gray-900 border border-gray-700 rounded p-2" value={form.apiKey || ''} onChange={e=> setForm({ ...form, apiKey: e.target.value })} />
              <label>Body JSON</label>
              <textarea className="bg-gray-900 border border-gray-700 rounded p-2 h-32" value={typeof form.settings === 'string' ? form.settings : JSON.stringify(form.settings || {}, null, 2)} onChange={e=> setForm({ ...form, settings: e.target.value })} />
            </>
          )}

          {form.provider === 'quick_tools' && (
            <>
              <p className="text-sm opacity-70">Configure API keys and endpoints for quick tools</p>
              <label>Background Removal API Key</label>
              <input className="bg-gray-900 border border-gray-700 rounded p-2" value={form.backgroundRemovalAPIKey || ''} onChange={e=> setForm({ ...form, backgroundRemovalAPIKey: e.target.value })} />
              <label>Background Removal Endpoint</label>
              <input className="bg-gray-900 border border-gray-700 rounded p-2" value={form.removeBgEndpoint || ''} onChange={e=> setForm({ ...form, removeBgEndpoint: e.target.value })} />

              <label>Upscale API Key</label>
              <input className="bg-gray-900 border border-gray-700 rounded p-2" value={form.upscaleAPIKey || ''} onChange={e=> setForm({ ...form, upscaleAPIKey: e.target.value })} />
              <label>Upscale Endpoint</label>
              <input className="bg-gray-900 border border-gray-700 rounded p-2" value={form.upscaleEndpoint || ''} onChange={e=> setForm({ ...form, upscaleEndpoint: e.target.value })} />

              <label>Face Enhance API Key</label>
              <input className="bg-gray-900 border border-gray-700 rounded p-2" value={form.faceEnhanceAPIKey || ''} onChange={e=> setForm({ ...form, faceEnhanceAPIKey: e.target.value })} />
              <label>Face Enhance Endpoint</label>
              <input className="bg-gray-900 border border-gray-700 rounded p-2" value={form.faceEnhanceEndpoint || ''} onChange={e=> setForm({ ...form, faceEnhanceEndpoint: e.target.value })} />

              <label>Compression API Key</label>
              <input className="bg-gray-900 border border-gray-700 rounded p-2" value={form.compressionAPIKey || ''} onChange={e=> setForm({ ...form, compressionAPIKey: e.target.value })} />
              <label>Compression Endpoint</label>
              <input className="bg-gray-900 border border-gray-700 rounded p-2" value={form.compressionEndpoint || ''} onChange={e=> setForm({ ...form, compressionEndpoint: e.target.value })} />
            </>
          )}

          <div className="flex gap-2 pt-2">
            <button className="px-3 py-2 rounded bg-primary" onClick={saveSettings}>Save Settings</button>
            <button className="px-3 py-2 rounded bg-gray-700" onClick={() => activateProvider()}>Activate Provider</button>
            <button className="px-3 py-2 rounded bg-gray-700" disabled={!active?.id || testing} onClick={testProvider}>{testing ? 'Testing...' : 'Test Provider'}</button>
          </div>
        </div>

        <div className="card p-4 space-y-3">
          <div className="font-semibold">Active Configuration</div>
          {active ? (
            <div className="text-sm">
              <div>Provider: {active.provider}</div>
              <div>Name: {active.name}</div>
              <div>Model: {active.modelVersion || '-'}</div>
              <div>Cost/Image: {active.costPerImage ?? 0}</div>
            </div>
          ) : (
            <div className="text-sm opacity-70">No active configuration</div>
          )}

          <div className="font-semibold pt-4">Saved Configurations</div>
          <div className="space-y-2">
            {Array.isArray(list) && list.length > 0 ? (
              list.map((c: any) => (
                <div key={c._id || c.id} className="flex items-center justify-between border border-gray-800 rounded p-2 text-sm">
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="opacity-70">{c.provider}</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-2 py-1 rounded bg-gray-700" onClick={() => activateProvider(c._id || c.id)}>Activate</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm opacity-70">No saved configurations</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}