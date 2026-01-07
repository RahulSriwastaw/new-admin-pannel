
import {
  API_BASE_URL
} from '../constants';
import { User, CreatorApplication, Transaction, AIModelConfig, SystemMetrics, Template, AirtableConfig, PointsPackage, PaymentGatewayConfig, SubAdmin, NotificationLog, FinanceConfig, Category, ToolConfig, AdsConfig } from '../types';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

const getUploadHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Helper for safe fetching with timeout and fallback
const fetchWithFallback = async <T>(endpoint: string, _fallback: T): Promise<T> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API Error ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const api = {
  // Auth
  login: async (id: string, pass: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    const res = await fetch(`${API_BASE_URL}/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: id, password: pass }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      throw new Error("Invalid Credentials");
    }
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      if (data.user) {
        localStorage.setItem('adminUser', JSON.stringify(data.user));
      }
    }
    return data;
  },

  updateAdminProfile: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/admin/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      throw new Error('Failed to update admin profile');
    }
    return true;
  },

  // Dashboard
  getMetrics: () => fetchWithFallback<SystemMetrics>('/admin/metrics', {} as any),

  // Users
  getUsers: async (): Promise<User[]> => {
    return fetchWithFallback<User[]>('/admin/users', [] as any);
  },

  setUserTempPassword: async (userId: string, tempPassword: string) => {
    const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/temp-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ tempPassword })
    });
    if (!res.ok) {
      throw new Error('Failed to set temporary password');
    }
    return true;
  },

  // Quick Tools Config
  getToolsConfig: () => fetchWithFallback<ToolConfig>('/admin/tools/config', {} as any),
  updateToolsConfig: async (tools: ToolConfig['tools']) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/tools/config`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ tools })
      });
      if (res.ok) return await res.json();
      throw new Error('Failed');
    } catch (e) {
      throw e;
    }
  },

  createUser: async (userData: any) => {
    try {
      // Backend snippet doesn't explicitly show admin create user, trying standard rest endpoint
      // If fails, we might need to use /auth/register but that's for public
      const res = await fetch(`${API_BASE_URL}/admin/users`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      });
      if (res.ok) return await res.json();
      throw new Error("Failed");
    } catch (e) {
      throw e;
    }
  },

  updateUserStatus: async (userId: string, status: User['status']) => {
    try {
      await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      return true;
    } catch (e) {
      throw e;
    }
  },

  updateUser: async (id: string, data: Partial<User>) => {
    try {
      await fetch(`${API_BASE_URL}/admin/users/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      return true;
    } catch (e) {
      throw e;
    }
  },

  deleteUser: async (userId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
      const error = await res.json().catch(() => ({ error: 'Failed to delete user' }));
      throw new Error(error.error || error.message || 'Failed to delete user');
    } catch (e) {
      throw e;
    }
  },

  bulkDeleteUsers: async (userIds: string[]) => {
    try {
      // Delete users one by one (backend doesn't have bulk delete endpoint)
      const results = await Promise.allSettled(
        userIds.map(userId => api.deleteUser(userId))
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      if (failed > 0) {
        const errors = results
          .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
          .map(r => r.reason?.message || 'Unknown error');
        throw new Error(`Failed to delete ${failed} user(s). ${errors.join(', ')}`);
      }

      return { success: true, deleted: successful };
    } catch (e) {
      throw e;
    }
  },

  bulkUpdateUsers: async (userIds: string[], updates: Partial<User>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/bulk`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ userIds, updates })
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Failed to update users' }));
        throw new Error(errorData.error || errorData.message || `HTTP ${res.status}`);
      }
      return true;
    } catch (e) {
      throw e;
    }
  },

  // Creators
  getCreatorApplications: () => fetchWithFallback<CreatorApplication[]>('/admin/creators', [] as any),

  addCreator: async (data: Partial<CreatorApplication>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/creators`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
      throw new Error("Failed to add creator");
    } catch (e) {
      throw e;
    }
  },

  updateCreator: async (id: string, data: Partial<CreatorApplication>) => {
    try {
      if (data.status) {
        const res = await fetch(`${API_BASE_URL}/admin/creators/${id}/status`, {
          method: 'PATCH',
          headers: getAuthHeaders(),
          body: JSON.stringify({ status: data.status })
        });
        return res.ok;
      }
      return true;
    } catch (e) {
      throw e;
    }
  },

  deleteCreator: async (id: string) => {
    throw new Error('Not supported');
  },

  approveCreatorApplication: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/creators/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: 'approved' })
      });
      return res.ok;
    } catch (e) {
      throw e;
    }
  },

  rejectCreatorApplication: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/creators/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: 'rejected' })
      });
      return res.ok;
    } catch (e) {
      throw e;
    }
  },

  getCreatorProfile: async (userId: string) => {
    return fetchWithFallback<any>(`/admin/creators/${userId}/profile`, null);
  },

  // Finance
  getTransactions: () => fetchWithFallback<Transaction[]>('/admin/finance/transactions', [] as any),

  // Points Packages
  getPointsPackages: () => fetchWithFallback<PointsPackage[]>('/admin/finance/packages', [] as any),

  addPointsPackage: async (pkg: Omit<PointsPackage, 'id'>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/finance/packages`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(pkg)
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Failed to create package' }));
        throw new Error(error.error || error.message || 'Failed to create package');
      }
      return await res.json();
    } catch (e: any) {
      throw new Error(e.message || 'Failed to create package');
    }
  },

  updatePointsPackage: async (id: string, updates: Partial<PointsPackage>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/finance/packages/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Failed to update package' }));
        throw new Error(error.error || error.message || 'Failed to update package');
      }
      return true;
    } catch (e: any) {
      throw new Error(e.message || 'Failed to update package');
    }
  },

  deletePointsPackage: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/finance/packages/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Failed to delete package' }));
        throw new Error(error.error || error.message || 'Failed to delete package');
      }
      return true;
    } catch (e: any) {
      throw new Error(e.message || 'Failed to delete package');
    }
  },

  // Subscription Plans
  getSubscriptionPlans: () => fetchWithFallback<{ plans: any[] }>('/admin/subscriptions/plans', { plans: [] }),

  addSubscriptionPlan: async (plan: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/subscriptions/plans`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(plan)
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Failed to create plan' }));
        throw new Error(error.error || error.message || 'Failed to create plan');
      }
      return await res.json();
    } catch (e: any) {
      throw new Error(e.message || 'Failed to create plan');
    }
  },

  updateSubscriptionPlan: async (id: string, updates: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/subscriptions/plans/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Failed to update plan' }));
        throw new Error(error.error || error.message || 'Failed to update plan');
      }
      return true;
    } catch (e: any) {
      throw new Error(e.message || 'Failed to update plan');
    }
  },

  deleteSubscriptionPlan: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/subscriptions/plans/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Failed to delete plan' }));
        throw new Error(error.error || error.message || 'Failed to delete plan');
      }
      return true;
    } catch (e: any) {
      throw new Error(e.message || 'Failed to delete plan');
    }
  },

  // User Subscriptions
  getSubscriptions: (status?: string) => {
    const url = status ? `/admin/subscriptions?status=${status}` : '/admin/subscriptions';
    return fetchWithFallback<{ subscriptions: any[] }>(url, { subscriptions: [] });
  },

  cancelUserSubscription: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/subscriptions/${id}/cancel`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Failed to cancel subscription' }));
        throw new Error(error.error || error.message || 'Failed to cancel subscription');
      }
      return true;
    } catch (e: any) {
      throw new Error(e.message || 'Failed to cancel subscription');
    }
  },

  // Payment Gateways
  getPaymentGateways: () => fetchWithFallback<PaymentGatewayConfig[]>('/admin/finance/gateways', [] as any),
  createPaymentGateway: async (config: Omit<PaymentGatewayConfig, 'id'>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/finance/gateways`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(config)
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Failed to create gateway' }));
        throw new Error(error.error || error.message || 'Failed to create gateway');
      }
      return await res.json();
    } catch (e: any) {
      throw new Error(e.message || 'Failed to create gateway');
    }
  },

  updateGatewayConfig: async (id: string, config: Partial<PaymentGatewayConfig>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/finance/gateways/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(config)
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Failed to update gateway' }));
        throw new Error(error.error || error.message || 'Failed to update gateway');
      }
      const updated = await res.json();
      return updated;
    } catch (e: any) {
      throw new Error(e.message || 'Failed to update gateway');
    }
  },

  toggleGatewayActive: async (id: string, isActive: boolean) => {
    try {
      await fetch(`${API_BASE_URL}/admin/finance/gateways/${id}/toggle`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isActive })
      });
      return true;
    } catch (e) {
      throw e;
    }
  },
  testGatewayConnection: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/finance/gateways/${id}/test`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (!res.ok) return false;
      const data = await res.json().catch(() => ({ success: true }));
      return !!data.success;
    } catch (e) {
      return false;
    }
  },
  deletePaymentGateway: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/finance/gateways/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to delete gateway');
      return true;
    } catch (e) {
      throw e;
    }
  },

  // Finance Config
  getFinanceConfig: () => fetchWithFallback<FinanceConfig>('/admin/finance/config', {} as any),

  updateFinanceConfig: async (config: FinanceConfig) => {
    try {
      await fetch(`${API_BASE_URL}/admin/finance/config`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(config)
      });
      return true;
    } catch (e) {
      throw e;
    }
  },

  // AI Guard Rules
  getGuardRules: async (): Promise<any[]> => {
    try {
      return await fetchWithFallback<any[]>('/admin/guard-rules', []);
    } catch (e) { return []; }
  },
  addGuardRule: async (rule: any) => {
    const res = await fetch(`${API_BASE_URL}/admin/guard-rules`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(rule)
    });
    return await res.json();
  },
  updateGuardRule: async (id: string, updates: any) => {
    const res = await fetch(`${API_BASE_URL}/admin/guard-rules/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    return await res.json();
  },
  deleteGuardRule: async (id: string) => {
    await fetch(`${API_BASE_URL}/admin/guard-rules/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    return true;
  },
  seedGuardRules: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/guard-rules/seed`, { method: 'POST', headers: getAuthHeaders() });
    return await res.json();
  },

  // AI Config
  getAIModels: async (): Promise<AIModelConfig[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/ai-models`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data as AIModelConfig[];
        if ((data as any)?.models) return (data as any).models as AIModelConfig[];
      }
    } catch (e) { }
    throw new Error('Failed to load AI models');
  },

  addAIModel: async (model: Partial<AIModelConfig>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/ai-models`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(model)
      });
      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
        } catch (e) {
          throw new Error(`Server Error (${res.status}): ${res.statusText}`);
        }
        throw new Error(errorData.message || errorData.error || 'Failed to create AI model');
      }
      return await res.json();
    } catch (e) {
      throw e;
    }
  },

  // Toggle AI Model
  toggleAIModel: async (modelId: string, isActive: boolean) => {
    try {
      if (isActive) {
        await fetch(`${API_BASE_URL}/admin/ai-models/${modelId}/activate`, {
          method: 'POST',
          headers: getAuthHeaders()
        });
      } else {
        await fetch(`${API_BASE_URL}/admin/ai-models/${modelId}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({ active: false })
        });
      }
      return true;
    } catch (e) {
      throw e;
    }
  },

  updateAIModelCost: async (modelId: string, cost: number) => {
    try {
      await fetch(`${API_BASE_URL}/admin/ai-models/${modelId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ costPerImage: cost })
      });
      return true;
    } catch (e) {
      throw e;
    }
  },

  updateAIModelApiKey: async (modelId: string, apiKey: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/ai-models/${modelId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ config: { apiKey } })
      });
      if (!res.ok) throw new Error('Failed to update API Key');
      return true;
    } catch (e) {
      throw e;
    }
  },

  testAIModelConnection: async (modelId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/ai-models/${modelId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error("Connection failed");
      return true;
    } catch (e) {
      throw e;
    }
  },

  updateAIModelDetails: async (modelId: string, details: { name: string, provider: string }) => {
    try {
      await fetch(`${API_BASE_URL}/admin/config/ai/${modelId}/details`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(details)
      });
      return true;
    } catch (e) {
      throw e;
    }
  },

  clearAICache: async () => {
    try {
      await fetch(`${API_BASE_URL}/admin/config/ai/cache`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return true;
    } catch (e) {
      throw e;
    }
  },



  // Templates Management
  getTemplates: () => fetchWithFallback<Template[]>('/admin/templates', [] as any),

  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_BASE_URL}/admin/upload/template-demo`, {
      method: 'POST',
      headers: getUploadHeaders(),
      body: formData
    });
    if (!res.ok) {
      throw new Error('Backend upload failed');
    }
    const data = await res.json();
    return data.url;
  },

  addTemplate: async (template: Omit<Template, 'id' | 'useCount'>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/templates`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(template)
      });
      if (res.ok) return await res.json();
      throw new Error("Failed to add template");
    } catch (e) {
      throw e;
    }
  },

  updateTemplate: async (id: string, template: Partial<Template>) => {
    try {
      await fetch(`${API_BASE_URL}/admin/templates/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(template)
      });
      return true;
    } catch (e) {
      throw e;
    }
  },

  approveTemplate: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/templates/${id}/approve`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to approve template');
      }
      return await res.json();
    } catch (e) {
      throw e;
    }
  },

  rejectTemplate: async (id: string, reason: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/templates/${id}/reject`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reason })
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to reject template');
      }
      return await res.json();
    } catch (e) {
      throw e;
    }
  },

  deleteTemplate: async (id: string) => {
    try {
      await fetch(`${API_BASE_URL}/admin/templates/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return true;
    } catch (e) {
      throw e;
    }
  },

  bulkUpdateTemplateProperties: async (ids: string[], updates: Partial<Template>) => {
    try {
      await fetch(`${API_BASE_URL}/admin/templates/bulk-update`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ids, updates })
      });
      return true;
    } catch (e) {
      throw e;
    }
  },

  bulkUploadTemplates: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      await fetch(`${API_BASE_URL}/admin/templates/bulk`, {
        method: 'POST',
        headers: getUploadHeaders(), // Do NOT set Content-Type for FormData
        body: formData
      });
      return true;
    } catch (e) {
      throw e;
    }
  },

  syncAirtable: async (config: AirtableConfig) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/templates/airtable-sync`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(config)
      });
      if (res.ok) {
        const data = await res.json();
        return data.templates; // Assuming API returns new templates
      }
      throw new Error("Sync Failed");
    } catch (e) {
      throw e;
    }
  },

  // Category Management
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await fetchWithFallback<any>('/admin/categories', { categories: [] });
      // Handle both old array format and new {success, categories} format
      if (Array.isArray(response)) {
        return response;
      }
      return response.categories || [];
    } catch (e) {
      console.error('Failed to fetch categories:', e);
      return [];
    }
  },

  addCategory: async (category: Omit<Category, 'id'>) => {
    try {
      console.log('📡 API addCategory called');
      console.log('📤 URL:', `${API_BASE_URL}/admin/categories`);
      console.log('📤 Data:', category);

      const res = await fetch(`${API_BASE_URL}/admin/categories`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(category)
      });

      console.log('📡 Status:', res.status, res.statusText);

      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`API Error ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      console.log('✅ Response:', data);
      return data.category || data;
    } catch (e) {
      console.error('❌ addCategory failed:', e);
      throw e;
    }
  },

  updateCategory: async (id: string, updates: Partial<Category>) => {
    try {
      await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      return true;
    } catch (e) {
      throw e;
    }
  },

  deleteCategory: async (id: string) => {
    try {
      await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return true;
    } catch (e) {
      throw e;
    }
  },

  // Sub Admin Management
  getSubAdmins: () => fetchWithFallback<SubAdmin[]>('/admin/system/admins', [] as any),

  createSubAdmin: async (admin: Omit<SubAdmin, 'id' | 'lastActive'>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/system/admins`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(admin)
      });
      if (res.ok) return await res.json();
      throw new Error("Failed");
    } catch (e) {
      throw e;
    }
  },

  deleteSubAdmin: async (id: string) => {
    try {
      await fetch(`${API_BASE_URL}/admin/system/admins/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return true;
    } catch (e) {
      throw e;
    }
  },

  // Notifications
  getNotifications: () => fetchWithFallback<NotificationLog[]>('/admin/notifications', [] as any),

  sendNotification: async (notification: Omit<NotificationLog, 'id' | 'sentAt' | 'reachCount' | 'status'>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/notifications/send`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(notification)
      });
      if (res.ok) return await res.json();
      throw new Error("Failed");
    } catch (e) {
      throw e;
    }
  },

  deleteNotification: async (id: string) => {
    try {
      await fetch(`${API_BASE_URL}/admin/notifications/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return true;
    } catch (e) {
      throw e;
    }
  },

  // Ads Management
  getAdsConfig: () => fetchWithFallback<any>('/admin/ads/config', {} as any),

  updateAdsConfig: async (config: any) => {
    try {
      await fetch(`${API_BASE_URL}/admin/ads/config`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(config)
      });
      return true;
    } catch (e) {
      throw e;
    }
  },

  // Withdrawal Management
  getWithdrawals: async (status?: string) => {
    const query = status ? `?status=${status}` : '';
    return fetchWithFallback<any[]>(`/admin/withdrawals${query}`, [] as any);
  },

  approveWithdrawal: async (id: string, transactionId?: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/withdrawals/${id}/approve`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ transactionId })
      });
      return res.ok;
    } catch (e) {
      throw e;
    }
  },

  rejectWithdrawal: async (id: string, reason?: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/withdrawals/${id}/reject`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reason })
      });
      return res.ok;
    } catch (e) {
      throw e;
    }
  },

  processWithdrawal: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/withdrawals/${id}/process`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      return res.ok;
    } catch (e) {
      throw e;
    }
  },

  getWithdrawalStats: async () => {
    return fetchWithFallback<any>('/admin/withdrawals/stats', {} as any);
  },

  // Admin special actions
  loginAsUser: async (userId: string) => {
    const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/login-as`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to login as user');
    return await res.json();
  },

  sendCreatorNotification: async (userId: string, data: { title: string, message: string, type?: string }) => {
    const res = await fetch(`${API_BASE_URL}/admin/notifications/send-to/${userId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.ok;
  },

  // AI Model Management
  deleteAIModel: async (key: string) => {
    const res = await fetch(`${API_BASE_URL}/admin/ai-models/${key}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || error.error || 'Failed to delete AI model');
    }

    return await res.json();
  },

  // Monetization APIs
  // Popups
  getPopups: () => fetchWithFallback('/admin/monetization/popups', [] as any),
  getPopup: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/admin/monetization/popups/${id}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'Failed to fetch popup' }));
      throw new Error(errorData.message || errorData.error || 'Failed to fetch popup');
    }
    return await res.json();
  },
  createPopup: async (popup: any) => {
    const res = await fetch(`${API_BASE_URL}/admin/monetization/popups`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(popup)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'Failed to create popup' }));
      throw new Error(errorData.message || errorData.error || 'Failed to create popup');
    }
    return await res.json();
  },
  updatePopup: async (id: string, popup: any) => {
    const res = await fetch(`${API_BASE_URL}/admin/monetization/popups/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(popup)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'Failed to update popup' }));
      throw new Error(errorData.message || errorData.error || 'Failed to update popup');
    }
    return await res.json();
  },
  deletePopup: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/admin/monetization/popups/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete popup');
    return await res.json();
  },

  // Offers
  getOffers: () => fetchWithFallback('/admin/monetization/offers', [] as any),
  createOffer: async (offer: any) => {
    const res = await fetch(`${API_BASE_URL}/admin/monetization/offers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(offer)
    });
    if (!res.ok) throw new Error('Failed to create offer');
    return await res.json();
  },
  updateOffer: async (id: string, offer: any) => {
    const res = await fetch(`${API_BASE_URL}/admin/monetization/offers/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(offer)
    });
    if (!res.ok) throw new Error('Failed to update offer');
    return await res.json();
  },
  deleteOffer: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/admin/monetization/offers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete offer');
    return await res.json();
  },

  // Promo Codes
  getPromoCodes: () => fetchWithFallback('/admin/monetization/promo-codes', [] as any),
  createPromoCode: async (promoCode: any) => {
    const res = await fetch(`${API_BASE_URL}/admin/monetization/promo-codes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(promoCode)
    });
    if (!res.ok) throw new Error('Failed to create promo code');
    return await res.json();
  },
  updatePromoCode: async (id: string, promoCode: any) => {
    const res = await fetch(`${API_BASE_URL}/admin/monetization/promo-codes/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(promoCode)
    });
    if (!res.ok) throw new Error('Failed to update promo code');
    return await res.json();
  },
  deletePromoCode: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/admin/monetization/promo-codes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete promo code');
    return await res.json();
  },

  // Top Banners
  getTopBanners: () => fetchWithFallback('/admin/banners/top/banners', [] as any),
  createTopBanner: async (banner: any) => {
    const res = await fetch(`${API_BASE_URL}/admin/banners/top/banners`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(banner)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'Failed to create banner' }));
      throw new Error(errorData.message || errorData.error || 'Failed to create banner');
    }
    return await res.json();
  },
  updateTopBanner: async (id: string, banner: any) => {
    const res = await fetch(`${API_BASE_URL}/admin/banners/top/banners/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(banner)
    });
    if (!res.ok) throw new Error('Failed to update banner');
    return await res.json();
  },
  deleteTopBanner: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/admin/banners/top/banners/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete banner');
    return await res.json();
  }
};

const __env = (typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined);
const DEBUG = false;
const warn = (..._args: any[]) => { };
