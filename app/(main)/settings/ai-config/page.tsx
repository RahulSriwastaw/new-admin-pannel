"use client"
import { useState, useEffect } from "react"
import { adminAIConfigApi } from "@/services/api"

type AIModel = {
  id: string
  name: string
  provider: string
  apiKey: string
  isActive: boolean
  config: {
    model?: string
    quality?: string
    style?: string
    safetySettings?: any
  }
}

export default function AIConfigPage() {
  const [models, setModels] = useState<AIModel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeModel, setActiveModel] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    provider: 'gemini',
    apiKey: '',
    model: '',
    quality: 'standard',
    style: 'vivid'
  })

  useEffect(() => {
    loadModels()
  }, [])

  const loadModels = async () => {
    try {
      setLoading(true)
      const data = await adminAIConfigApi.list()
      setModels(data)
      const active = data.find((m: any) => m.isActive)
      if (active) setActiveModel(active.id)
    } catch (err: any) {
      setError(err?.message || "Failed to load AI models")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const modelData = {
        name: formData.name,
        provider: formData.provider,
        apiKey: formData.apiKey,
        config: {
          model: formData.model,
          quality: formData.quality,
          style: formData.style
        }
      }
      
      await adminAIConfigApi.createOrUpdate(modelData)
      setShowForm(false)
      setFormData({
        name: '',
        provider: 'gemini',
        apiKey: '',
        model: '',
        quality: 'standard',
        style: 'vivid'
      })
      loadModels()
    } catch (err: any) {
      setError(err?.message || "Failed to save model")
    }
  }

  const handleActivate = async (id: string) => {
    try {
      await adminAIConfigApi.activate(id)
      setActiveModel(id)
      loadModels()
    } catch (err: any) {
      setError(err?.message || "Failed to activate model")
    }
  }

  const handleTest = async (id: string) => {
    try {
      const result = await adminAIConfigApi.test(id)
      alert(`Test successful! Response time: ${result.responseTime}ms`)
    } catch (err: any) {
      setError(err?.message || "Test failed")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4EFF9B]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">AI Configuration</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-[#4EFF9B] text-[#0D221A] font-medium rounded-lg hover:bg-[#3ad485] transition-colors"
        >
          Add New Model
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* Model List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <div 
            key={model.id} 
            className={`bg-[#15362B] rounded-2xl p-6 border ${
              activeModel === model.id 
                ? 'border-[#4EFF9B] shadow-lg shadow-[#4EFF9B]/20' 
                : 'border-[#4EFF9B]/20'
            } backdrop-blur-sm transition-all`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{model.name}</h3>
                <p className="text-[#A0C4B5] text-sm">{model.provider}</p>
              </div>
              {model.isActive && (
                <span className="px-2 py-1 bg-[#4EFF9B]/20 text-[#4EFF9B] text-xs rounded-full">
                  Active
                </span>
              )}
            </div>

            <div className="space-y-3 mb-6">
              <div>
                <p className="text-[#A0C4B5] text-sm">Model</p>
                <p className="text-[#E9F5EE]">{model.config.model || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-[#A0C4B5] text-sm">Quality</p>
                <p className="text-[#E9F5EE]">{model.config.quality || 'Standard'}</p>
              </div>
              <div>
                <p className="text-[#A0C4B5] text-sm">Style</p>
                <p className="text-[#E9F5EE]">{model.config.style || 'Vivid'}</p>
              </div>
            </div>

            <div className="flex space-x-2">
              {!model.isActive && (
                <button
                  onClick={() => handleActivate(model.id)}
                  className="flex-1 px-3 py-2 bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors text-sm"
                >
                  Activate
                </button>
              )}
              <button
                onClick={() => handleTest(model.id)}
                className="flex-1 px-3 py-2 bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors text-sm"
              >
                Test
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Model Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#15362B] rounded-2xl p-6 border border-[#4EFF9B]/20 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Add AI Model</h2>
              <button 
                onClick={() => setShowForm(false)}
                className="text-[#A0C4B5] hover:text-[#E9F5EE]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Model Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Provider</label>
                <select
                  value={formData.provider}
                  onChange={(e) => setFormData({...formData, provider: e.target.value})}
                  className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                >
                  <option value="gemini">Google Gemini</option>
                  <option value="dalle">DALL-E 3</option>
                  <option value="stability">Stability AI</option>
                  <option value="custom">Custom API</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">API Key</label>
                <input
                  type="password"
                  value={formData.apiKey}
                  onChange={(e) => setFormData({...formData, apiKey: e.target.value})}
                  className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Model Version</label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                  className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                  placeholder="e.g., imagen-3.0, dall-e-3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Quality</label>
                  <select
                    value={formData.quality}
                    onChange={(e) => setFormData({...formData, quality: e.target.value})}
                    className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                  >
                    <option value="standard">Standard</option>
                    <option value="hd">HD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#A0C4B5] mb-2">Style</label>
                  <select
                    value={formData.style}
                    onChange={(e) => setFormData({...formData, style: e.target.value})}
                    className="w-full px-4 py-2 bg-[#112C23] border border-[#4EFF9B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EFF9B]/50"
                  >
                    <option value="vivid">Vivid</option>
                    <option value="natural">Natural</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 bg-[#112C23] hover:bg-[#4EFF9B]/20 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#4EFF9B] text-[#0D221A] font-medium rounded-lg hover:bg-[#3ad485] transition-colors"
                >
                  Save Model
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}