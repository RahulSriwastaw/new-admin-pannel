function normalizeBackendBase() {
  const source = (process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || '').trim();
  if (!source) return 'http://localhost:8080';
  try {
    const u = new URL(source);
    return `${u.protocol}//${u.host}`; // strip any path like /api/admin
  } catch {
    // If not a full URL, strip any trailing path segments including /api and beyond
    return source.replace(/\/(api)(\/.*)?$/i, '').replace(/\/$/, '');
  }
}

const BACKEND_BASE = normalizeBackendBase();
const API_BASE = `${BACKEND_BASE}/api`;

async function request(path: string, init?: RequestInit) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : undefined;
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
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
  revenue: (period: 'daily' | 'weekly' | 'monthly' = 'monthly') => request(`/admin/analytics/revenue?period=${period}`),
  users: (period: 'daily' | 'weekly' | 'monthly' = 'monthly') => request(`/admin/analytics/users?period=${period}`),
  topTemplates: () => request('/admin/analytics/templates'),
  topCreators: () => request('/admin/analytics/creators'),
}

export const adminUsersApi = {
  list: () => request('/admin/users'),
  ban: (id: string) => request(`/admin/users/${id}/ban`, { method: 'POST' }),
  unban: (id: string) => request(`/admin/users/${id}/unban`, { method: 'POST' }),
  verify: (id: string) => request(`/admin/users/${id}/verify`, { method: 'POST' }),
  addPoints: (id: string, points: number) => request(`/admin/users/${id}/points`, { method: 'POST', body: JSON.stringify({ points }) }),
}

export const adminTemplatesApi = {
  list: () => request('/admin/templates'),
  approve: (id: string) => request(`/admin/templates/${id}/approve`, { method: 'POST' }),
  reject: (id: string, reason: string) => request(`/admin/templates/${id}/reject`, { method: 'POST', body: JSON.stringify({ reason }) }),
  delete: (id: string) => request(`/admin/templates/${id}`, { method: 'DELETE' }),
}

export const adminCreatorsApi = {
  list: () => request('/admin/creators'),
  approve: (id: string) => request(`/admin/creators/${id}/approve`, { method: 'POST' }),
  reject: (id: string, reason: string) => request(`/admin/creators/${id}/reject`, { method: 'POST', body: JSON.stringify({ reason }) }),
  ban: (id: string) => request(`/admin/creators/${id}/ban`, { method: 'POST' }),
  unban: (id: string) => request(`/admin/creators/${id}/unban`, { method: 'POST' }),
  verify: (id: string) => request(`/admin/creators/${id}/verify`, { method: 'POST' }),
}