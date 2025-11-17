const BACKEND_BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || '')
  .replace(/\/$/, '')
  || (process.env.NEXT_PUBLIC_API_URL || '')
  .replace(/\/$/, '')
  .replace(/\/api$/, '')
  || 'http://localhost:8080';
const API_BASE = `${BACKEND_BASE}/api`;

async function request(path: string, init?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {})
    },
    cache: 'no-store'
  })
  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new Error(errText || `Request failed: ${res.status}`)
  }
  return res.json()
}

export const adminAuthApi = {
  login: (data: { email: string, password: string }) => request('/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
}

export const adminAnalyticsApi = {
  dashboard: () => request('/admin/analytics/dashboard'),
}

export const adminUsersApi = {
  list: () => request('/admin/users'),
}

export const adminTemplatesApi = {
  list: () => request('/admin/templates'),
}

export const adminCreatorsApi = {
  list: () => request('/admin/creators'),
}